import React from 'react';
import styles from './Board.module.css';
import Square from './Square';

const Board = ({ board }) => {
  return (
    <div className={styles.board}>
      {board.map((row) => {
        return row.map((square) => <Square x={square.position[0]} y={square.position[1]}/>)
      })}
    </div>
  )
}

export default Board;