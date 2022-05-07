import * as React from 'react';
import {Player, PlayerId, PlayerIndex} from "../common/CommonTypes";
import {PrimaryButton} from "../common/CommonInput";

export interface Props {
    players: PlayerIndex;
    playerOrder: Array<PlayerId>;
    randomizePlayers: () => void;
}

export default class Table extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    getPlayerItem = (player: Player|undefined) => {
        if (player) {
            return (
                <li key={player.name}>{player.name}</li>
            )
        } else {
            return (<></>)
        }
    }

    getPlayerItems = (players: PlayerIndex, playerOrder: Array<PlayerId>) => {
        return playerOrder.map(id => this.getPlayerItem(players.get(id)));
    }

    render() {
        return (
            <div className={'table'}>
                <h2>Table</h2>
                <PrimaryButton onClick={this.props.randomizePlayers}>Randomize Turn Order</PrimaryButton>
                <ol>{this.getPlayerItems(this.props.players, this.props.playerOrder)}</ol>
            </div>
        );
    }
}
