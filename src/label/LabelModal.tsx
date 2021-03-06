import {
    LABEL_TYPES,
    LabelTypeButton,
    LabelTypeMode,
    NewLabelItem,
    NewLabelType
} from "../common/CommonTypes";
import {useState} from "react";
import {InputField, RemoveButton} from "../common/CommonInput";

export interface Props {
    openButtonTitle?: string;
    open: boolean;
    labelAdded: (label: NewLabelType, items: Array<NewLabelItem>) => void;
    openModal?: () => void;
    closeModal: () => void;
}

interface ModeSelectorProps {
    selected: LabelTypeMode;
    modeChanged: (mode: LabelTypeMode) => void;
}

const ModeSelector = (props: ModeSelectorProps) => {
    const getSelectorButton = (labelType: LabelTypeButton, currentMode: LabelTypeMode, modeChanged: (mode: LabelTypeMode) => void) => {
        return <button
            className={"button " + (labelType.mode === currentMode ? 'is-info' : '')}
            onClick={(e) => modeChanged(labelType.mode)}
        >
            {labelType.name}
        </button>
    }

    return (
        <div className="buttons has-addons">
            {LABEL_TYPES.map(l => getSelectorButton(l, props.selected, props.modeChanged))}
        </div>
    );
}

interface LabelItemListProps {
    items: Array<string>;
    itemsChanged: (items: Array<string>) => void;
    itemRemoved: (index: number) => void;
}

const StringItemList = (props: LabelItemListProps) => {

    const {items, itemsChanged} = props;

    const getItem = (itemName: string, index: number) => {
        return (
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"card-header-title"}>
                        <InputField
                            key={'item-' + index}
                            value={itemName}
                            onValueChange={(value) => {
                                const a = Array.from(items);
                                a[index] = value;
                                itemsChanged(a);
                            }}
                        />
                    </div>
                    <div className={"card-header-icon"}>
                        <RemoveButton onClick={(e) => props.itemRemoved(index)}/>
                    </div>
                </div>
            </div>
        );
    }

    const getItems = (items: Array<string>) => {
        return items.map(getItem);
    }

    const [newItem, setNewItem] = useState('');

    const newItemChanged = (e: React.ChangeEvent<any>) => {
        setNewItem(e.target.value);
    }

    const itemAdded = (_: any) => {
        if (isValid(newItem)) {
            const newItems = Array.from(items);
            newItems.push(newItem);
            itemsChanged(newItems);
            setNewItem('');
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<any>) => {
        if (e.key === 'Enter') {
            itemAdded(e);
        }
    }

    const isValid = (value: string): boolean => {
        return !!value && value.trim().length > 0;
    }

    return (
        <>
            <div className={"field has-addons"}>
                <div className={"control"}>
                    <input
                        className={"input"}
                        type={"text"}
                        value={newItem}
                        onChange={newItemChanged}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <div className={"control"}>
                    <button
                        className={"button is-primary"}
                        onClick={itemAdded}
                        disabled={!isValid(newItem)}
                    >
                        Add item
                    </button>
                </div>
            </div>
            {getItems(items)}
        </>
    )
}


const NumberItemList = (props: LabelItemListProps) => {

    const {items, itemsChanged} = props;

    const [min, setMin] = useState(1);
    const [max, setMax] = useState(1);

    const minChanged = (e: React.ChangeEvent<any>) => {
        setMin(e.target.value);
        changed(e.target.value, max);
    }

    const maxChanged = (e: React.ChangeEvent<any>) => {
        setMax(e.target.value);
        changed(min, e.target.value);
    }

    const changed = (min: number, max: number) => {
        const newItems: Array<string> = [];
        for (let i = min; i <= max; ++i) {
            newItems.push('' + i);
        }
        itemsChanged(newItems);
    }

    const getItem = (itemName: string, index: number) => {
        return (
            <div className={"card"}>
                <div className={"card-header"}>
                    <div className={"card-header-title"}>
                        {itemName}
                    </div>
                </div>
            </div>
        );
    }

    const getItems = (items: Array<string>) => {
        return items.map(getItem);
    }

    return (
        <>
            <div className={"field is-horizontal"}>
                <div className={"field-body"}>
                    <div className={"control"}>
                        <label className={"label"}>From</label>
                        <input
                            type={"number"}
                            className={"input"}
                            name={"label-item-min"}
                            placeholder={"Min"}
                            value={min}
                            onChange={minChanged}
                        />
                    </div>
                    <div className={"control"}>
                        <label className={"label"}>To</label>
                        <input
                            type={"number"}
                            className={"input"}
                            name={"label-item-max"}
                            placeholder={"Max"}
                            value={max}
                            onChange={maxChanged}
                        />
                    </div>
                </div>
            </div>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {getItems(items)}
            </div>
        </>
    )
}

export const NewLabelModal = (props: Props) => {

    const [typeName, setTypeName] = useState<string>('');
    const [labelMode, setLabelMode] = useState<LabelTypeMode>('TEXT');
    const [items, setItems] = useState<Array<string>>([]);

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
            {name: typeName, mode: labelMode},
            items.map((name) => { return {labelType: -1, name: name}})
        );
        close(e);
    };

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
                            <ModeSelector selected={labelMode} modeChanged={(e) => {
                                setItems([]);
                                setLabelMode(e);
                            }} />
                            {labelMode === 'TEXT' && (
                                <StringItemList
                                    itemsChanged={(items) => setItems(items)}
                                    items={items}
                                    itemRemoved={(index) => {
                                        console.log("Remove at index", index);
                                        const itemsWithRemoved = Array.from(items);
                                        itemsWithRemoved.splice(index, 1)
                                        setItems(itemsWithRemoved);
                                    }}
                                />
                            )}
                            {labelMode === 'NUMBER' && (
                                <NumberItemList
                                    itemsChanged={(items) => setItems(items)}
                                    items={items}
                                    itemRemoved={(itemIndex) => {}}
                                />
                            )}
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
