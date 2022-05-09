import * as React from 'react';
import {
    LabelItem,
    LabelItemIndex,
    LabelType,
    LabelTypeId,
    LabelTypeIndex,
    Player,
    PlayerId,
    PlayerIndex,
    PlayerLabel
} from "../common/CommonTypes";
import {PrimaryButton, SecondaryButton} from "../common/CommonInput";
import './Table.scss'
import {Collapse} from "../common/CommonComponents";

export interface Props {
    players: PlayerIndex;
    playerOrder: Array<PlayerId>;
    randomizePlayers: () => void;
    randomizeLabels: () => void;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
}

export interface PlayerLabelProps {
    labels: Map<LabelTypeId, PlayerLabel>;
    labelTypes: LabelTypeIndex;
    labelItems: LabelItemIndex;
}

const PlayerLabels = (props: PlayerLabelProps) => {

    const getLabel = (type: LabelType, item: LabelItem) => {
        return (
            <div key={type.id + '-' + item.id} className={"label-item"}>
                <span className={"label-item-type"}>{type.name}</span>
                <span className={"label-item-name"}>{item.name}</span>
            </div>
        )
    }

    const getLabels = () => {
        const p = props;
        return Array.from(props.labels).map(([id, playerLabel]) => {
            const type = p.labelTypes.get(playerLabel.typeId);
            const item = p.labelItems.get(playerLabel.typeId)?.get(playerLabel.itemId);

            if (type && item) {
                return getLabel(type, item);
            } else {
                return (<></>)
            }
        })
    }

    return (
        <div className={"player-labels"}>
            {getLabels()}
        </div>
    )
}

export default class Table extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    getPlayerItem = (player: Player|undefined, labelTypes: LabelTypeIndex, labelItems: LabelItemIndex) => {
        if (player) {
            return (
                <div key={player.name} className={"card"}>
                    <header className={"card-header"}>
                        <p className={"card-header-title"}>{player.name}</p>
                    </header>
                    <div className={"card-content"}>
                        <PlayerLabels
                            labels={player.labels}
                            labelTypes={labelTypes}
                            labelItems={labelItems}
                        />
                    </div>
                </div>
            )
        } else {
            return (<></>)
        }
    }

    getPlayerItems = (players: PlayerIndex, playerOrder: Array<PlayerId>, labelTypes: LabelTypeIndex, labelItems: LabelItemIndex) => {
        return playerOrder.map(id => this.getPlayerItem(players.get(id), labelTypes, labelItems));
    }

    render() {
        return (
            <Collapse
                title={"Results"}
                openByDefault={true}
                actions={(
                    <>
                        <PrimaryButton onClick={this.props.randomizePlayers}>Randomize Turn Order</PrimaryButton>
                        <SecondaryButton onClick={this.props.randomizeLabels}>Randomize Labels</SecondaryButton>
                    </>
                )}
            >
                <div className={"player-cards"}>{this.getPlayerItems(this.props.players, this.props.playerOrder, this.props.labelTypes, this.props.labelItems)}</div>
            </Collapse>
        );
    }
}
