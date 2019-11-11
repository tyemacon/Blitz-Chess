import React from 'react';
import styles from './PlayerCard.module.css';

const PlayerCard = ({ player }) => {
  return (
    <div className={styles.card}>
      <div className={styles.color}
          style={{backgroundColor: player==='ONE' ? 'white' : 'black'}}>

      </div>
      <div className={styles.playerinfo}>
        {`Player ${player}`}
      </div>
    </div>
  )
}

export default PlayerCard;