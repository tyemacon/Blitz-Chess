import React from 'react';
import styles from './Board.module.css';
import Square from './Square';

const Board = ({ board }) => {
  return (
    <div className={styles.board}>
      {board.map((row) => {
        return row.map((square) => <Square coord={square.position}/>)
      })}
    </div>
  )
}

export default Board;