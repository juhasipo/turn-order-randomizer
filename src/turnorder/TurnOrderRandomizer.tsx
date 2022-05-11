import {Collapse} from "../common/CommonComponents";
import PlayerList from "../player/PlayerList";
import {NewLabelModal} from "../label/LabelModal";
import {SecondaryButton} from "../common/CommonInput";
import LabelTypeList from "../label/LabelList";
import React, {useState} from "react";
import PlayerOrder from "./PlayerOrder";
import {
    LabelItem,
    LabelItemId,
    LabelItemIndex, LabelTypeId,
    LabelTypeIndex,
    NewLabelItem,
    NewLabelType,
    NewPlayer,
    PlayerId,
    PlayerIndex, Status
} from "../common/CommonTypes";
import {generateLink, shuffle, toObject} from "../common/Utils";
import {randomize} from "../common/Random";
import NumberPool from "../common/NumberPool";

export interface Props {
    idPool: NumberPool;
    initialStatus: Status;
}

export const TurnOrderRandomizer = (props: Props) => {

    const {idPool} = props;
    const status = props.initialStatus;

    const [players, setPlayers] = React.useState<PlayerIndex>(status.players);
    const [playerOrder, setPlayerOrder] = React.useState<Array<PlayerId>>(status.playerOrder);
    const [labelTypes, setLabelTypes] = React.useState<LabelTypeIndex>(status.labelTypes);
    const [labelItems, setLabelItems] = React.useState<LabelItemIndex>(status.labelItems);
    const [link, setLink] = React.useState('');
    const [labelModalOpen, setLabelModalOpen] = React.useState<boolean>(false);

    const openLabelModal = () => {
        setLabelModalOpen(true);
    }
    const closeLabelModal = () => {
        setLabelModalOpen(false);
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

    const resetPlayerOrder = () => {
        setPlayerOrder(Array.from(players).map(([id]) => id));
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
        <div className={"container"}>

            <section className={"link-container navbar block"}>
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

            <PlayerOrder
                players={players}
                playerOrder={playerOrder}
                randomizePlayers={randomizePlayers}
                randomizeLabels={randomizeLabels}
                labelTypes={labelTypes}
                labelItems={labelItems}
            />
        </div>
    )
}
