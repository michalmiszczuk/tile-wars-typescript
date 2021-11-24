import closeIcon from '../static/closeicon.png'
import './modal.css'

interface GameRulesProps {
    setShowGameRules: () => void;
}

function GameRules({ setShowGameRules }: GameRulesProps) {
    return (
        <div className="modal-wrapper">
            <div className="modal-content" >
                <div className="modal-title">TILE WARS</div>
                <div className="modal-text">
                <div className="modal-subtitle">GAME RULES</div>
                During each turn you can take one empty field and if your fields have troops you can
                drag and move them into new fields or attack the enemy. You have to be fast because when it's your turn the enemy
                builds his forces. Build bases to increase soldiers, tanks or plane production. Take all enemy fields and be victorious.
                <br/> Good Luck !
                </div>
                <img className="modal-icon"  draggable="false" src={closeIcon} width="20px" height="20px" onClick={setShowGameRules} alt="close-icon"/>
         </div>
        </div>
    );
}

export default GameRules;