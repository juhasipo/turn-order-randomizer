import * as React from 'react';
import {LabelTypeId, NewLabelItem, NewLabelType, NewPlayer} from "../common/CommonTypes";
import {PrimaryButton} from "../common/CommonInput";

export interface TypeProps {
    labelAdded: (label: NewLabelType) => void;
}

const AddLabelType = (props: TypeProps) => {
    const [name, setName] = React.useState('');

    const addPlayer = (_: any) => {
        props.labelAdded({
            name: name,
        });
    };

    return (
        <div>
            <label>
                Label:
                <input type={"text"} name={"name"} onChange={(event) => setName(event.target.value)}/>
            </label>
            <PrimaryButton onClick={addPlayer}>Add</PrimaryButton>
        </div>
    );
}


export interface ItemProps {
    labelTypeId: LabelTypeId;
    labelItemAdded: (label: NewLabelItem) => void;
}

const AddLabelItem = (props: ItemProps) => {
    const [name, setName] = React.useState('');

    const addLabelItem = (_: any) => {
        props.labelItemAdded({
            labelType: props.labelTypeId,
            name: name,
        });
    };

    return (
        <div>
            <label>
                Item:
                <input type={"text"} name={"name"} onChange={(event) => setName(event.target.value)}/>
            </label>
            <PrimaryButton onClick={addLabelItem}>Add</PrimaryButton>
        </div>
    );
}

export {AddLabelType, AddLabelItem};
