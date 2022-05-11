import {useState} from "react";
import './Dice.scss'
import {ToggleButton} from "../common/CommonInput";

type ThrowMode = 'FAST' | 'POWER';

export const Dice = () => {

    const [diceResults, setDiceResults] = useState<Array<number>>([0]);
    const [numOfDice, setNumOfDice] = useState(1);
    const [maxResult, setMaxResult] = useState(6);
    const [throwMode, setThrowMode] = useState<ThrowMode>('FAST');

    const changeNumOfDice = (newValue: number) => {
        setNumOfDice(newValue);
        const results: number[] = [];
        for (let i = 0; i < newValue; ++i) {
            results.push(0);
        }
        setDiceResults(results);
    }

    const getDieButton = (buttonResult: number) => {
        return <button
            className={"button" + (maxResult === buttonResult ? ' is-active is-info' : '')}
            onClick={(e) => setMaxResult(buttonResult)}
        >
            {'D' + buttonResult}
        </button>
    }

    const getResults = (results: number[]) => {
        return Array.from(results)
            .map(result => {
                return (
                    <div className={"dice-result"}>
                        {result > 0 ? result : '-'}
                    </div>
                );
            });
    }

    const throwDice = () => {
        if (throwMode === 'FAST') {
            const results = Array.from(diceResults);
            for (let i = 0; i < diceResults.length; ++i) {
                results[i] = Math.ceil(Math.random() * maxResult);
            }
            setDiceResults(results);
        } else {
            const maxCounter = 20;
            const results = Array.from(diceResults).map(_ => 0);
            const maxLength = diceResults.length;
            const v = {index: 0, counter: maxCounter};
            const interval = setInterval(function() {
                if (v.index >= maxLength) {
                    clearInterval(interval);
                    return;
                }

                results[v.index] = Math.ceil(Math.random() * maxResult);
                setDiceResults(Array.from(results));
                v.counter--;

                if (v.counter < 0) {
                    v.counter = maxCounter;
                    v.index++;
                }
            }, 50);
        }
    }

    return (
        <div className={"container dice-container"}>
            <div className={"buttons is-centered"}>
                <label className={"label"}>Dice Type</label>
                {getDieButton(4)}
                {getDieButton(6)}
                {getDieButton(8)}
                {getDieButton(10)}
                {getDieButton(12)}
                {getDieButton(20)}
            </div>

            <div className={"field"}>
                <label className={"label"}>Number of Dice</label>
                <p className={"control"}>
                    <input
                        type={"number"}
                        className={"input dice-number"}
                        name={"number-of-dice"}
                        value={numOfDice}
                        min={1}
                        onChange={(e) => changeNumOfDice(parseInt(e.target.value))}
                    />
                </p>
            </div>
            <div className={"is-centered"}>
                <div className={"buttons is-centered"}>
                    <ToggleButton currentValue={throwMode} value={'FAST'} onClick={setThrowMode}>Fast</ToggleButton>
                    <ToggleButton currentValue={throwMode} value={'POWER'} onClick={setThrowMode}>Power</ToggleButton>
                </div>

                <div className={"block"}/>

                <button
                    className={"button is-primary"}
                    onClick={(e) => throwDice()}
                >
                    Throw All
                </button>

                <div className={"block"}/>

                <div className={"dice-results"}>
                    {getResults(diceResults)}
                </div>
            </div>
        </div>
    );
}
