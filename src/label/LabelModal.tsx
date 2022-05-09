import {NewLabelItem, NewLabelType} from "../common/CommonTypes";
import {useState} from "react";
import {InputField} from "../common/CommonInput";

export interface Props {
    openButtonTitle?: string;
    open: boolean;
    labelAdded: (label: NewLabelType, items: Array<NewLabelItem>) => void;
    openModal?: () => void;
    closeModal: () => void;
}

export const NewLabelModal = (props: Props) => {

    const [typeName, setTypeName] = useState<string>('');
    const [items, setItems] = useState<Array<string>>([])

    const open = (_: any) => {
        if (props.openModal) {
            setTypeName('');
            setItems([]);
            props.openModal();
        }
    }
    const close = (_: any) => {
        props.closeModal();
    }

    const save = (e: any) => {
        props.labelAdded(
            {name: typeName},
            items.map((name) => { return {labelType: -1, name: name}})
        );
        close(e);
    };

    const getItem = (itemName: string, index: number) => {
        return (
            <InputField
                value={itemName}
                onValueChange={(value) => {
                    const a = Array.from(items);
                    a[index] = value;
                    setItems(a);
                }}
            />
        );
    }

    const getItems = (items: Array<string>) => {
        return items.map(getItem);
    }

    const addItems = (numOfItems: number) => {
        const a = Array.from(items);
        for (let i = 0; i < numOfItems; ++i) {
            a.push('');
        }
        setItems(a);
    }

    return (
        <>
            {props.openModal && (<button className={"button is-primary"} onClick={open}>{props.openButtonTitle || 'Open'}</button>)}
            {props.open && (
                <div className="modal is-active">
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">
                                Create Label{!!typeName ? `: ${typeName}` : ''}
                            </p>
                            <button className="delete" aria-label="close" onClick={close}/>
                        </header>
                        <section className="modal-card-body">
                                <InputField
                                    label={"Type"}
                                    type={"text"}
                                    value={typeName}
                                    onValueChange={setTypeName}
                                />
                                <button className={"button"} onClick={(e) => addItems(1)}>Add item</button>
                                {getItems(items)}
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" onClick={save}>Save changes</button>
                            <button className="button" onClick={close}>Cancel</button>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
}
