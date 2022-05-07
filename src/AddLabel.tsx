import * as React from 'react';
import {NewLabelType, NewPlayer} from "./CommonTypes";
import {PrimaryButton} from "./CommonInput";

export interface Props {
    labelAdded: (label: NewLabelType) => void;
}

const AddLabel = (props: Props) => {
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

export default AddLabel;
