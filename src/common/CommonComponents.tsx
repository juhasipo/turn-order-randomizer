import React, {useState} from "react";
import './CommonComponent.scss'

export interface CollapseProps {
    title: string;
    subtitle?: string;
    openByDefault?: boolean;
    children: React.ReactNode
    actions?: React.ReactNode
}

export const Collapse = (props: CollapseProps) => {
    const [open, setOpen] = useState(!!props.openByDefault);

    const toggle = () => {
        setOpen(!open);
    }

    const getChildrenClass = (open: boolean) => {
        return "" + (open ? ' message-body' : ' ');
    }

    return (
        <div className={"message"}>
            <div className={"message-header collapse-header"} onClick={toggle}>
                <p>
                    <span className={"collapse-header-title"}>{props.title}</span>
                    <span className={"collapse-header-subtitle"}>{props.subtitle}</span>
                </p>
                <div className={"buttons are-small"}>
                    <button className={"button is-rounded"} onClick={toggle}>{open ? 'V' : '>'}</button>
                </div>
            </div>
            <div className={getChildrenClass(open)}>
                <div className={"block"}>
                    {open && props.children}
                </div>
                {props.actions && (
                    <div className={"block"}>
                        {open && props.actions && props.actions}
                    </div>
                )}
            </div>
        </div>
    )
}
