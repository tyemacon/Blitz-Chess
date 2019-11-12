import React from 'react';
import styles from './Square.module.css';

const Square = ({ x, y, piece, onSelect, selected }) => {
  return (
    <div className={[styles.square, (x + y) % 2 ? styles.white : styles.black, selected && styles.selected].join(' ')}
          style={piece && piece.style}
          onClick={() => onSelect(x, y)}>
    </div>
  )
}

export default Square;