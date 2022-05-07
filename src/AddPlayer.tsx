import * as React from 'react';
import {NewPlayer} from "./CommonTypes";
import {PrimaryButton} from "./CommonInput";

export interface Props {
    playerAdded: (player: NewPlayer) => void;
}

const AddPlayer = (props: Props) => {
    const [name, setName] = React.useState('');

    const addPlayer = (_: any) => {
        props.playerAdded({
            name: name,
        });
    };

    return (
        <div>
            <label>
                Name:
                <input type={"text"} name={"name"} onChange={(event) => setName(event.target.value)}/>
            </label>
            <PrimaryButton onClick={addPlayer}>Add</PrimaryButton>
        </div>
    );
}

export default AddPlayer;
