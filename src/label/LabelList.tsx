import * as React from 'react';
import {
    LabelTypeId,
    LabelTypeIndex,
    NewLabelType,
    LabelType, NewLabelItem, LabelItemId, LabelItemIndex, LabelItemMap, LabelItem
} from "../common/CommonTypes";
import {PrimaryButton, RemoveButton} from "../common/CommonInput";
import {AddLabelType, AddLabelItem} from "./AddLabel";

export interface Props {
    labelTypeAdded: (label: NewLabelType) => void;
    labelTypeRemoved: (typeId: LabelTypeId) => void;
    labelItemAdded: (label: NewLabelItem) => void;
    labelItemRemoved: (typeId: LabelTypeId, itemId: LabelItemId) => void;
    labels: LabelTypeIndex;
    labelItems: LabelItemIndex;
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

    getLabelItem = (labelTypeId: LabelTypeId, labelItem: LabelItem) => {
        return (
            <li key={labelItem.id} className={"label-item"}>
                <span>Item: {labelItem.name}</span>
                <span className={"actions"}>
                <RemoveButton onClick={(e) => this.props.labelItemRemoved(labelTypeId, labelItem.id)}/>
            </span>
            </li>
        )
    }

    getLabelItems = (labelTypeId: LabelTypeId, labelItems: LabelItemMap) => {
        return (
            <>
                {Array.from(labelItems).map(([id, label]) => this.getLabelItem(labelTypeId, label))}
            </>
        )
    }

    getLabelTypeItem = (label: LabelType, labelItems: LabelItemIndex) => {
        return (
            <li key={label.name} className={"label-type"}>
                <span>Label type: {label.name}</span>
                <span className={"actions"}>
                    <RemoveButton onClick={(e) => this.props.labelTypeRemoved(label.id)}/>
                </span>
                <ol className={"label-items"}>
                    <li>
                        <AddLabelItem
                            labelTypeId={label.id}
                            labelItemAdded={this.props.labelItemAdded}
                        />
                    </li>
                    {this.getLabelItems(label.id, labelItems.get(label.id) || new Map())}
                </ol>
            </li>
        )
    }

    getLabelTypeItems = (labels: LabelTypeIndex, labelItems: LabelItemIndex) => {
        return Array.from(labels)
            .sort((p1, p2) => sortByName(p1[1].name, p2[1].name))
            .map(([id, labelTypes]) => this.getLabelTypeItem(labelTypes, labelItems))
            ;
    }

    render() {
        return (
            <div className={"PlayerList"}>
                <AddLabelType labelAdded={this.props.labelTypeAdded}/>
                <ol className={"label-types"}>
                    {this.getLabelTypeItems(this.props.labels, this.props.labelItems)}
                </ol>
            </div>
        );
    }
}
