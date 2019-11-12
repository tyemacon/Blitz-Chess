import React from 'react';
import styles from './PlayerCard.module.css';

const PlayerCard = ({ player, score, captures }) => {
  return (
    <div className={styles.card}>
      <div className={[styles.color].join(' ')}
          style={{backgroundColor: player==='ONE' ? 'blanchedalmond' : '#565656'}}>
        {score < 0 && score}
        {score === 0 && score}
        {score > 0 && `+${score}`}
      </div>
      <div className={styles.playerinfo}>
        {`Player ${player}`}
      </div>
      <div>
      </div>
      <div>
        {captures.map((piece) => piece.value)}
      </div>
    </div>
  )
}

export default PlayerCard;