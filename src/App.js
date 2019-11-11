import React from 'react';
import styles from './App.module.css';

import PlayerCard from './components/PlayerCard';
import Board from './components/Board/Board'
import Pawn from './components/Pieces/Pawn/Pawn';
import Rook from './components/Pieces/Rook/Rook';
import Knight from './components/Pieces/Knight/Knight';
import Bishop from './components/Pieces/Bishop/Bishop';
import King from './components/Pieces/Knight/Knight';
import Queen from './components/Pieces/Queen/Queen';
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
    return (
      <div className={styles.game}>
        <div className={styles.title}>
          <h3>Chess</h3>
        </div>
        <div className={styles.playerone}>
          <PlayerCard player={'ONE'}/>
        </div>
        <div className={styles.board}>
          <Board board={this.state.board}/>
        </div>
        <div className={styles.playertwo}>
          <PlayerCard player={'TWO'}/>
        </div>
      </div>
    )
  }
}

/** Returns an 8x8 chess Board  */
const initializeBoard = () => {
  const board = [];
  // create empty board
  for(let i =  0; i < 8; i++){
    let newRow = [];
    for(let j = 0; j < 8; j++){
      let square = {
        position: [i, j],
        piece: null,
        player: null,
      }
      newRow.push(square);
    }
    board.push(newRow);
  }
  // Place Pawns
  for(let j = 0; j < 8; j++){
    board[1][j].piece = new Pawn('ONE');
    board[6][j].piece = new Pawn('TWO');
  }
  // Place Rooks
  board[0][0].piece = new Rook('ONE');
  board[0][7].piece = new Rook('ONE');
  board[7][0].piece = new Rook('TWO');
  board[7][7].piece = new Rook('TWO');
   // Place Knights
   board[0][1].piece = new Knight('ONE');
   board[0][6].piece = new Knight('ONE');
   board[7][1].piece = new Knight('TWO');
   board[7][6].piece = new Knight('TWO');
   // Place Bishops
   board[0][2].piece = new Bishop('ONE');
   board[0][5].piece = new Bishop('ONE');
   board[7][2].piece = new Bishop('TWO');
   board[7][5].piece = new Bishop('TWO');
   // Place Queens
   board[0][3].piece = new Queen('ONE');
   board[7][3].piece = new Queen('TWO');
   // Place Kings
   board[0][4].piece = new King('ONE');
   board[7][4].piece = new King('TWO');

  return board;
}
