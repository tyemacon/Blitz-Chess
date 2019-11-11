import React from 'react';
import styles from './Square.module.css';

const Square = ({ x, y }) => {
  return (
    <div className={styles.square} 
         style={{backgroundColor: ((x + y) % 2) ? '#565656' : 'blanchedalmond'}}>
      
    </div>
  )
}

export default Square;