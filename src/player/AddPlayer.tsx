import * as React from 'react';
import {NewPlayer} from "../common/CommonTypes";
import {PrimaryButton} from "../common/CommonInput";

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
                <PrimaryButton onClick={addPlayer}>Add</PrimaryButton>
            </div>
        </div>
    );
}

export default AddPlayer;
