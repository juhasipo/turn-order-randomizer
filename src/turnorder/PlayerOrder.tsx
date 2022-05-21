import * as React from 'react';
import {
    LabelItem,
    LabelItemIndex, LabelRef,
    LabelType,
    LabelTypeIndex,
    Player,
    PlayerId,
    PlayerIndex,
    PlayerLabelIndex
} from "../common/CommonTypes";
import {PrimaryButton, SecondaryButton} from "../common/CommonInput";
import './PlayerOrder.scss'
import {Collapse} from "../common/CommonComponents";

export interface Props {
    players: PlayerIndex;
    playerOrder: Array<PlayerId>;
    randomizePlayers: () => void;
    randomizeLabels: () => void;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
    playerLabels: PlayerLabelIndex;
}

export interface PlayerLabelProps {
    player: Player|undefined;
    labels?: Array<LabelRef>;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
}

const PlayerLabels = (props: PlayerLabelProps) => {

    const getLabel = (type: LabelType, item: LabelItem) => {
        if (type.mode === "TEXT" || type.mode === "NUMBER") {
            return (
                <div key={type.id + '-' + item.id} className={"label-item"}>
                    <span className={"label-item-type"}>{type.name}</span>
                    <span className={"label-item-name"}>{item.name}</span>
                </div>
            )
        } else if (type.mode === "SINGLETON") {
            return (
                <div key={type.id + '-' + item.id} className={"label-item"}>
                    <span className={"label-item-type"}>{type.name}</span>
                </div>
            )
        } else if (type.mode === "ONE_FOR_EACH_PLAYER") {
            return (
                <div key={type.id + '-' + item.id} className={"label-item"}>
                    <span className={"label-item-type"}>{type.name}</span>
                    <span className={"label-item-name"}>{item.name}</span>
                </div>
            )
        }
    }

    const getLabels = () => {
        const p = props;
        return props.labels?.map(labelRef => {
            const type = p.labelTypes.get(labelRef.typeId);
            const item = p.labelItems.get(labelRef.itemId);

            if (type && item) {
                return getLabel(type, item);
            } else {
                return (<></>)
            }
        })
    }

    const hasLabels = (labels?: Array<LabelRef>) => {
        return !!labels && labels.length > 0;
    }

    if (hasLabels(props.labels)) {
        return (
            <div className={"player-labels"}>
                {getLabels()}
            </div>
        )
    } else {
        return (
            <div className={"player-labels"}>
                <div className={"player-no-labels"}>No labels</div>
            </div>
        )
    }
}

export default class PlayerOrder extends React.Component<Props, any> {

    getPlayerItem = (order: number, player: Player|undefined, labelTypes: LabelTypeIndex, labelItems: LabelItemIndex, playerLabels: PlayerLabelIndex) => {
        if (player) {
            return (
                <div key={'player-' + player.id} className={"column is-one-quarter"}>
                    <div className={"card"}>
                        <header className={"card-header"}>
                            <p className={"card-header-title"}>
                                <span className={"player-order-no"}>{order}</span>
                                <span className={"player-order-separator"}>: </span>
                                <span className={"player-name"}>{player.name}</span>
                            </p>
                        </header>
                        <div className={"card-content"}>
                            <PlayerLabels
                                player={player}
                                labels={playerLabels.get(player.id)}
                                labelTypes={labelTypes}
                                labelItems={labelItems}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<></>)
        }
    }

    getPlayerItems = (players: PlayerIndex, playerOrder: Array<PlayerId>, labelTypes: LabelTypeIndex, labelItems: LabelItemIndex, labels: PlayerLabelIndex) => {
        return playerOrder.map((id, index) => {
            return this.getPlayerItem(index + 1, players.get(id), labelTypes, labelItems, labels)
        });
    }

    render() {
        return (
            <Collapse
                title={"Results"}
                openByDefault={true}
                actions={[
                    <PrimaryButton onClick={this.props.randomizePlayers}>Randomize Turn Order</PrimaryButton>,
                    <SecondaryButton onClick={this.props.randomizeLabels}>Randomize Labels</SecondaryButton>
                ]}
            >
                <div className={"columns is-multiline"}>
                    {this.getPlayerItems(this.props.players, this.props.playerOrder, this.props.labelTypes, this.props.labelItems, this.props.playerLabels)}
                </div>
            </Collapse>
        );
    }
}
