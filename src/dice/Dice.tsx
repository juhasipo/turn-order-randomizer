import {useState} from "react";
import './Dice.scss'
import {ToggleButton} from "../common/CommonInput";

type ThrowMode = 'FAST' | 'POWER';

interface Dice {
    name: string;
    min: number;
    max: number;
}

const DICE: Dice[] = [
    {name: "D4", min: 1, max: 4},
    {name: "D6", min: 1, max: 6},
    {name: "D8", min: 1, max: 8},
    {name: "D10 (0-9)", min: 0, max: 9},
    {name: "D10 (1-10)", min: 1, max: 10},
    {name: "D12", min: 1, max: 12},
    {name: "D20", min: 1, max: 20},
];

type DiceResult = number|null;

export const Dice = () => {

    const [diceResults, setDiceResults] = useState<Array<DiceResult>>([0]);
    const [numOfDice, setNumOfDice] = useState(1);
    const [minResult, setMinResult] = useState(1);
    const [maxResult, setMaxResult] = useState(6);
    const [throwMode, setThrowMode] = useState<ThrowMode>('FAST');

    const changeNumOfDice = (newValue: number) => {
        setNumOfDice(newValue);
        const results: DiceResult[] = [];
        for (let i = 0; i < newValue; ++i) {
            results.push(null);
        }
        setDiceResults(results);
    }

    const getDieButton = (die: Dice) => {
        const isSelected = maxResult === die.max && minResult === die.min;
        return <button
            className={"button" + (isSelected ? ' is-active is-info' : '')}
            onClick={(e) => {
                setMinResult(die.min);
                setMaxResult(die.max);
            }}
        >
            {die.name}
        </button>
    }

    const getResults = (results: DiceResult[]) => {
        return Array.from(results)
            .map(result => {
                return (
                    <div className={"dice-result"}>
                        {result !== null ? result : '-'}
                    </div>
                );
            });
    }

    const getRandomValue = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max-min+1) + min);
    }

    const getDieStats = (results: DiceResult[]) => {
        const stats: { [key: number]: number } = {};
        results.forEach(result => {
            if (result !== null) {
                const v = stats[result] || 0;
                stats[result] = v + 1;
            }
        })

        return Object.entries(stats).map(([k, v]) => {
            return <div>{k}: {v}</div>
        });
    }

    const throwDice = () => {
        if (throwMode === 'FAST') {
            const results = Array.from(diceResults);
            for (let i = 0; i < diceResults.length; ++i) {
                results[i] = getRandomValue(minResult, maxResult);
            }
            setDiceResults(results);
        } else {
            const maxCounter = 20;
            const results = Array.from(diceResults).map(_ => null as number|null);
            const maxLength = diceResults.length;
            const v = {index: 0, counter: maxCounter};
            const interval = setInterval(function() {
                if (v.index >= maxLength) {
                    clearInterval(interval);
                    return;
                }

                if (v.index !== null) {
                    results[v.index] = getRandomValue(minResult, maxResult);
                }
                setDiceResults(Array.from(results));
                v.counter--;

                if (v.counter < 0) {
                    v.counter = maxCounter;
                    v.index++;
                }
            }, 50);
        }
    }

    const getDiceButtons = () => {
        return DICE.map(die => getDieButton(die));
    }

    return (
        <div className={"container dice-container"}>
            <div className={"buttons is-centered"}>
                <label className={"label"}>Dice Type</label>
                {getDiceButtons()}
            </div>

            <div className={"block dice-options is-centered"}>
                <div className="block field is-horizontal is-centered">
                    <div className="field-label is-normal">
                        <label className={"label"}>Range</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <p className={"control"}>
                                <input
                                    type={"number"}
                                    className={"input dice-number"}
                                    name={"dice-min"}
                                    value={minResult}
                                    onChange={(e) => setMinResult(parseInt(e.target.value))}
                                />
                            </p>
                        </div>

                        <div className="field">
                            <p className={"control"}>
                                <input
                                    type={"number"}
                                    className={"input dice-number"}
                                    name={"dice-max"}
                                    value={maxResult}
                                    onChange={(e) => setMaxResult(parseInt(e.target.value))}
                                />
                            </p>
                        </div>
                    </div>
                </div>
                <div className={"block is-centered"}>
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
            </div>

            <div className={"block"}/>

            <div className={"block is-centered"}>
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
