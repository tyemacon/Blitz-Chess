import React from 'react';
import styles from './Square.module.css';

const Square = ({ x, y, piece, onSelect, selected }) => {
  // I hate this
  let style = {}
  if(piece){
    style = piece.style
  }
  if(selected){
    style.border = '5px solid green';
  }
  return (
    <div className={(x + y) % 2 ? styles.squarewhite : styles.squareblack}
          style={style}
          onClick={() => onSelect(x, y)}>
    </div>
  )

}

export default Square;