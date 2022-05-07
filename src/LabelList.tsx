import * as React from 'react';
import {
    Player,
    NewPlayer,
    PlayerIndex,
    PlayerId,
    LabelTypeId,
    LabelTypeIndex,
    NewLabelType,
    LabelType
} from "./CommonTypes";
import AddPlayer from "./AddPlayer";
import {RemoveButton} from "./CommonInput";
import AddLabel from "./AddLabel";

export interface Props {
    labelTypeAdded: (label: NewLabelType) => void;
    labelTypeRemoved: (name: LabelTypeId) => void;
    labels: LabelTypeIndex;
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

export default class LabelTypeList extends React.Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    getLabelItem = (label: LabelType) => {
        return (
            <li key={label.name}>
                <span>{label.name}</span>
                <span className={"actions"}>
                    <RemoveButton onClick={(e) => this.props.labelTypeRemoved(label.id)}/>
                </span>
            </li>
        )
    }

    getLabelTypeItems = (labels: LabelTypeIndex) => {
        return Array.from(labels)
            .sort((p1, p2) => sortByName(p1[1].name, p2[1].name))
            .map(([id, player]) => this.getLabelItem(player))
            ;
    }

    render() {
        console.log(this.props.labels);

        return (
            <div className={"PlayerList"}>
                <AddLabel labelAdded={this.props.labelTypeAdded} />
                <ol>{this.getLabelTypeItems(this.props.labels)}</ol>
            </div>
        );
    }
}
