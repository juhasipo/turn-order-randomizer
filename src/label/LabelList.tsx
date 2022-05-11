import * as React from 'react';
import {
    LabelTypeId,
    LabelTypeIndex,
    NewLabelType,
    LabelType, NewLabelItem, LabelItemId, LabelItemIndex, LabelItem, findLabelTypeName
} from "../common/CommonTypes";
import {SecondaryButton, RemoveButton, DangerButton} from "../common/CommonInput";
import {useState} from "react";
import {Collapse} from "../common/CommonComponents";

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
                    {!editMode && (<SecondaryButton onClick={startEditing}>Edit</SecondaryButton>)}
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
                key={"label-item-" + labelItem.id}
                labelTypeId={labelTypeId}
                labelItem={labelItem}
                labelItemRemoved={this.props.labelItemRemoved}
                labelItemChanged={this.props.labelItemChanged}
            />
        )
    }

    getLabelItems = (labelTypeId: LabelTypeId, labelItems: LabelItemIndex) => {
        return Array.from(labelItems)
                    .filter(([_, labelItem]) => labelItem.typeId === labelTypeId)
                    .map(([id, label]) => this.getLabelItem(labelTypeId, label));
    }

    getLabelTypeItem = (label: LabelType, labelItems: LabelItemIndex) => {
        const labelItemList = this.getLabelItems(label.id, labelItems);

        return (
            <div
                key={'labe-l' + label.id}
                className={"column is-half"}
            >
                <Collapse
                    title={label.name}
                    subtitle={findLabelTypeName(label.mode)}
                    modalStyle={"is-info"}
                    actions={[
                        <DangerButton onClick={(e) => this.props.labelTypeRemoved(label.id)}>
                            Remove Label Type
                        </DangerButton>
                    ]}
                >
                    {labelItemList && labelItemList.length > 0 && (
                        <div className={"label-items"}>
                            {this.getLabelItems(label.id, labelItems)}
                        </div>
                    )}
                </Collapse>
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
                <div className={"label-types columns is-multiline"}>
                    {this.getLabelTypeItems(this.props.labels, this.props.labelItems)}
                </div>
            </div>
        );
    }
}
