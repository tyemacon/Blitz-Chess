import React from 'react';
import styles from './Square.module.css';

const Square = ({ coord }) => {
  return (
    <div className={styles.square}>{coord[0]}{coord[1]}</div>
  )
}

export default Square;