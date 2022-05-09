import React from 'react';
import Table from './turnorder/Table';
import PlayerList from './player//PlayerList'
import './App.scss';
import {
    LabelItem,
    LabelItemId, LabelItemIndex, LabelType,
    LabelTypeId,
    LabelTypeIndex, NewLabelItem,
    NewLabelType,
    NewPlayer,
    Player,
    PlayerId,
    PlayerIndex, PlayerLabel
} from "./common/CommonTypes";
import LabelTypeList from "./label/LabelList";
import {Collapse} from "./common/CommonComponents";
import {NewLabelModal} from "./label/LabelModal";

const shuffle = (array: Array<number>): Array<number> => {
    const shuffled = Array.from(array);
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
};

let idPool = 0;
const incrementId = (): number => {
    idPool++;
    return idPool;
}

interface Status {
    players: PlayerIndex;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
    playerOrder: Array<PlayerId>;
    idPool: number;
}

let status: Status = {
    idPool: 0,
    players: new Map<PlayerId, Player>(),
    labelTypes: new Map<LabelTypeId, LabelType>(),
    labelItems: new Map<LabelTypeId, LabelItem>(),
    playerOrder: new Array<PlayerId>(),
};

const isValueObject = (value: any): boolean => {
    return value !== null && typeof value === 'object';
}

const toMap = (obj: any): Map<any, any> => {
    console.log("Convert object", obj, "to map");
    const m = new Map();
    for (let objKey in obj) {
        const value = obj[objKey];
        const parsedKey = parseInt(objKey);
        const key = Number.isInteger(parsedKey) ? parsedKey : objKey;

        console.log("Key:",
            key, typeof key,
            objKey, typeof objKey
        );

        if (isValueObject(value)) {
            console.log("Convert value to map", key, value);
            m.set(key, value);
        } else if (Array.isArray(value)) {
            console.log("Convert value to array", key, value);
            m.set(key, Array.from(value));
        } else {
            console.log("Assign value", key, value);
            m.set(key, value);
        }
    }
    return m;
}

const toObject = (map: Map<any, any>): any => {
    return Object.fromEntries(Array.from(map.entries(), ([k, v]) => {
        if (v instanceof Array) {
            return [k, v.map(toObject)];
        } else if (v instanceof Map) {
            return [k, toObject(v)];
        } else {
            return [k, v];
        }
    }));
}

const generateLink = (fragment: string) => {
    const href = window.location.href;
    return href.substring(0, href.indexOf("#")) + "#" + fragment;
}

const fragment = window.location.hash;
if (fragment) {
    try {
        const statusBase64 = fragment.substring(1);
        console.log("Restore from fragment", statusBase64);
        const jsonStatus = JSON.parse(window.atob(statusBase64));
        console.log("JSON value", jsonStatus);

        const m = new Map();
        for (var value in jsonStatus) {
            m.set(value, new Map(Object.entries(jsonStatus[value])));
        }
        status = {
            players: toMap(jsonStatus["players"]),
            labelTypes: toMap(jsonStatus["labelTypes"]),
            labelItems: toMap(jsonStatus["labelItems"]),
            playerOrder: Array.from(jsonStatus["playerOrder"]),
            idPool: jsonStatus["idPool"],
        };
        console.log("Restored status", status);
        idPool = status.idPool;
    } finally {
        window.location.hash = '';
    }
}

const App = () => {

    console.dir('Status');
    console.dir(status);
    const [players, setPlayers] = React.useState<PlayerIndex>(status.players);
    const [playerOrder, setPlayerOrder] = React.useState<Array<PlayerId>>(status.playerOrder);
    const [labelTypes, setLabelTypes] = React.useState<LabelTypeIndex>(status.labelTypes);
    const [labelItems, setLabelItems] = React.useState<LabelItemIndex>(status.labelItems);
    const [labelModalOpen, setLabelModalOpen] = React.useState<boolean>(false);
    const [link, setLink] = React.useState('');

    const generateStatusAsBase64 = (): string => {
        const status = {
            players: toObject(players),
            labelTypes: toObject(labelTypes),
            labelItems: toObject(labelItems),
            playerOrder: Array.from(playerOrder),
            idPool: idPool,
        };

        const statusJson = JSON.stringify(status);
        return window.btoa(statusJson);
    };

    const openLabelModal = () => {
        setLabelModalOpen(true);
    }
    const closeLabelModal = () => {
        setLabelModalOpen(false);
    }

    const resetPlayerOrder = () => {
        setPlayerOrder(Array.from(players).map(([id]) => id));
    }

    const randomizePlayers = () => {
        resetPlayerOrder();
        const newOrder = shuffle(playerOrder);
        setPlayerOrder(newOrder);
    }

    const randomizeLabels = () => {
        // 0. Generate index so that there are no dynamic items
        const newLabelItems = new Map();
        Array.from(labelItems).map(([typeId, itemMap]) => {
            const type = labelTypes.get(typeId);
            if (type && (type.mode === "TEXT" || type.mode === "NUMBER")) {
                console.log("Add static items", typeId);
                labelItems.set(itemMap.id, itemMap);
            }
        });
        Array.from(labelTypes).forEach(([typeId, _]) => {
            if (!newLabelItems.get(typeId)) {
                newLabelItems.set(typeId, new Map());
            }
        })
        console.log("Cleaned items: ", newLabelItems);

        // 1. For each label type, make a list of labels to add
        const labelsToRandomize: Map<LabelTypeId, Array<LabelItem>> = new Map();
        labelTypes.forEach(type => {
            console.log(`Label type: ${type.id}; ${type.name}; ${type.mode}`)
            if (type.mode === "TEXT" || type.mode === "NUMBER") {
                const ii = Array.from(labelItems)
                    .filter(([_, labelItem]) => labelItem.typeId === type.id)
                    .map(([_, labelItem]) => {
                        return {...labelItem}
                    });
                ii.forEach(item =>
                    newLabelItems.set(item.id, item)
                );
                labelsToRandomize.set(type.id, ii);
            } else if (type.mode === "SINGLETON") {
                const dynamicItems = [{
                    id: incrementId(),
                    name: type.name,
                    typeId: type.id
                }];
                dynamicItems.forEach(item => {
                    newLabelItems.set(item.id, item);
                });
                labelsToRandomize.set(type.id, dynamicItems);
            } else if (type.mode === "ONE_FOR_EACH_PLAYER") {
                const dynamicItems = Array.from(players).map(([_], index) => {
                    return {
                        id: incrementId(),
                        name: '' + (index + 1),
                        typeId: type.id,
                    }
                });
                dynamicItems.forEach(item => {
                    newLabelItems.set(item.id, item);
                });
                labelsToRandomize.set(type.id, dynamicItems);
            }
        });

        console.log("labelsToRandomize", labelsToRandomize);

        // 2. For each player, clear all non-fixed labels
        const newPlayers = new Map(players);
        Array.from(newPlayers).forEach(([id, player]) => {
            player.labels = new Map<LabelTypeId, PlayerLabel>();
        });

        const playerPool = Array.from(newPlayers).map(([id, player]) => {
            return id;
        });

        // 3. For each label type, set random labels and remove from the list
        labelsToRandomize.forEach((items, typeId) => {
            // Shuffle the player order so that the same players don't always get the labels
            // where there are no labels for everyone
            shuffle(playerPool).forEach((playerId) => {
                const player = newPlayers.get(playerId);
                // Make sure that there is a player, there are more labels
                // and that player doesn't already have a label for that type
                if (player && items.length > 0 && !player.labels.get(typeId)) {
                    const randomIndex = Math.floor(Math.random() * items.length);
                    const randomLabelItem = items[randomIndex];
                    items.splice(randomIndex, 1)
                    const playerLabel: PlayerLabel = {
                        dynamic: false,
                        itemId: randomLabelItem.id,
                        typeId: typeId,
                    }
                    player.labels.set(typeId, playerLabel);
                }
            });
        });

        console.log("Augmented items: ", newLabelItems);
        setLabelItems(newLabelItems);
        setPlayers(newPlayers);
    }

    const playerAdded = (player: NewPlayer) => {
        const newPlayer = {
            id: idPool,
            labels: new Map(),
            ...player,
        };
        setPlayers(new Map(players.set(newPlayer.id, newPlayer)));
        incrementId();
        resetPlayerOrder();
        setLink('');
    }

    const playerRemoved = (id: PlayerId) => {
        const withRemoved = new Map(players);
        withRemoved.delete(id)
        setPlayers(withRemoved);
        resetPlayerOrder();
        setLink('');
    }

    const labelTypeAdded = (label: NewLabelType) => {
        const newLabel = {
            id: idPool,
            ...label
        };
        setLabelTypes(new Map(labelTypes.set(newLabel.id, newLabel)));
        incrementId();
        setLink('');
        return newLabel;
    }

    const labelAdded = (label: NewLabelType, items: Array<NewLabelItem>) => {
        const type = labelTypeAdded(label);
        items.forEach((item) => {
            item.labelType = type.id
        });
        labelItemsAdded(items);
        setLink('');

    }

    const labelTypeRemoved = (id: LabelTypeId) => {
        const withRemoved = new Map(labelTypes);
        withRemoved.delete(id)
        setLabelTypes(withRemoved);
        setLink('');
    }

    const labelItemsAdded = (labelItemsToAdd: Array<NewLabelItem>) => {
        const newItems = new Map<LabelItemId, LabelItem>(labelItems);
        labelItemsToAdd.forEach((labelItem) => {
            const newLabelItem: LabelItem = {
                id: idPool,
                typeId: labelItem.labelType,
                name: labelItem.name,
            };
            incrementId();
            const label = labelTypes.get(labelItem.labelType);

            console.log(`Label item ${labelItem.name} added to type ${label?.name}`)

            newItems.set(newLabelItem.id, newLabelItem);
            console.dir(newItems);
        });

        setLabelItems(newItems);
        setLink('');
    }

    const labelItemAdded = (labelItem: NewLabelItem) => {
        labelItemsAdded([labelItem]);
        setLink('');
    }

    const labelItemRemoved = (typeId: LabelTypeId, itemId: LabelItemId) => {
        const withRemoved = new Map(labelItems);
        withRemoved.delete(itemId);
        setLabelItems(withRemoved);
        setLink('');
    }

    const labelItemChanged = (typeId: LabelTypeId, item: LabelItem) => {
        const withChanged = new Map(labelItems);
        withChanged.set(item.id, {...item});
        setLabelItems(withChanged);
        setLink('');
    }

    return (
        <div className="App">
            <header className="App-header navbar">
                <div className="App-header-container">
                    <h1>Turn Order Randomizer</h1>
                    <sub>2.0.0-alpha</sub>
                </div>
            </header>
            <section className={"link-container navbar"}>
                <button
                    className={"button is-link"}
                    onClick={(e) => setLink(generateLink(generateStatusAsBase64()))}
                >
                    Generate Link
                </button>
                <div className={"link"}>
                    {!!link && <a href={link}>{link}</a>}
                </div>
            </section>
            <main className={"section"}>
                <div className={"container"}>
                    <Collapse
                        title={"Players"}
                        subtitle={`${players.size} players`}
                    >
                        <PlayerList
                            playerAdded={playerAdded}
                            playerRemoved={playerRemoved}
                            players={players}/>
                    </Collapse>
                    <Collapse
                        title={"Labels"}
                        subtitle={`${labelTypes.size} label types`}
                    >
                        <NewLabelModal
                            openButtonTitle={"Add Label"}
                            open={labelModalOpen}
                            labelAdded={labelAdded}
                            openModal={openLabelModal}
                            closeModal={closeLabelModal}
                        />
                        <div className={"block"}/>
                        <LabelTypeList
                            labelTypeAdded={labelTypeAdded}
                            labelTypeRemoved={labelTypeRemoved}

                            labelItemAdded={labelItemAdded}
                            labelItemRemoved={labelItemRemoved}
                            labelItemChanged={labelItemChanged}

                            labels={labelTypes}
                            labelItems={labelItems}
                        />
                    </Collapse>
                    <Table
                        players={players}
                        playerOrder={playerOrder}
                        randomizePlayers={randomizePlayers}
                        randomizeLabels={randomizeLabels}
                        labelTypes={labelTypes}
                        labelItems={labelItems}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
