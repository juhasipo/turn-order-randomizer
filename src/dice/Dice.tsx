import {useState} from "react";
import './Dice.scss'
import {ToggleButton} from "../common/CommonInput";
import {nextRandomNumber} from "../common/Random";

type ThrowMode = 'FAST' | 'POWER';

interface Dice {
    name: string;
    min: number;
    max: number;
    result?: number;
}

const DICE_MODELS: Dice[] = [
    {name: "D4", min: 1, max: 4},
    {name: "D6", min: 1, max: 6},
    {name: "D8", min: 1, max: 8},
    {name: "D10 (0-9)", min: 0, max: 9},
    {name: "D10 (1-10)", min: 1, max: 10},
    {name: "D12", min: 1, max: 12},
    {name: "D20", min: 1, max: 20},
];

const DEFAULT_DICE = {...DICE_MODELS[1]};

type DiceResult = number | null;

export const Dice = () => {

    const [dice, setDice] = useState<Array<Dice>>([DEFAULT_DICE]);
    const [minResult, setMinResult] = useState(1);
    const [maxResult, setMaxResult] = useState(6);
    const [throwMode, setThrowMode] = useState<ThrowMode>('FAST');

    const addDie = () => {
        const dieName = DICE_MODELS.filter(d => maxResult === d.max && minResult === d.min)?.at(0)?.name;
        const die: Dice = {
            name: dieName || "" + minResult + "–" + maxResult,
            min: minResult,
            max: maxResult,
        }
        const newDice = dice.concat(die);
        setDice(newDice);
    }

    const removeDie = (index: number) => {
        console.log("Delte die at ", index);
        const newDice = Array.from(dice);
        newDice.splice(index, 1);
        setDice(newDice);
    }

    const getDieButton = (die: Dice) => {
        const isSelected = maxResult === die.max && minResult === die.min;
        return <button
            className={"button card-footer-item die-selector" + (isSelected ? ' is-active is-info' : '')}
            onClick={(e) => {
                setMinResult(die.min);
                setMaxResult(die.max);
            }}
        >
            {die.name}
        </button>
    }

    const getResults = (results: Dice[]) => {
        return Array.from(results)
            .map((die, index) => {
                return (
                    <div className={"dice-result"}>
                        <div className={"die-type"}>
                            {die.name}
                        </div>
                        <div className={"die-result"}>
                            {die.result !== undefined ? die.result : '-'}
                        </div>
                        <div className={"die-actions"}>
                            <button className={"delete"} onClick={(e) => removeDie(index)}/>
                        </div>
                    </div>
                );
            });
    }

    const getDieStats = (results: Dice[]) => {
        const stats: { [key: number]: number } = {};
        results.forEach(result => {
            if (result && result.result !== undefined) {
                const v = stats[result.result] || 0;
                stats[result.result] = v + 1;
            }
        })

        return Object.entries(stats).map(([k, v]) => {
            return <div>{k}: {v}</div>
        });
    }

    const throwDice = () => {
        if (throwMode === 'FAST') {
            const results = Array.from(dice);
            for (let i = 0; i < dice.length; ++i) {
                const die = results[i];
                die.result = nextRandomNumber(die.min, die.max, Math.random);
            }
            setDice(results);
        } else {
            const maxCounter = 20;
            const newDice = Array.from(dice).map(die => {
                die.result = undefined;
                return die;
            });
            const maxLength = newDice.length;
            const v = {index: 0, counter: maxCounter};
            const interval = setInterval(function () {
                if (v.index >= maxLength) {
                    clearInterval(interval);
                    return;
                }

                if (v.index !== null) {
                    const die = newDice[v.index];
                    die.result = nextRandomNumber(die.min, die.max, Math.random);
                }
                setDice(Array.from(newDice));
                v.counter--;

                if (v.counter < 0) {
                    v.counter = maxCounter;
                    v.index++;
                }
            }, 50);
        }
    }

    const getDiceButtons = () => {
        return DICE_MODELS.map(die => getDieButton(die));
    }

    return (
        <div className={"container dice-container"}>
            <div className={"card dice-options"}>
                <div className={"card-content is-centered"}>
                    <div className={"buttons is-centered"}>
                        {getDiceButtons()}
                    </div>
                </div>
                <div className={"card-content is-flex"}>
                    <div className="field is-flex-grow-1">
                        <label>Min</label>
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

                    <div className="field is-flex-grow-1">
                        <label>Max</label>
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
                <div className={"card-footer"}>
                    <button
                        className={"button is-primary card-footer-item"}
                        onClick={(e) => addDie()}
                    >
                        Add Die
                    </button>
                </div>
            </div>

            <div className={"block"}/>

            <div className={"card dice-options"}>
                <div className={"card-content"}>
                    <div className={"buttons is-centered"}>
                        <ToggleButton currentValue={throwMode} value={'FAST'} onClick={setThrowMode}>Fast</ToggleButton>
                        <ToggleButton currentValue={throwMode} value={'POWER'}
                                      onClick={setThrowMode}>Extra</ToggleButton>
                    </div>
                </div>

                <div className={"card-footer"}>
                    <button
                        className={"button is-primary card-footer-item"}
                        onClick={(e) => throwDice()}
                    >
                        Throw All
                    </button>
                </div>
            </div>

            <div className={"block"}/>

            <div className={"dice-results"}>
                {getResults(dice)}
            </div>

            <div>
                {getDieStats(dice)}
            </div>
        </div>
    );
}
