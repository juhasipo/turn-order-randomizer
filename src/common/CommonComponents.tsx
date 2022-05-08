import React, {useState} from "react";
import './CommonComponent.scss'

export interface CollapseProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode
}

export const Collapse = (props: CollapseProps) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    }

    const getChildrenClass = (open: boolean) => {
        return "collapse-children" + (open ? ' open' : ' closed');
    }

    return (
        <div className={"collapse"}>
            <div className={"collapse-header"}>
                <span className={"collapse-header-title"}>{props.title}</span>
                <span className={"collapse-header-subtitle"}>{props.subtitle}</span>
                <button onClick={toggle}>{open ? 'V' : '>'}</button>
            </div>
            <div className={getChildrenClass(open)}>
                {open && props.children}
            </div>
        </div>
    )
}
