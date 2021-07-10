import React from 'react';
import "./tile.css"
import soldiersIcon from "../static/soldiers.svg"
import planeIcon from "../static/aeroplane.svg"
import tankIcon from "../static/tank.svg"
import classNames from 'classnames';

interface TileProps {
    tile: {
        x:number;
        y:number;
        soldiers: number;
        tanks: number;
        planes: number;
        active: boolean;
        isHighlighted: boolean;
        player: number;
        hasMove: boolean;
        hasPlaneBase: boolean;
        hasTankBase: boolean;
        hasSoldierBase: boolean;
    }
    currentPlayer: number;
    buildingActive: boolean;
    onTileClick: (x: number, y: number) => void;
    onDragStart: (x: number, y: number) => void;
    onDrop: (x: number, y: number) => void;
    onDragEnd: () => void;
}

function Tile({ tile, onTileClick, currentPlayer, onDragStart, onDragEnd, onDrop, buildingActive }: TileProps) {

    const { soldiers, tanks, planes, active, isHighlighted, player, hasMove, hasPlaneBase, hasTankBase, hasSoldierBase } = tile

    const allowDrop = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const tanksRounded = Math.floor(tanks)
    const planesRounded = Math.floor(planes)

    let tileClass = classNames({
        tile: true,
        player1: player === 1,
        player2: player === 2,
        highlighted: isHighlighted || (buildingActive && player === currentPlayer),
        hasNoMove1: !hasMove && player === 1,
        hasNoMove2: !hasMove && player === 2,
        hasPlaneBase: hasPlaneBase,
        hasTankBase: hasTankBase,
        hasSoldierBase: hasSoldierBase
    })

    return (
        <div
            draggable={player === currentPlayer && active && hasMove}
            onDragStart={() => onDragStart(tile.y, tile.x)}
            onDragOver={allowDrop}
            onDragEnd={onDragEnd}
            onDrop={() => onDrop(tile.y, tile.x)}
            onClick={() => onTileClick(tile.y, tile.x)}
            className={tileClass}
        >
            {active && <div className="forces">
                <img draggable="false" src={soldiersIcon} width="20px" height="20px" />
                <span>{soldiers}</span>
            </div>}
            {active && <div className="forces">
                <img draggable="false" src={tankIcon} width="20px" height="20px" />
                <span>{tanksRounded}</span>
            </div>}
            {active && <div className="forces">
                <img draggable="false" src={planeIcon} width="20px" height="20px" />
                <span>{planesRounded}</span>
            </div>}
        </div>

    );
}

export default Tile;