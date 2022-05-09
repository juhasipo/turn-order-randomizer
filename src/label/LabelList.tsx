import * as React from 'react';
import {
    LabelTypeId,
    LabelTypeIndex,
    NewLabelType,
    LabelType, NewLabelItem, LabelItemId, LabelItemIndex, LabelItemMap, LabelItem
} from "../common/CommonTypes";
import {SecondaryButton, RemoveButton} from "../common/CommonInput";
import {useState} from "react";

export interface Props {
    labelTypeAdded: (label: NewLabelType) => void;
    labelTypeRemoved: (typeId: LabelTypeId) => void;
    labelItemAdded: (label: NewLabelItem) => void;
    labelItemRemoved: (typeId: LabelTypeId, itemId: LabelItemId) => void;
    labelItemChanged: (typeId: LabelTypeId, item: LabelItem) => void;
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

export interface LabelItemEditorProps {
    labelTypeId: LabelTypeId;
    labelItem: LabelItem;
    labelItemRemoved: (typeId: LabelTypeId, itemId: LabelItemId) => void;
    labelItemChanged: (typeId: LabelTypeId, item: LabelItem) => void;
}

export const LabelItemEditor = (props: LabelItemEditorProps) => {

    const [editMode, setEditMode] = useState(false);
    const [internalValue, setInternalValue] = useState(props.labelItem.name);

    const startEditing = (_: any) => {
        setEditMode(true);
        setInternalValue(props.labelItem.name);
    };

    const applyChange = (_: any) => {
        props.labelItemChanged(props.labelTypeId, {...props.labelItem, name: internalValue});
        setEditMode(false);
    }

    return (
        <div key={props.labelItem.id} className={"card"}>
            <div className={"card-header"}>
                <div className={"card-header-title"}>
                    {!editMode && props.labelItem.name}
                    {editMode && (
                        <div className={"field has-addons"}>
                            <div className={"control"}>
                                <input type={"text"}
                                       className={"input"}
                                       value={internalValue}
                                       onChange={(e) => setInternalValue(e.target.value)}
                                />
                            </div>
                            <div className={"control"}>
                                <button
                                    className={"button is-primary"}
                                    onClick={applyChange}
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className={"card-header-icon"}>
                    <SecondaryButton onClick={startEditing}>Edit</SecondaryButton>
                    <button className={"button is-danger"} onClick={(e) => props.labelItemRemoved(props.labelTypeId, props.labelItem.id)}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default class LabelTypeList extends React.Component<Props, any> {

    getLabelItem = (labelTypeId: LabelTypeId, labelItem: LabelItem) => {
        return (
            <LabelItemEditor
                labelTypeId={labelTypeId}
                labelItem={labelItem}
                labelItemRemoved={this.props.labelItemRemoved}
                labelItemChanged={this.props.labelItemChanged}
            />
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
                <div className={"label-types"}>
                    {this.getLabelTypeItems(this.props.labels, this.props.labelItems)}
                </div>
            </div>
        );
    }
}
