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
    PlayerIndex
} from "./common/CommonTypes";
import LabelTypeList from "./label/LabelList";
import {Collapse} from "./common/CommonComponents";
import {NewLabelModal} from "./label/LabelModal";
import {SecondaryButton} from "./common/CommonInput";
import {generateLink, shuffle, toMap, toObject} from "./common/Utils";
import NumberPool from "./common/NumberPool";
import {randomize} from "./common/Random";


const idPool = new NumberPool();

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

const fragment = window.location.hash;
if (fragment) {
    try {
        const statusBase64 = fragment.substring(1);
        console.log("Restore from fragment", statusBase64);
        const jsonStatus = JSON.parse(window.atob(statusBase64));
        console.log("JSON value", jsonStatus);

        const m = new Map();
        for (let value in jsonStatus) {
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
        idPool.reset(status.idPool);
    } finally {
        window.location.hash = '';
    }
}

const App = () => {

    const [players, setPlayers] = React.useState<PlayerIndex>(status.players);
    const [playerOrder, setPlayerOrder] = React.useState<Array<PlayerId>>(status.playerOrder);
    const [labelTypes, setLabelTypes] = React.useState<LabelTypeIndex>(status.labelTypes);
    const [labelItems, setLabelItems] = React.useState<LabelItemIndex>(status.labelItems);
    const [labelModalOpen, setLabelModalOpen] = React.useState<boolean>(false);
    const [link, setLink] = React.useState('');

    const generateStatusAsBase64 = (): string => {
        const status: Status = {
            players: toObject(players),
            labelTypes: toObject(labelTypes),
            labelItems: toObject(labelItems),
            playerOrder: Array.from(playerOrder),
            idPool: idPool.getNext(),
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
        const [newLabelItems, newPlayers] = randomize(idPool, labelTypes, labelItems, players);
        setLabelItems(newLabelItems);
        setPlayers(newPlayers);
    }

    const playerAdded = (player: NewPlayer) => {
        const newPlayer = {
            id: idPool.getNext(),
            labels: new Map(),
            ...player,
        };
        setPlayers(new Map(players.set(newPlayer.id, newPlayer)));
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
            id: idPool.getNext(),
            ...label
        };
        setLabelTypes(new Map(labelTypes.set(newLabel.id, newLabel)));
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
                id: idPool.getNext(),
                typeId: labelItem.labelType,
                name: labelItem.name,
            };
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
                    <h1>{process.env.REACT_APP_NAME}</h1>
                    <sub>{process.env.REACT_APP_VERSION}</sub>
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
                    <div className={"columns"}>
                        <div className={"column is-half"}>
                            <Collapse
                                title={"Players"}
                                subtitle={`${players.size} players`}
                            >
                                <PlayerList
                                    playerAdded={playerAdded}
                                    playerRemoved={playerRemoved}
                                    players={players}/>
                            </Collapse>
                        </div>

                        <div className={"column is-half"}>
                            <Collapse
                                title={"Labels"}
                                subtitle={`${labelTypes.size} label types`}
                            >
                                <div className={"buttons"}>
                                    <NewLabelModal
                                        openButtonTitle={"Custom Label..."}
                                        open={labelModalOpen}
                                        labelAdded={labelAdded}
                                        openModal={openLabelModal}
                                        closeModal={closeLabelModal}
                                    />
                                    <SecondaryButton
                                        onClick={(e) => {
                                            labelTypeAdded({
                                                name: '1st Player',
                                                mode: 'SINGLETON',
                                            });
                                        }}
                                    >
                                        1st player
                                    </SecondaryButton>
                                    <SecondaryButton
                                        onClick={(e) => {
                                            labelTypeAdded({
                                                name: 'Seat',
                                                mode: 'ONE_FOR_EACH_PLAYER',
                                            });
                                        }}
                                    >
                                        Seat
                                    </SecondaryButton>
                                </div>
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
                        </div>
                    </div>

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
