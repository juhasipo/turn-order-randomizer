import React, {useState} from "react";
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

export interface InputProps extends React.InputHTMLAttributes<any> {
    label?: string;
    value: string;
    onValueChange: (value: string) => void;
}

export const InputField = (props: InputProps) => {
    return (
        <div className={"field"}>
            {!!props.label && (<label className={"label"}>{props.label}</label>)}
            <div className={"control"}>
                <input
                    className={"input"}
                    type={props.type}
                    onChange={(e) => props.onValueChange(e.target.value)}
                    value={props.value}
                />
            </div>
        </div>
    );
}
