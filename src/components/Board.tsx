import React, { useEffect, useReducer, useRef } from 'react';
import TileComponent from './Tile';
import PlayerMenu from './PlayerMenu';
import './board.css'
import { countPlanes, countSoldiers, countTanks } from '../utils/countArmy';

class Tile {
    id: string;
    y: number;
    x: number;
    active: boolean;
    hasMove: boolean;
    hasSoldierBase: boolean;
    hasTankBase: boolean;
    hasPlaneBase: boolean;
    isHighlighted: boolean;
    planes: number;
    player: number;
    soldiers: number;
    tanks: number;

    constructor(x: number, y: number) {
        this.id = `${x}${y}`;
        this.y = y;
        this.x = x
        this.active = false;
        this.hasMove = true;
        this.hasSoldierBase = false;
        this.hasTankBase = false;
        this.hasPlaneBase = false;
        this.isHighlighted = false;
        this.soldiers = 0;
        this.planes = 0;
        this.tanks = 0;
        this.player = 0;
        }
    
    
    }


const ACTIONS = {
    DEDUCTCOINS: 'deductcoins',
    GAMESTARTED: 'gamestarted',
    RESETBUILDING: 'resetbuilding',
    SETBOARD: 'setboard',
    SETCURRENTTILE: 'setcurrenttile',
    SETHASNEWMOVE: 'sethasnewmove',
    SETINTERVALID: 'setintervalid',
    SETPLANEBASE: 'setplanebase',
    SETPLAYER: 'setplayer',
    SETPLAYER1COINS: 'setcoins1',
    SETPLAYER1UNITS: 'setplayer1units',
    SETPLAYER2COINS: 'setcoins2',
    SETPLAYER2UNITS: 'setplayer2units',
    SETSOLDIERBASE: 'setsoldierbase',
    SETTANKBASE: 'settankbase',
    SETTURNCOUNT: 'setturncount',
    SETWASTRANSFERED: 'setwastransfered',
}

// type Reducer<State, Action> = (state: State, action: Action) => State;
type State = {
    board: Tile[][],
    player: number,
    player1: {
        coins: number,
        soldiers: number,
        tanks: number,
        planes: number
    },
    player2: {
        coins: number,
        soldiers: number,
        tanks: number,
        planes: number
    },
    currentTile: Tile,
    hasNewMove: boolean,
    planeBase: boolean,
    soldierBase: boolean,
    tankBase: boolean,
    turnCount: number,
    wasTransfered: string,
    intervalId: number,
}

type ACTIONS = {
    type: string,
    payload?: any,
}

function Board() {
    function reducer(gameState: State, action: ACTIONS): State {
        switch (action.type) {
            case ACTIONS.SETBOARD: return { ...gameState, board: action.payload.newBoard }
            case ACTIONS.SETINTERVALID: return { ...gameState, intervalId: action.payload.id }
            case ACTIONS.SETPLAYER1COINS: return { ...gameState, player1: { ...gameState.player1, coins: gameState.player1.coins + action.payload.activeFields } }
            case ACTIONS.SETPLAYER2COINS: return { ...gameState, player2: { ...gameState.player2, coins: gameState.player2.coins + action.payload.activeFields } }
            case ACTIONS.SETPLAYER1UNITS:
                return { ...gameState, player1: { soldiers: action.payload.totalSoldiers1, tanks: action.payload.totalTanks1, planes: action.payload.totalPlanes1, coins: gameState.player1.coins } }
            case ACTIONS.SETPLAYER2UNITS:
                return { ...gameState, player2: { soldiers: action.payload.totalSoldiers2, tanks: action.payload.totalTanks2, planes: action.payload.totalPlanes2, coins: gameState.player2.coins } }
            case ACTIONS.SETPLAYER: return { ...gameState, player: action.payload.newPlayer }
            case ACTIONS.SETHASNEWMOVE: return { ...gameState, hasNewMove: action.payload }
            case ACTIONS.SETTURNCOUNT: return { ...gameState, turnCount: gameState.turnCount + 0.5 }
            case ACTIONS.RESETBUILDING: return { ...gameState, soldierBase: false, tankBase: false, planeBase: false }
            case ACTIONS.SETCURRENTTILE: return { ...gameState, currentTile: action.payload }
            case ACTIONS.SETWASTRANSFERED: return { ...gameState, wasTransfered: action.payload }
            case ACTIONS.SETSOLDIERBASE: return { ...gameState, soldierBase: true, tankBase: false, planeBase: false }
            case ACTIONS.SETTANKBASE: return { ...gameState, tankBase: true, soldierBase: false, planeBase: false }
            case ACTIONS.SETPLANEBASE: return { ...gameState, planeBase: true, soldierBase: false, tankBase: false }
            case ACTIONS.DEDUCTCOINS && gameState.player === 1: return { ...gameState, player1: { ...gameState.player1, coins: gameState.player1.coins - action.payload } }
            case ACTIONS.DEDUCTCOINS && gameState.player === 2: return { ...gameState, player2: { ...gameState.player2, coins: gameState.player2.coins - action.payload } }   
            default: return gameState
            // case ACTIONS.RESETTILE: return {}
            // case ACTIONS.GAMESTARTED: return { ...gameState, gameStarted: true }
        }
    }

    function getBoard(): Tile[][] {
        let newBoard: Tile[][] = []
        for (let y = 0; y <= 9; y++) {
            let oneRow: Tile[] = []
            newBoard.push(oneRow)
            for (let x = 0; x <= 9; x++) {
                let tile = new Tile(x, y)
                oneRow.push(tile)
            }
        }
        return newBoard
    }


    const intialState: State = {
        board: getBoard(),
        player: 1,
        player1: {
            coins: 0,
            soldiers: 0,
            tanks: 0,
            planes: 0
        },
        player2: {
            coins: 0,
            soldiers: 0,
            tanks: 0,
            planes: 0
        },
        currentTile: {
            id: '0',
            y: 0,
            x: 0,
            active: false,
            hasMove: false,
            hasSoldierBase: false,
            hasTankBase: false,
            hasPlaneBase: false,
            isHighlighted: false,
            planes: 0,
            player: 0,
            soldiers: 0,
            tanks: 0,
        },
        hasNewMove: true,
        intervalId: 0,
        planeBase: false,
        soldierBase: false,
        tankBase: false,
        turnCount: 1,
        wasTransfered: '',
    }

    const [gameState, dispatch] = useReducer(reducer, intialState)

    const { board, currentTile, hasNewMove, intervalId, planeBase,
        player, player1, player2, soldierBase, tankBase, turnCount, wasTransfered, } = gameState

    const timerCount = 1000
    const buildingActive = soldierBase || tankBase || planeBase


    const prevBoard = useRef<Tile[][] | null>(null)
    prevBoard.current = board

    useEffect(() => {
        const id = setInterval(() => {
            let activeFields = 0
            const newBoard = prevBoard.current!.map(row => row.map(tile => {
                if (tile.active && tile.player !== player) {
                    activeFields += 1
                    return {
                        ...tile,
                        soldiers: tile.hasSoldierBase ? tile.soldiers += 2 : tile.soldiers += 1,
                        tanks: tile.hasTankBase ? tile.tanks += 1.2 : tile.tanks += 0.6,
                        planes: tile.hasPlaneBase ? tile.planes += 0.5 : tile.planes += 0.25,
                    }
                }
                return tile
            }))
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
            if (player === 1) dispatch({ type: ACTIONS.SETPLAYER2COINS, payload: { activeFields } })
            if (player === 2) dispatch({ type: ACTIONS.SETPLAYER1COINS, payload: { activeFields } })

            const flattenedBoard = prevBoard.current!.flat()

            let totalSoldiers1 = countSoldiers(flattenedBoard, 1)
            let totalTanks1 = countTanks(flattenedBoard, 1)
            let totalPlanes1 = countPlanes(flattenedBoard, 1)

            let totalSoldiers2 = countSoldiers(flattenedBoard, 2)
            let totalTanks2 = countTanks(flattenedBoard, 2)
            let totalPlanes2 = countPlanes(flattenedBoard, 2)

            dispatch({ type: ACTIONS.SETINTERVALID, payload: { id } })
            dispatch({ type: ACTIONS.SETPLAYER1UNITS, payload: { totalSoldiers1, totalTanks1, totalPlanes1 } })
            dispatch({ type: ACTIONS.SETPLAYER2UNITS, payload: { totalSoldiers2, totalTanks2, totalPlanes2 } })

        }, timerCount)
    }, [player])

    useEffect(() => {
        clearInterval(intervalId)
    }, [player])

    useEffect(() => {
        const flattenedBoard = board.flat()
        if (turnCount > 1) {
            const gameContinue = flattenedBoard.find(tile => tile.player === 1)
            const gameContinue2 = flattenedBoard.find(tile => tile.player === 2)
            if (!gameContinue || !gameContinue2) return alert(`Player ${player} has won !`)
        }
    }, [wasTransfered])

    const handleEndTurn = () => {
        const newPlayer = player === 1 ? 2 : 1
        dispatch({ type: ACTIONS.RESETBUILDING })
        dispatch({ type: ACTIONS.SETHASNEWMOVE, payload: true })
        dispatch({ type: ACTIONS.SETPLAYER, payload: { newPlayer } })
        dispatch({ type: ACTIONS.SETTURNCOUNT })
        const newBoard = board.map(row => row.map(tile => {
            if (tile.player === player) return { ...tile, hasMove: true }
            return tile
        }))
        dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
    }
    console.log(gameState.board)

    const handleTileClick = (y: number, x: number) => {
        const clickedTile = board[y][x]
        if (!clickedTile.active && hasNewMove) {
            const newBoard = board.map(row => row.map(tile => {
                if (tile.x === clickedTile.x && tile.y === clickedTile.y)
                    return { ...tile, player: player, active: true, hasMove: false }
                return tile
            }))
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
            dispatch({ type: ACTIONS.SETHASNEWMOVE, payload: false })
        }

        if (soldierBase || tankBase || planeBase) {
            const currentPlayer = player === 1 ? player1 : player2
            const newBoard = board.map(row => row.map(tile => {
                if (tile.x === clickedTile.x && tile.y === clickedTile.y && clickedTile.player === player) {
                    if (soldierBase && (currentPlayer.coins >= 100) && !tile.hasSoldierBase) {
                        dispatch({ type: ACTIONS.DEDUCTCOINS, payload: 100 })
                        return { ...tile, hasSoldierBase: true }
                    }
                    if (tankBase && (currentPlayer.coins >= 500) && !tile.hasTankBase) {
                        dispatch({ type: ACTIONS.DEDUCTCOINS, payload: 500 })
                        return { ...tile, hasTankBase: true }
                    }
                    if (planeBase && (currentPlayer.coins >= 1000) && !tile.hasPlaneBase) {
                        dispatch({ type: ACTIONS.DEDUCTCOINS, payload: 1000 })
                        return { ...tile, hasPlaneBase: true }
                    }
                }
                return tile
            }))

            dispatch({ type: ACTIONS.RESETBUILDING })
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
        }
    }

    const handleDragStart = (y: number, x: number) => {
        const clickedTile = board[y][x]
        if (clickedTile.player === player && clickedTile.active && clickedTile.hasMove) {
            const newBoard = board.map(row => row.map(tile => {
                if (tile.y === clickedTile.y && tile.x === clickedTile.x + 1) return { ...tile, isHighlighted: true }
                if (tile.y === clickedTile.y && tile.x === clickedTile.x - 1) return { ...tile, isHighlighted: true }
                if (tile.y === clickedTile.y + 1 && tile.x === clickedTile.x) return { ...tile, isHighlighted: true }
                if (tile.y === clickedTile.y - 1 && tile.x === clickedTile.x) return { ...tile, isHighlighted: true }
                return tile
            }))
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
            dispatch({ type: ACTIONS.SETCURRENTTILE, payload: clickedTile })
            dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: '' })
        }

    }

    const handleDragEnd = () => {
        const newBoard = board.map(row => row.map(tile => {
            if ((wasTransfered === 'empty-field-taken') || (wasTransfered === 'army-transfer') || (wasTransfered === 'attacker-wins')) {
                if (tile.x === currentTile.x && tile.y === currentTile.y) return { ...tile, soldiers: 0, tanks: 0, planes: 0, hasMove: false }
            }
            if (wasTransfered === 'attacker-loses') {
                if (tile.x === currentTile.x && tile.y === currentTile.y) {
                    return { ...tile, soldiers: 0, tanks: 0, planes: 0, hasMove: 0, player: player === 1 ? 2 : 1 }
                }
            }
            if (wasTransfered === 'draw') {
                if (tile.x === currentTile.x && tile.y === currentTile.y)
                    return { ...tile, soldiers: 0, tanks: 0, planes: 0, hasMove: 0, active: false, player: 0 }
            }
            return { ...tile, isHighlighted: false }
        }))
        dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
        dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: null })
    }

    const handleOnDrop = (y: number, x: number) => {
        const droppedTile = board[y][x]
        const newBoard = board.map(row => row.map(tile => {
            if (tile.x === droppedTile.x && tile.y === droppedTile.y && droppedTile.isHighlighted && droppedTile.player !== player
                && droppedTile.active === false
                && currentTile.soldiers !== 0) {
                dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: "empty-field-taken" })
                return {
                    ...tile, soldiers: currentTile.soldiers, tanks: currentTile.tanks, planes: currentTile.planes,
                    active: true, player: player, hasMove: false,
                }
            }
            if (tile.x === droppedTile.x && tile.y === droppedTile.y && droppedTile.isHighlighted && droppedTile.player === player
                && currentTile.soldiers !== 0) {
                dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: 'army-transfer' })
                return {
                    ...tile, soldiers: currentTile.soldiers + tile.soldiers, tanks: currentTile.tanks + tile.tanks,
                    planes: currentTile.planes + tile.planes, active: true, hasMove: false
                }
            }
            if (tile.x === droppedTile.x && tile.y === droppedTile.y && droppedTile.isHighlighted && droppedTile.player !== player) {
                let attackerValue = currentTile.soldiers + currentTile.tanks * 2.5 + currentTile.planes * 5
                let denfenderValue = droppedTile.soldiers + droppedTile.tanks * 2.5 + droppedTile.planes * 5
                if (attackerValue > denfenderValue) {
                    dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: 'attacker-wins' })
                    return {
                        ...tile, soldiers: currentTile.soldiers - droppedTile.soldiers, tanks: currentTile.tanks - droppedTile.tanks,
                        planes: currentTile.planes - droppedTile.planes, hasMove: false, player: player
                    }
                }
                if (denfenderValue > attackerValue) {
                    dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: 'attacker-loses' })
                    return {
                        ...tile, soldiers: droppedTile.soldiers - currentTile.soldiers, tanks: droppedTile.tanks - currentTile.tanks,
                        planes: droppedTile.planes - currentTile.planes,
                    }
                }
                if (attackerValue === denfenderValue) {
                    dispatch({ type: ACTIONS.SETWASTRANSFERED, payload: 'draw' })
                    return {
                        ...tile, soldiers: 0, tanks: 0, planes: 0, hasMove: false, player: 0, active: false
                    }
                }
            }
            return tile
        }))
        dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
    }
    console.log(player)
    return (
        <div className="main-container">
            <PlayerMenu
                id={1}
                playerInfo={player1}
                currentPlayer={player}
                turnCount={turnCount}
                onFinishTurn={handleEndTurn}
                setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
            />
            <div className="board-container">
                <div className="board">
                    {board.map(row => row.map(tile =>
                        <TileComponent
                            onDrop={handleOnDrop}
                            onDragEnd={handleDragEnd}
                            onDragStart={handleDragStart}
                            currentPlayer={player}
                            key={tile.id}
                            tile={tile}
                            onTileClick={handleTileClick}
                            buildingActive={buildingActive}
                        />
                    ))}
                </div>
            </div>
            <PlayerMenu
                id={2}
                playerInfo={player2}
                currentPlayer={player}
                turnCount={turnCount}
                onFinishTurn={handleEndTurn}
                setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
            />
        </div>
    );
}

export default Board;