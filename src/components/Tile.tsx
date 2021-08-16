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
}

function Tile({ tile, onTileClick, currentPlayer, onDragStart, onDrop, buildingActive }: TileProps) {

    const { soldiers, tanks, planes, active, isHighlighted, player, hasMove, hasPlaneBase, hasTankBase, hasSoldierBase } = tile

    const allowDrop = (e: React.DragEvent | React.TouchEvent) => {
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
    })
    
    function drag(e: React.TouchEvent){
        let myLocation = e.changedTouches[0]
        let target = document.elementFromPoint(myLocation.clientX, myLocation.clientY) as HTMLDivElement | HTMLSpanElement | HTMLImageElement
        let x = target.getAttribute("data-x")!;
        let y = target.getAttribute("data-y")!;
        onDrop(+y, +x)
    }


    return (
        <div
            data-x={tile.x}
            data-y={tile.y}
            draggable={player === currentPlayer && active && hasMove}
            onDragStart={() => onDragStart(tile.y, tile.x)}
            onDragOver={allowDrop}
            onTouchStart={() => onDragStart(tile.y, tile.x)}
            onTouchEnd={(e) => (e.preventDefault(), onTileClick(tile.y, tile.x), drag(e))}
            onDrop={() => onDrop(tile.y, tile.x)}
            onClick={() => onTileClick(tile.y, tile.x)}
            className={tileClass}
        >
            {active && <div 
            data-x={tile.x}
            data-y={tile.y} 
            className="forces">
            <img 
            data-x={tile.x}
            data-y={tile.y}
            className={hasSoldierBase ? "army-icon built" : "army-icon"} draggable="false" src={soldiersIcon} width="20px" height="20px" />
                <span 
                data-x={tile.x}
                 data-y={tile.y}>
                     {soldiers}</span>
            </div>}
            {active && <div 
            data-x={tile.x}
            data-y={tile.y}
            className="forces">
                <img data-x={tile.x}
            data-y={tile.y} className={hasTankBase ? "army-icon built" : "army-icon"} draggable="false" src={tankIcon} width="20px" height="20px" />
                <span data-x={tile.x}
            data-y={tile.y}>{tanksRounded}</span>
            </div>}
            {active && <div data-x={tile.x}
            data-y={tile.y} className="forces">
                <img data-x={tile.x}
            data-y={tile.y} className={hasPlaneBase ? "army-icon built" : "army-icon"} draggable="false" src={planeIcon} width="20px" height="20px" />
                <span data-x={tile.x}
            data-y={tile.y}>{planesRounded}</span>
            </div>}
        </div>

    );
}

export default Tile;