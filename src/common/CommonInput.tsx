import React from "react";
import './CommonInput.scss'

export const PrimaryButton = (props: React.ButtonHTMLAttributes<{}>) => {
    return (
        <button className={"button is-primary"} {...props}>{props.children}</button>
    )
}

export const SecondaryButton = (props: React.ButtonHTMLAttributes<{}>) => {
    return (
        <button className={"button"} {...props}>{props.children}</button>
    )
}

export const RemoveButton = (props: React.ButtonHTMLAttributes<{}>) => {
    return (
        <button className={"delete is-danger"} {...props}>X</button>
    )
}
