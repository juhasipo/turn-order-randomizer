import React from 'react';
import Table from './turnorder/Table';
import PlayerList from './player//PlayerList'
import './App.scss';
import {
    LabelItem,
    LabelItemId, LabelItemIndex,
    LabelTypeId,
    LabelTypeIndex, NewLabelItem,
    NewLabelType,
    NewPlayer,
    Player,
    PlayerId,
    PlayerIndex, PlayerLabel
} from "./common/CommonTypes";
import LabelTypeList from "./label/LabelList";

const defaultPlayers: PlayerIndex = new Map<PlayerId, Player>();

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

const App = () => {

    const [players, setPlayers] = React.useState<PlayerIndex>(defaultPlayers);
    const [idPool, setIdPool] = React.useState<PlayerId>(1);
    const [playerOrder, setPlayerOrder] = React.useState<Array<PlayerId>>([]);
    const [labelTypes, setLabelTypes] = React.useState<LabelTypeIndex>(new Map());
    const [labelItems, setLabelItems] = React.useState<LabelItemIndex>(new Map());

    const incrementId = () => {
        setIdPool(idPool + 1);
    }

    const resetPlayerOrder = () => {
        setPlayerOrder(Array.from(players).map(([id]) => id));
    }

    const randomizePlayers = () => {
        resetPlayerOrder();
        setPlayerOrder(shuffle(playerOrder));
    }

    const randomizeLabels = () => {
        // TODO: Implement
        // 1. For each label type, make a list of labels to add
        const labelsToRandomize: Map<LabelTypeId, Array<LabelItem>> = new Map();
        labelTypes.forEach(type => {
            const items = labelItems.get(type.id);
            if (items) {
                labelsToRandomize.set(type.id, Array.from(items).map(([itemId, labelItem]) => {
                    return {...labelItem}
                }));
            }
        })
        console.log('labelsToRandomize');
        console.dir(labelsToRandomize);

        // 2. For each player, clear all non-fixed labels
        const newPlayers = new Map(players);
        Array.from(newPlayers).forEach(([id, player]) => {
            player.labels = new Map<LabelTypeId, PlayerLabel>();
        })
        console.log('newPlayers');
        console.dir(newPlayers);

        const playerPool = Array.from(newPlayers).map(([id, player]) => {
            return id;
        });
        console.log('Player process order' + playerPool);

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
                        fixed: false,
                        itemId: randomLabelItem.id,
                        typeId: typeId,
                    }
                    player.labels.set(typeId, playerLabel);
                }
            });
        });

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
    }

    const playerRemoved = (id: PlayerId) => {
        const withRemoved = new Map(players);
        withRemoved.delete(id)
        setPlayers(withRemoved);
        resetPlayerOrder();
    }

    const labelTypeAdded = (label: NewLabelType) => {
        const newLabel = {
            id: idPool,
            ...label
        };
        setLabelTypes(new Map(labelTypes.set(newLabel.id, newLabel)));
        incrementId();
    }

    const labelTypeRemoved = (id: LabelTypeId) => {
        const withRemoved = new Map(labelTypes);
        withRemoved.delete(id)
        setLabelTypes(withRemoved);
    }

    const labelItemAdded = (labelItem: NewLabelItem) => {
        const newLabelItem = {
            id: idPool,
            ...labelItem
        };
        const label = labelTypes.get(labelItem.labelType);

        console.log(`Label item ${labelItem.name} added to type ${label?.name}`)
        const newItems = new Map(labelItems);
        let itemsForLabel = newItems.get(labelItem.labelType);
        if (itemsForLabel) {
            itemsForLabel.set(newLabelItem.id, newLabelItem)
        } else {
            const newMap = new Map();
            newMap.set(newLabelItem.id, newLabelItem);
            newItems.set(labelItem.labelType, newMap);
        }

        setLabelItems(newItems);
        incrementId();
    }

    const labelItemRemoved = (typeId: LabelTypeId, itemId: LabelItemId) => {
        const withRemoved = new Map(labelItems);
        withRemoved.get(typeId)?.delete(itemId);
        setLabelItems(withRemoved);
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="App-header-container">
                    <h1>Turn Order Randomizer</h1>
                    <sub>2.0.0</sub>
                </div>
            </header>
            <main>
                <LabelTypeList
                    labelTypeAdded={labelTypeAdded}
                    labelTypeRemoved={labelTypeRemoved}

                    labelItemAdded={labelItemAdded}
                    labelItemRemoved={labelItemRemoved}

                    labels={labelTypes}
                    labelItems={labelItems}
                />
                <PlayerList
                    playerAdded={playerAdded}
                    playerRemoved={playerRemoved}
                    players={players}/>
                <Table
                    players={players}
                    playerOrder={playerOrder}
                    randomizePlayers={randomizePlayers}
                    randomizeLabels={randomizeLabels}
                    labelTypes={labelTypes}
                    labelItems={labelItems}
                />
            </main>
        </div>
    );
}

export default App;
