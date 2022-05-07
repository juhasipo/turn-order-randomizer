import React from 'react';
import Table from './Table';
import PlayerList from './PlayerList'
import './App.scss';
import {NewPlayer, Player, PlayerId, PlayerIndex} from "./CommonTypes";

const defaultPlayers: PlayerIndex = new Map<PlayerId, Player>();

const shuffle = (array: Array<number>): Array<number> => {
    const shuffled = Array.from(array);
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
};

const App = () => {

    const [players, setPlayers] = React.useState<PlayerIndex>(defaultPlayers)
    const [idPool, setIdPool] = React.useState<PlayerId>(1)
    const [playerOrder, setPlayerOrder] = React.useState<Array<PlayerId>>([])

    const incrementId = () => {
        setIdPool(idPool + 1);
    }

    const resetPlayerOrder = () => {
        setPlayerOrder(Array.from(players).map(([id]) => id));
    }

    const randomizePlayers = () => {
        resetPlayerOrder();
        setPlayerOrder(shuffle(playerOrder));
    }

    const playerAdded = (player: NewPlayer) => {
        const newPlayer = {
            id: idPool,
            ...player
        };
        setPlayers(new Map(players.set(newPlayer.id, newPlayer)));
        incrementId();
        resetPlayerOrder();
    }

    const playerRemoved = (id: PlayerId) => {
        const withRemoved = new Map(players);
        withRemoved.delete(id)
        setPlayers(withRemoved);
        resetPlayerOrder();
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="App-header-container">
                    <h1>Turn Order Randomizer</h1>
                    <sub>2.0.0</sub>
                </div>
            </header>
            <main>
                <PlayerList
                    playerAdded={playerAdded}
                    playerRemoved={playerRemoved}
                    players={players}/>
                <Table
                    players={players}
                    playerOrder={playerOrder}
                    randomizePlayers={randomizePlayers}
                />
            </main>
        </div>
    );
}

export default App;
