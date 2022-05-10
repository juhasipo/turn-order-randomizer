import * as React from 'react';
import {Player, NewPlayer, PlayerIndex, PlayerId} from "../common/CommonTypes";
import AddPlayer from "./AddPlayer";
import {RemoveButton} from "../common/CommonInput";

export interface Props {
    playerAdded: (player: NewPlayer) => void;
    playerRemoved: (name: PlayerId) => void;
    players: PlayerIndex;
}

const sortByName = (nameA: string, nameB: string) => {
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}

export default class PlayerList extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    getPlayerItem = (player: Player) => {
        return (
            <div
              key={'player-' + player.id}
              className={"column is-half"}
            >
                <div className={"card"}>
                    <div className={"card-header"}>
                        <div className={"card-header-title"}>{player.name}</div>
                        <div className={"card-header-icon"}>
                            <RemoveButton onClick={(e) => this.props.playerRemoved(player.id)}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getPlayerItems = (players: PlayerIndex) => {
        return Array.from(players)
            .sort((p1, p2) => sortByName(p1[1].name, p2[1].name))
            .map(([id, player]) => this.getPlayerItem(player))
            ;
    }

    render() {
        return (
            <div className={"PlayerList"}>
                <AddPlayer playerAdded={this.props.playerAdded} />
                <div className={"columns is-multiline"}>
                    {this.getPlayerItems(this.props.players)}
                </div>
            </div>
        );
    }
}
