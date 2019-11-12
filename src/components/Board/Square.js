import React from 'react';
import styles from './Square.module.css';

const Square = ({ x, y, piece, onSelect, selected }) => {
  return (
    <div className={[(x + y) % 2 ? styles.squarewhite : styles.squareblack, selected && styles.selected].join(' ')}
          style={piece && piece.style}
          onClick={() => onSelect(x, y)}>
    </div>
  )
}

export default Square;