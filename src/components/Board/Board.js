import React from 'react';
import styles from './Board.module.css';
import Square from './Square';

const Board = ({ board }) => {
  return (
    <div className={styles.board}>
      {board.map((row, i) => {
        return row.map((square, j) => 
          <Square key={`${i}${j}`} 
          x={square.position[0]} 
          y={square.position[1]} 
          piece={square.piece}/>)
      })}
    </div>
  )
}

export default Board;