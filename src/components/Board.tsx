import { useEffect, useReducer, useRef, useState } from 'react';
import TileComponent from './Tile';
import PlayerMenu from './PlayerMenu';
import './board.css'
import { countPlanes, countSoldiers, countTanks } from '../utils/countArmy';
import { Tile, State, ACTIONS_TYPE, getBoard } from '../utils/classes_types';
import GameRules from './GameRules';
import { ACTIONS } from '../utils/actions';


function Board() {
    function reducer(gameState: State, action: ACTIONS_TYPE): State {
        switch (action.type) {
            case ACTIONS.SETBOARD: return { ...gameState, board: action.payload.newBoard }
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
            case ACTIONS.SETSOLDIERBASE: return { ...gameState, soldierBase: true, tankBase: false, planeBase: false }
            case ACTIONS.SETTANKBASE: return { ...gameState, tankBase: true, soldierBase: false, planeBase: false }
            case ACTIONS.SETPLANEBASE: return { ...gameState, planeBase: true, soldierBase: false, tankBase: false }
            case ACTIONS.DEDUCTCOINS_P1: return { ...gameState, player1: {...gameState.player1, coins: gameState.player1.coins - action.payload} }
            case ACTIONS.DEDUCTCOINS_P2: return { ...gameState, player2: {...gameState.player2, coins: gameState.player2.coins - action.payload} }
            case ACTIONS.RESTARTGAME: return {...intialState}
           
            default: return gameState
        }
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
            id: '',
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
            highlight(){},
            activateTile(){},
            setMove(){},
            buildArmy(){},
            resetTile(){},
            unhighlight(){},
            buildBase(){},
        },
        hasNewMove: true,
        intervalId: 0,
        intervalCleared: false,
        planeBase: false,
        soldierBase: false,
        tankBase: false,
        turnCount: 1,
    }

    const [gameState, dispatch] = useReducer(reducer, intialState)
    const [showGameRules, setShowGameRules] = useState(true)

    const { board, currentTile, hasNewMove, planeBase,
        player, player1, player2, soldierBase, tankBase, turnCount } = gameState

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
                    tile.buildArmy()
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
            dispatch({ type: ACTIONS.SETPLAYER1UNITS, payload: { totalSoldiers1, totalTanks1, totalPlanes1 } })
            dispatch({ type: ACTIONS.SETPLAYER2UNITS, payload: { totalSoldiers2, totalTanks2, totalPlanes2 } })

        }, timerCount)
     return () => clearInterval(id) }, [player])
    
    useEffect(() => {
        const flattenedBoard = board.flat()
        if (turnCount > 2) {
            const gameContinue = flattenedBoard.find(tile => tile.player === 1)
            const gameContinue2 = flattenedBoard.find(tile => tile.player === 2)
            if (!gameContinue || !gameContinue2) {
                alert(`Player ${player} has won !`);
                dispatch({type: ACTIONS.RESTARTGAME})
            }
        }
    }, [player, board, turnCount])

    const handleEndTurn = () => {
        const newPlayer = player === 1 ? 2 : 1
        dispatch({ type: ACTIONS.SETPLAYER, payload: { newPlayer } })
        dispatch({ type: ACTIONS.RESETBUILDING })
        dispatch({ type: ACTIONS.SETHASNEWMOVE, payload: true })
        dispatch({ type: ACTIONS.SETTURNCOUNT })
        const newBoard = board.map(row => row.map(tile => {
            if (tile.player === player) tile.setMove()
            return tile
        }))
        dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
    }


    const handleTileClick = (y: number, x: number) => {
        const clickedTile = board[y][x]
      
        if (!clickedTile.active && hasNewMove) {
            const newBoard = board.map(row => row.map(tile => {
                if (tile.id === clickedTile.id)
                    tile.activateTile(player)
                return tile 
            }))
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
            dispatch({ type: ACTIONS.SETHASNEWMOVE, payload: false })
        }

        if (soldierBase || tankBase || planeBase) {
            const currentPlayer = player === 1 ? player1 : player2
            const deduceCoins = player === 1 ? ACTIONS.DEDUCTCOINS_P1 : ACTIONS.DEDUCTCOINS_P2
            const newBoard = board.map(row => row.map(tile => {
                if (tile.id === clickedTile.id && clickedTile.player === player) {
                    if (soldierBase && (currentPlayer.coins >= 100) && !tile.hasSoldierBase) {
                        dispatch({ type: deduceCoins, payload: 100 })
                        tile.buildBase("soldier")
                    }
                    if (tankBase && (currentPlayer.coins >= 500) && !tile.hasTankBase) {
                        dispatch({ type: deduceCoins, payload: 500 })
                        tile.buildBase("tank")
                    }
                    if (planeBase && (currentPlayer.coins >= 1000) && !tile.hasPlaneBase) {
                        dispatch({ type: deduceCoins, payload: 1000 })
                        tile.buildBase("plane")
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
        dispatch({ type: ACTIONS.SETCURRENTTILE, payload: clickedTile })
        if (clickedTile.player === player && clickedTile.active && clickedTile.hasMove) {
            const newBoard = board.map(row => row.map(tile => {
                if (tile.y === clickedTile.y && tile.x === clickedTile.x - 1) tile.highlight()
                if (tile.y === clickedTile.y && tile.x === clickedTile.x + 1) tile.highlight()
                if (tile.y === clickedTile.y + 1 && tile.x === clickedTile.x) tile.highlight()
                if (tile.y === clickedTile.y - 1 && tile.x === clickedTile.x) tile.highlight()
                return tile
            }))
            dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
        }

    }
  

    const handleOnDrop = (y: number, x: number) => {
        const {soldiers, tanks, planes} = currentTile
        const droppedTile = board[y][x]
        const newBoard = board.map(row => row.map(tile => {
            if (tile.id === droppedTile.id && droppedTile.isHighlighted && droppedTile.player !== player
                && droppedTile.active === false && currentTile.soldiers !== 0) {
                    tile.resetTile(player, soldiers, tanks, planes)
                    currentTile.resetTile(player, 0, 0, 0)
                }
           
            if (tile.id === droppedTile.id && droppedTile.isHighlighted  && droppedTile.player === player     
                 && currentTile.soldiers !== 0) {
                    tile.resetTile(player, soldiers + tile.soldiers, tanks + tile.tanks, planes + tile.planes)
                    currentTile.resetTile(player, 0, 0, 0) 
                  }
            if (tile.id === droppedTile.id && droppedTile.isHighlighted && droppedTile.player !== player && droppedTile.active) {
                    let attackerValue = currentTile.soldiers + currentTile.tanks * 2.5 + currentTile.planes * 5
                    let denfenderValue = droppedTile.soldiers + droppedTile.tanks * 2.5 + droppedTile.planes * 5

                    if (attackerValue > denfenderValue) {
                        tile.resetTile(player, soldiers - droppedTile.soldiers, tanks - droppedTile.tanks, planes - droppedTile.planes)
                        currentTile.resetTile(player, 0, 0, 0)
                  
                    }
                    if (denfenderValue > attackerValue) {
                        let oppositePlayer = player === 1 ? 2 : 1
                        tile.resetTile(oppositePlayer, droppedTile.soldiers - soldiers, droppedTile.tanks - tanks, droppedTile.planes - planes)
                        currentTile.resetTile(player, 0, 0, 0)
                    }
                    if (attackerValue === denfenderValue) {
                        tile.resetTile(0)
                        currentTile.resetTile(0)
                    }
                    }
                tile.unhighlight()
                return tile
                }))
        dispatch({ type: ACTIONS.SETBOARD, payload: { newBoard } })
    }
    
    const isMobile = window.screen.width < 768 ? true: false!

    return (
        <div className="main-wrapper">
            <div className="main-container">
                {isMobile || <PlayerMenu
                            id={1}
                            playerInfo={player1}
                            turnCount={turnCount}
                            onFinishTurn={handleEndTurn}
                            setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                            setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                            setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
                            currentPlayer={player}
                        />}
                    {player === 1 && isMobile && <PlayerMenu
                        id={1}
                        playerInfo={player1}
                        turnCount={turnCount}
                        onFinishTurn={handleEndTurn}
                        setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                        setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                        setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
                        currentPlayer={player}
                    />}
                <div className="board-container">
                    <div className="board">
                        {board.map(row => row.map(tile =>
                            <TileComponent
                                onDrop={handleOnDrop}
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
                    {isMobile || <PlayerMenu
                            id={2}
                            playerInfo={player2}
                            turnCount={turnCount}
                            onFinishTurn={handleEndTurn}
                            setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                            setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                            setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
                            currentPlayer={player}
                        />}
                    {player === 2 && isMobile && <PlayerMenu
                        id={2}
                        playerInfo={player2}
                        turnCount={turnCount}
                        onFinishTurn={handleEndTurn}
                        setSoldierBase={() => dispatch({ type: ACTIONS.SETSOLDIERBASE })}
                        setTankBase={() => dispatch({ type: ACTIONS.SETTANKBASE })}
                        setPlaneBase={() => dispatch({ type: ACTIONS.SETPLANEBASE })}
                        currentPlayer={player}
                    />}
            </div>
            {showGameRules && <GameRules setShowGameRules={() => setShowGameRules(false)}/>}
         </div>
    );
}

export default Board;