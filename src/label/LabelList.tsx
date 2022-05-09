import * as React from 'react';
import {
    LabelTypeId,
    LabelTypeIndex,
    NewLabelType,
    LabelType, NewLabelItem, LabelItemId, LabelItemIndex, LabelItemMap, LabelItem
} from "../common/CommonTypes";
import {SecondaryButton, RemoveButton} from "../common/CommonInput";
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
            <div key={labelItem.id} className={"card"}>
                <div className={"card-header"}>
                    <div className={"card-header-title"}>{labelItem.name}</div>
                    <div className={"card-header-icon"}>
                        <RemoveButton onClick={(e) => this.props.labelItemRemoved(labelTypeId, labelItem.id)}/>
                    </div>
                </div>
            </div>
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
            <div key={label.name} className={"panel is-info"}>
                <div className={"panel-heading"}>
                    <p>{label.name}</p>
                </div>
                <div className={"panel-block"}>
                    <AddLabelItem
                        labelTypeId={label.id}
                        labelItemAdded={this.props.labelItemAdded}
                    />
                </div>
                <div className={"panel-block"}>
                    <div className={"label-items"}>
                        {this.getLabelItems(label.id, labelItems.get(label.id) || new Map())}
                    </div>
                </div>
                <div className={"panel-block"}>
                    <SecondaryButton onClick={(e) => this.props.labelTypeRemoved(label.id)}>
                        Remove Label Type
                    </SecondaryButton>
                </div>
            </div>
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
                <div className={"label-types"}>
                    {this.getLabelTypeItems(this.props.labels, this.props.labelItems)}
                </div>
            </div>
        );
    }
}
