import React from "react";
import './CommonInput.scss'

export const PrimaryButton = (props: React.ButtonHTMLAttributes<{}>) => {
    return (
        <button className={"primary-button"} {...props}>{props.children}</button>
    )
}

export const RemoveButton = (props: React.ButtonHTMLAttributes<{}>) => {
    return (
        <button className={"remove-button"} {...props}>X</button>
    )
}
