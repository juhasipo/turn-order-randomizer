import {
    LabelItem,
    LabelItemIndex, LabelRef,
    LabelTypeId,
    LabelTypeIndex,
    PlayerId,
    PlayerIndex,
    PlayerLabelIndex
} from "./CommonTypes";
import {clamp, RandomProvider, ShuffleFunc} from "./Utils";
import NumberPool from "./NumberPool";

export const nextRandomNumber: RandomProvider = (min: number, max: number, randomFunc: () => number): number => {
    // +1 is required because otherwise the max value would almost never be returned due to random returning 1.0
    // is very rare. Also, the value needs to clamped to be between min and max because in case the 1.0 is returned
    // by the randomFunc, the value would be too big.
    return clamp(Math.floor(randomFunc() * (max - min + 1) + min), min, max);
}

export const shuffle: ShuffleFunc = (array: Array<number>): Array<number> => {
    const shuffled = Array.from(array);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[randomIndex];
        shuffled[randomIndex] = temp;
    }
    return shuffled;
};

export function clearItemIndex(labelTypes: LabelTypeIndex, labelItems: LabelItemIndex): LabelItemIndex {
    const newLabelItems: LabelItemIndex = new Map();
    // Filter out label items that are not dynamically generated
    Array.from(labelItems).forEach(([_, item]) => {
        const type = labelTypes.get(item.typeId);
        if (type && (type.mode === "TEXT" || type.mode === "NUMBER")) {
            console.log("Add static items for type", type.id, type.name);
            newLabelItems.set(item.id, item);
        }
    });
    console.log("Cleaned items: ", newLabelItems);
    return newLabelItems;
}

export function generateLabelPoolWithDynamicItems(
    idPool: NumberPool,
    labelTypes: LabelTypeIndex,
    labelItems: LabelItemIndex,
    players: PlayerIndex
): Map<LabelTypeId, Array<LabelItem>> {
    const labelItemPool: Map<LabelTypeId, Array<LabelItem>> = new Map();
    labelTypes.forEach(type => {
        console.log(`Label type: ${type.id}; ${type.name}; ${type.mode}`)
        if (type.mode === "TEXT" || type.mode === "NUMBER") {
            const itemsToAdd = Array.from(labelItems)
                .filter(([_, labelItem]) => labelItem.typeId === type.id)
                .map(([_, labelItem]) => {
                    return {...labelItem}
                });
            labelItemPool.set(type.id, itemsToAdd);
        } else if (type.mode === "SINGLETON") {
            const dynamicItems = [{
                id: idPool.getNext(),
                name: type.name,
                typeId: type.id
            }];
            labelItemPool.set(type.id, dynamicItems);
        } else if (type.mode === "ONE_FOR_EACH_PLAYER") {
            const dynamicItems = Array.from(players).map(([_], index) => {
                return {
                    id: idPool.getNext(),
                    name: '' + (index + 1),
                    typeId: type.id,
                }
            });
            labelItemPool.set(type.id, dynamicItems);
        }
    });

    console.log("labelItemPool", labelItemPool);
    return labelItemPool;
}

export function randomizeLabelsForPlayers(
    labelItemPool: Map<LabelTypeId, Array<LabelItem>>,
    playerPool: number[],
    players: PlayerIndex,
    shuffleFunc: ShuffleFunc,
    randomProvider: RandomProvider
): PlayerLabelIndex {
    const labels: PlayerLabelIndex = new Map<PlayerId, Array<LabelRef>>();

    labelItemPool.forEach((items, typeId) => {
        // Shuffle the player order so that the same players don't always get the labels
        // where there are no labels for everyone
        shuffleFunc(playerPool).forEach((playerId) => {
            let labelArray = labels.get(playerId);
            if (!labelArray) {
                labelArray = [];
                labels.set(playerId, labelArray);
            }

            // Make sure that there is a player, there are more labels
            // and that player doesn't already have a label for that type
            if (items.length > 0) {
                const randomIndex = randomProvider(0, items.length-1, Math.random);
                const randomLabelItem = items[randomIndex];
                items.splice(randomIndex, 1)
                const playerLabel: LabelRef = {
                    itemId: randomLabelItem.id,
                    typeId: typeId,
                }
                labelArray.push(playerLabel);
            }
        });
    });

    return labels;
}

export function randomize(
    idPool: NumberPool,
    labelTypes: LabelTypeIndex,
    labelItems: LabelItemIndex,
    players: PlayerIndex,
    shuffleFunc: ShuffleFunc = shuffle,
    randomProvider: RandomProvider = nextRandomNumber
): [LabelItemIndex, PlayerLabelIndex] {
    // 1. Generate index so that there are no dynamic items
    const newLabelItems = clearItemIndex(labelTypes, labelItems);

    // 2. For each label type, make a list of labels to add
    // This also generates the dynamic items
    const labelItemPool = generateLabelPoolWithDynamicItems(idPool, labelTypes, newLabelItems, players);

    // 3. Add dynamic labels to item index so that the item index can be
    // used in the UI for searching for the items
    Array.from(labelItemPool).forEach(([_, labelItems]) => {
        labelItems.forEach(item => {
            if (!newLabelItems.get(item.id)) {
                newLabelItems.set(item.id, item);
            }
        })
    });

    // 4. Create layer pool which order can be randomized during the randomization phase
    const playerPool = Array.from(players).map(([id, player]) => {
        return id;
    });

    // 5. For each label type, set random labels and remove from the pool
    const playerLabels = randomizeLabelsForPlayers(labelItemPool, playerPool, players, shuffleFunc, randomProvider);

    console.log("Labels: ", playerLabels);
    console.log("New label items: ", newLabelItems);
    return [newLabelItems, playerLabels];
}
