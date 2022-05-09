import * as React from 'react';
import {NewPlayer} from "../common/CommonTypes";
import {PrimaryButton} from "../common/CommonInput";

export interface Props {
    playerAdded: (player: NewPlayer) => void;
}

const AddPlayer = (props: Props) => {
    const [name, setName] = React.useState('');

    const handleEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isValid()) {
            addPlayer(e);
            setName('');
        }
    }

    const addPlayer = (_: any) => {
        props.playerAdded({
            name: name,
        });
        setName('');
        document.getElementById("add-player-input")?.focus();
    };

    const isValid = (): boolean => {
        return !!name && name.trim().length > 0;
    }

    return (

        <div className={"field has-addons"}>
            <div className={"control"}>
                <input
                    id={"add-player-input"}
                    className={"input"}
                    type={"text"}
                    name={"name"}
                    value={name}
                    onKeyPress={handleEnter}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className={"control"}>
                <PrimaryButton
                    onClick={addPlayer}
                    disabled={!isValid()}
                >Add</PrimaryButton>
            </div>
        </div>
    );
}

export default AddPlayer;
