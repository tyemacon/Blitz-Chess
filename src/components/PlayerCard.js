import React from 'react';
import styles from './PlayerCard.module.css';
const PlayerCard = ({ player, score, captures}) => {
  // for readability let's take out the 84 conditionals
  return (
    <div className={[styles.playercard, player === 'ONE' ? styles.cardone : styles.cardtwo].join(' ')}>
      <div className={styles.card}>
        <div className={[styles.color, player === 'ONE' ? styles.one : styles.two].join(' ')}>
          {score < 0 && score}
          {score === 0 && score}
          {score > 0 && `+${score}`}
        </div>
        <h2 className={styles.player}>{`${player}`}</h2>
      </div>
      <div className={styles.pieces} style={{gridArea: 'pawns'}}>
        {captures[1].map((piece, i) => {
          return <div key={i} style={piece.style} className={styles.piece}></div>
        })}
      </div>
      <div className={styles.pieces} style={{gridArea: 'knights'}}>
        {captures[3.5].map((piece, i) => {
          return <div key={i} style={piece.style} className={styles.piece}></div>
        })}
      </div>
      <div className={styles.pieces} style={{gridArea: 'bishops'}}>
        {captures[3].map((piece, i) => {
          return <div key={i} style={piece.style} className={styles.piece}></div>
        })}
      </div>
      <div className={styles.pieces} style={{gridArea: 'rooks'}}>
        {captures[5].map((piece, i) => {
          return <div key={i} style={piece.style} className={styles.piece}></div>
        })}
      </div>
      <div className={styles.pieces} style={{gridArea: 'queens'}}>
        {captures[9].map((piece, i) => {
          return <div key={i} style={piece.style} className={styles.piece}></div>
        })}
      </div>
    </div>
  )
}

export default PlayerCard;

