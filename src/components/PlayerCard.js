import React from 'react';
import styles from './PlayerCard.module.css';

const PlayerCard = ({ player, score, captures }) => {
  // for readability let's take out the 84 conditionals
  if(true){
    return (
      <div className={styles.playercard}>
        <div className={styles.card}>
          <div className={[styles.color, player === 'ONE' ? styles.one : styles.two].join(' ')}>
            {score < 0 && score}
            {score === 0 && score}
            {score > 0 && `+${score}`}
          </div>
          <h2 className={styles.player}>{`Player ${player}`}</h2>
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
  }else{
    return (
      <div>

      </div>
    )
  }
  
}

export default PlayerCard;

/**
 * 
 * return (
    <div className={[styles.card, player === 'ONE' ? styles.cardone : styles.cardtwo].join(' ')}>
      <div className={[styles.color, player === 'ONE' ? styles.one : styles.two].join(' ')}>
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
 * 
 * 
 */