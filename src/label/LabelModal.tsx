import {LabelTypeMode, NewLabelItem, NewLabelType} from "../common/CommonTypes";
import {useState} from "react";
import {InputField} from "../common/CommonInput";

export interface Props {
    openButtonTitle?: string;
    open: boolean;
    labelAdded: (label: NewLabelType, items: Array<NewLabelItem>) => void;
    openModal?: () => void;
    closeModal: () => void;
}

const LABEL_TYPE_MODE_TO_NAME = new Map<LabelTypeMode, string>([
    ['TEXT', "Text"],
    ['NUMBER', "Number"],
    ['SINGLETON', "Singleton"],
    ['ONE_FOR_EACH_PLAYER', "One for Each"],
]);

interface ModeSelectorProps {
    selected: LabelTypeMode;
    modeChanged: (mode: LabelTypeMode) => void;
}

const ModeSelector = (props: ModeSelectorProps) => {
    const getSelectorButton = (selectorMode: LabelTypeMode, currentMode: LabelTypeMode, modeChanged: (mode: LabelTypeMode) => void) => {
        return <button
            className={"button " + (selectorMode === currentMode ? 'is-info' : '')}
            onClick={(e) => modeChanged(selectorMode)}
        >
            {LABEL_TYPE_MODE_TO_NAME.get(selectorMode)}
        </button>
    }

    return (
        <div className="buttons has-addons">
            {getSelectorButton("TEXT", props.selected, props.modeChanged)}
            {getSelectorButton("NUMBER", props.selected, props.modeChanged)}
            {getSelectorButton("SINGLETON", props.selected, props.modeChanged)}
            {getSelectorButton("ONE_FOR_EACH_PLAYER", props.selected, props.modeChanged)}
        </div>
    );
}

interface LabelItemListProps {
    items: Array<string>;
    itemsChanged: (items: Array<string>) => void;
}

const StringItemList = (props: LabelItemListProps) => {

    const {items, itemsChanged} = props;

    const getItem = (itemName: string, index: number) => {
        return (
            <InputField
                value={itemName}
                onValueChange={(value) => {
                    const a = Array.from(items);
                    a[index] = value;
                    itemsChanged(a);
                }}
            />
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
        const newItems = Array.from(items);
        newItems.push(newItem);
        itemsChanged(newItems);
        setNewItem('');
    }

    const handleKeyPress = (e: React.KeyboardEvent<any>) => {
        if (e.key === 'Enter') {
            itemAdded(newItem);
        }
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
                    <button className={"button"} onClick={(e) => itemAdded}>Add item</button>
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
                                />
                            )}
                            {labelMode === 'NUMBER' && (
                                <NumberItemList
                                    itemsChanged={(items) => setItems(items)}
                                    items={items}
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
