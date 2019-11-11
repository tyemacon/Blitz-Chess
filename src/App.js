import React from 'react';
import styles from './App.module.css';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      board: []
    }
  }
  componentDidMount(){
    this.setState({
      board: initializeBoard()
    })
  }
  render() {
    console.log(this.state.board)
    return (
      <div className={styles.game}>
        <div className={styles.board}>{this.state.board.map((square) => <div>square</div>)}</div>
      </div>
    )
  }
}

/** Returns an 8x8 chess Board  */
const initializeBoard = () => {
  const board = [];
  for(let i =  0; i < 8; i++){
    let newRow = [];
    for(let j = 0; j < 8; j++){
      let square = {
        position: [i, j],
        piece: null,
      }
      newRow.push(square);
    }
    board.push(newRow);
  }
  return board;
}
