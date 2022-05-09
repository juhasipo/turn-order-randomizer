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
        setName('');
    };

    return (
        <div className={"field has-addons"}>
            <div className={"control"}>
                <input
                    className={"input"}
                    type={"text"}
                    name={"name"}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className={"control"}>
                <PrimaryButton onClick={addPlayer}>Text</PrimaryButton>
            </div>
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
        setName('');
    };

    return (
        <div className={"field has-addons"}>
            <div className={"control"}>
                <input
                    className={"input"}
                    type={"text"}
                    name={"name"}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className={"control"}>
                <PrimaryButton onClick={addLabelItem}>Add</PrimaryButton>
            </div>
        </div>
    );
}

export {AddLabelType, AddLabelItem};
