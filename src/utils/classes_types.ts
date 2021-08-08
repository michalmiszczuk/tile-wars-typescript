export class Tile {
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
    highlight() {
        this.isHighlighted = true
    }
    unhighlight() {
        this.isHighlighted = false
    }
    
    activateTile(player: number) {
        this.active = true
        this.player = player
        this.hasMove = false

    }
    setMove() {
        this.hasMove = true
    }
    buildArmy() {
        this.hasSoldierBase ? this.soldiers += 2 : this.soldiers += 1
        this.hasTankBase ? this.tanks += 1.2 : this.tanks += 0.6
        this.hasPlaneBase ? this.planes += 0.5 : this.planes += 0.25

    }
    resetTile(player?: number, soldiers?: number, tanks?: number, planes?: number) {
        this.soldiers = soldiers || 0
        this.tanks = tanks || 0
        this.planes = planes || 0
        this.hasMove = false
        this.isHighlighted = false
        player === 0 ? this.active = false : this.active = true
        this.player = player ?? this.player
    }
    buildBase(type: string) {
        if (type === 'soldier') this.hasSoldierBase = true
        if (type === 'tank') this.hasTankBase = true
        if (type === 'plane') this.hasPlaneBase = true
    }
}

export function getBoard(): Tile[][] {
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

export type State = {
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
    intervalId: number,
    intervalCleared: boolean;
}

export type ACTIONS_TYPE = {
    type: string,
    payload?: any,
}
