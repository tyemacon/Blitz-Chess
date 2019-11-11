import React from 'react';
import styles from './Square.module.css';

const Square = ({ x, y, piece }) => {
  return (
    <div className={(x+y) % 2 ? styles.squarewhite : styles.squareblack}
          style={piece && piece.style}>
    </div>
  )
}

export default Square;