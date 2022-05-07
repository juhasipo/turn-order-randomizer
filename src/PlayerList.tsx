import * as React from 'react';
import {Player, NewPlayer, PlayerIndex, PlayerId} from "./CommonTypes";
import AddPlayer from "./AddPlayer";
import {RemoveButton} from "./CommonInput";

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
            <li key={player.name}>
                <span>{player.name}</span>
                <span className={"actions"}>
                    <RemoveButton onClick={(e) => this.props.playerRemoved(player.id)}/>
                </span>
            </li>
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
                <ol>{this.getPlayerItems(this.props.players)}</ol>
            </div>
        );
    }
}
