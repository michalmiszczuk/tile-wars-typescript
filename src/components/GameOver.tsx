import closeIcon from '../static/closeicon.png'
import './modal.css'

interface GameOverMsgPros{
    gameOverMsg: String;
    resetGame: () => void;
}


function GameOver({gameOverMsg, resetGame}: GameOverMsgPros) {
  
    return (
        <div className="modal-wrapper">
            <div className="modal-content " id="game-over">
                {gameOverMsg !== "DRAW !" && <div className="modal-title">VICTORY !</div>}
                <div className="modal-text">
                    <div className="modal-subtitle">{gameOverMsg}</div>
                </div>
                <img className="modal-icon" draggable="false" src={closeIcon} width="20px" height="20px" onClick={resetGame} alt="close-icon" />
            </div>
        </div>
    );
}

export default GameOver;