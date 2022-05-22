import React from 'react';
import './App.scss';
import {
    LabelItem,
    LabelType,
    LabelTypeId,
    Player,
    PlayerId,
    Status
} from "./common/CommonTypes";
import {toMap} from "./common/Utils";
import NumberPool from "./common/NumberPool";
import {Dice} from "./dice/Dice";
import {TurnOrderRandomizer} from "./turnorder/TurnOrderRandomizer";


const idPool = new NumberPool();

let status: Status = {
    idPool: 0,
    players: new Map<PlayerId, Player>(),
    labelTypes: new Map<LabelTypeId, LabelType>(),
    labelItems: new Map<LabelTypeId, LabelItem>(),
    playerOrder: new Array<PlayerId>(),
};

const fragment = window.location.hash;
if (fragment) {
    try {
        const statusBase64 = fragment.substring(1);
        console.log("Restore from fragment", statusBase64);
        const jsonStatus = JSON.parse(window.atob(statusBase64));
        console.log("JSON value", jsonStatus);

        status = {
            players: toMap(jsonStatus["players"]),
            labelTypes: toMap(jsonStatus["labelTypes"]),
            labelItems: toMap(jsonStatus["labelItems"]),
            playerOrder: Array.from(jsonStatus["playerOrder"]),
            idPool: jsonStatus["idPool"],
        };
        console.log("Restored status", status);
        idPool.reset(status.idPool);
    } finally {
        window.location.hash = '';
    }
}

function resolveVersionAndTitle(): {title: string, version: string} {
    const title = process.env.REACT_APP_NAME || '';

    let version = process.env.REACT_APP_VERSION || '';
    if (process.env.REACT_APP_VERSION_HASH) {
        version += "-" + process.env.REACT_APP_VERSION_HASH;
    }

    console.dir(process.env);

    return {title, version};
}

const App = () => {

    const [selectedTab, setSelectedTab] = React.useState('tor');

    let {title, version} = resolveVersionAndTitle();

    return (
        <div className="App">
            <header className="App-header navbar">
                <div className="App-header-container">
                    <h1>{title}</h1>
                    <sub>{version}</sub>
                </div>
            </header>
            <section className={"tabs is-centered"}>
                <ul>
                    <li className={selectedTab === 'tor' ? "is-active" : ''}>
                        <a onClick={(e) => setSelectedTab('tor')}>TOR</a>
                    </li>
                    <li className={selectedTab === 'dice' ? "is-active" : ''}>
                        <a onClick={(e) => setSelectedTab('dice')}>Dice</a>
                    </li>
                </ul>
            </section>
            <main className={"section"}>
                {selectedTab === 'tor' &&(
                    <TurnOrderRandomizer
                        idPool={idPool}
                        initialStatus={status}
                    />
                )}
                {selectedTab === 'dice'&& (
                    <Dice/>
                )}
            </main>
        </div>
    );
}

export default App;
