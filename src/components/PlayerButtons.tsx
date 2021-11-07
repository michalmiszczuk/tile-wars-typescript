
import baseIcon from '../static/base.png'
import tankIcon from '../static/factory.png'
import planeIcon from '../static/airport.png'
import coin from '../static/coin.svg'
import './board.css'

interface PlayerButtonsProps {
    onFinishTurn: () => void;
    setSoldierBase: () => void;
    setTankBase: () => void;
    setPlaneBase: () => void;
}


function PlayerButtons({ onFinishTurn, setSoldierBase, setTankBase, setPlaneBase }: PlayerButtonsProps) {
    return (
        <div className="player-menu-buttons">
            <button className="end-turn" onClick={onFinishTurn}>FINISH TURN</button>
            <button onClick={setSoldierBase} className="build-soldier-base build-button" >
                <img draggable="false" src={baseIcon} width="20px" height="20px" className="build-icon" alt="soldier-base-icon" />
                <span className="hide-text">SOLDIER BASE</span>
                <div className="price-build"><img draggable="false" src={coin} width="15px" height="15px" alt="coin-icon" /> 100</div>
            </button>
            <button onClick={setTankBase} className="build-tank-base build-button" >
                <img draggable="false" src={tankIcon} width="20px" height="20px" className="build-icon" alt="tank-base-icon" />
                <span className="hide-text">TANK BASE</span>
                <div className="price-build"><img draggable="false" src={coin} width="15px" height="15px" alt="coin-icon" /> 500</div>
            </button>
            <button onClick={setPlaneBase} className="build-plane-base build-button" >
                <img draggable="false" src={planeIcon} width="20px" height="20px" className="build-icon" alt="plane-base-icon" />
                <span className="hide-text"> PLANE BASE</span>
                <div className="price-build"><img draggable="false" src={coin} width="15px" height="15px" alt="coin-icon"  /> 1000</div>
            </button>
        </div>
    );
}

export default PlayerButtons;