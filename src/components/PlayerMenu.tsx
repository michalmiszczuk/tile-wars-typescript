import React from 'react';
import PlayerButtons from './PlayerButtons';
import coin from '../static/coin.svg'
import './board.css'

interface PlayerMenuProps {
    id: number;
    playerInfo: {
        coins: number;
        soldiers: number;
        tanks: number;
        planes: number;
    }
    turnCount: number;
    currentPlayer: number;
    hasNewMove: Boolean;
    onFinishTurn: () => void;
    setSoldierBase: () => void;
    setTankBase: () => void;
    setPlaneBase: () => void;
}

function PlayerMenu({ id, currentPlayer, playerInfo, turnCount, onFinishTurn, setSoldierBase, setTankBase, setPlaneBase, hasNewMove}: PlayerMenuProps) {

    const { coins, soldiers, tanks, planes } = playerInfo
    const hasMove = currentPlayer === id && hasNewMove ? "YES" : "NO"

    return (
       
        <div className="player-container">
            <div className="player-info-bar">
                <div className="player-menu">PLAYER {id}</div>
                <div className="coins">
                    <img draggable="false" className="coin-icon" src={coin} width="20px" height="20px" alt="coin-icon" />
                    {coins}
                </div>
                <div className="army-info-wrapper">
                    <div className="army-info">NEW MOVE : {hasMove}</div>
                    <div className="army-info">TURN : {Math.floor(turnCount)}</div>
                    <div className="army-info">SOLDIERS: {Math.floor(soldiers)} </div>
                    <div className="army-info">TANKS:  {Math.floor(tanks)} </div>
                    <div className="army-info">PLANES:  {Math.floor(planes)} </div>
                </div>
            </div>
              {currentPlayer === id &&  <PlayerButtons
                    onFinishTurn={onFinishTurn}
                    setSoldierBase={setSoldierBase}
                    setTankBase={setTankBase}
                    setPlaneBase={setPlaneBase}
                />}
        </div>
    );
}

export default PlayerMenu;