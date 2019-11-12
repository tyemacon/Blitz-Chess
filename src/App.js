import React from 'react';
import { cloneDeep } from 'lodash'
import styles from './App.module.css';

import PlayerCard from './components/PlayerCard';
import Board from './components/Board/Board';
import Pawn from './components/Pieces/Pawn';
import Rook from './components/Pieces/Rook';
import Knight from './components/Pieces/Knight';
import Bishop from './components/Pieces/Bishop';
import King from './components/Pieces/King';
import Queen from './components/Pieces/Queen';
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      board: initializeBoard(),
      player: 'ONE',
      playerOneCaptures: [],
      playerTwoCaptures: [],
      playerOneKing: [0,4],
      playerTwoKing: [7,4],
      playerOneScore: 0,
      playerTwoScore: 0,
      selectedX: null,
      selectedY: null,
      path: [],
      inCheck: false,
      selfCheck: false,
    }
    this.onSelect = this.onSelect.bind(this);
  }

  // manage all logic delegated to each piece
  onSelect(x, y){
    if(this.state.path.includes(`${x}${y}`)){
      // MOVE THE PIECE
      this.movePiece(x, y);
    }else if((this.state.selectedX === x && this.state.selectedY === y) || !this.state.board[x][y].piece){
      // CLEAR PATHS
      if(!isNaN(this.state.selectedX)){
        this.clearPaths();
      }
    }else if(this.state.board[x][y].piece.player === this.state.player){
      // GENERATE MOVE PATHS
      if(!isNaN(this.state.selectedX)){
        // CLEAR PATHS IF CLICKED ON DIFFERENT PIECES
        this.clearPaths(() => this.generatePaths(x, y))
      }else{
        this.generatePaths(x, y)
      }
    }else{
      console.log('TODO')
    }
  }

  generatePaths(x, y){
    let selectedPiece = this.state.board[x][y].piece;
    const boardClone = cloneDeep(this.state.board);
    const availableSpaces = selectedPiece.availableSpaces(x, y, this.state.board, this.state.player);
    let path = [];
    availableSpaces.forEach((coord) => {
        boardClone[coord[0]][coord[1]].selected = true;
        path.push(`${coord[0]}${coord[1]}`);
    })
    this.setState({
      selectedX: x,
      selectedY: y,
      board: boardClone,
      path: path,
    })
  }
  clearPaths(callback) {
    const boardClone = cloneDeep(this.state.board);
    this.state.path.forEach((coord) => {
      let row = Number(coord[0])
      let col = Number(coord[1])
      boardClone[row][col].selected = false;
    })
    this.setState({
      selectedX: null,
      selectedY: null,
      board: boardClone,
      path: []
    }, callback)
  }
  movePiece(x, y) {
    const boardClone = cloneDeep(this.state.board);
    let selectedPiece = boardClone[this.state.selectedX][this.state.selectedY].piece;
    boardClone[this.state.selectedX][this.state.selectedY].piece = null;
    boardClone[x][y].piece = selectedPiece;
    if(this.checkSelfChecks(x, y, boardClone, this.state.player)){
      this.setState({
        selfCheck: true
      }, () => setTimeout(() => {
        this.setState({
        selfCheck: false
      })}, 2000))
      return;
    }
    if(this.state.board[x][y].piece){
      // CAPTURE PIECE
      this.capturePiece(x, y);
    }
    this.state.path.forEach((coord) => {
      let row = Number(coord[0])
      let col = Number(coord[1])
      boardClone[row][col].selected = false;
    })
    let pOneKing = this.state.playerOneKing;
    let pTwoKing = this.state.playerTwoKing;
    if(this.state.player === 'ONE' && (pOneKing[0] === this.state.selectedX && pOneKing[1] === this.state.selectedY)){
      pOneKing = [x, y];
    }else if(pTwoKing[0] === this.state.selectedX && pTwoKing[1] === this.state.selectedY){
      pTwoKing = [x, y];
    }
    this.setState({
      selectedX: null,
      selectedY: null,
      board: boardClone,
      playerOneKing: pOneKing,
      playerTwoKing: pTwoKing,
      inCheck: false,
      path: []
    }, () => {
      if(this.checkSelfChecks(x, y, this.state.board, this.state.player === 'ONE' ? 'TWO' : 'ONE')){
        this.setState({
          inCheck: true
        })
      }
      this.setState({
        player: this.state.player === 'ONE' ? 'TWO' : 'ONE'
      })
 
    })
  }
  capturePiece(x, y) {
    if(this.state.player === 'ONE'){
      this.setState({
        playerOneScore: Math.floor(this.state.playerOneScore + this.state.board[x][y].piece.value),
        playerOneCaptures: [...this.state.playerOneCaptures, this.state.board[x][y].piece]
      })
    }else{
      this.setState({
        playerTwoScore: Math.floor(this.state.playerTwoScore + this.state.board[x][y].piece.value),
        playerTwoCaptures: [...this.state.playerTwoCaptures, this.state.board[x][y].piece]
      })
    }
  }
  // returns 1 if player in check
  checkSelfChecks(x, y, board, player){
    let check;
    if(player === 'ONE'){
      let kingOneRow = this.state.playerOneKing[0];
      let kingOneCol = this.state.playerOneKing[1];
      // THE KING IS BEING MOVED
      if(this.state.selectedX === kingOneRow && this.state.selectedY === kingOneCol){
        check = board[x][y].piece.check(x, y, board, player);
      }else{
        check = board[kingOneRow][kingOneCol].piece.check(kingOneRow, kingOneCol, board, player);
      }
    }else{
      let kingTwoRow = this.state.playerTwoKing[0];
      let kingTwoCol = this.state.playerTwoKing[1];
      // THE KING IS BEING MOVED
      if(this.state.selectedX === kingTwoRow && this.state.selectedY === kingTwoCol){
        check = board[x][y].piece.check(x, y, board, player);
      }else{
        check = board[kingTwoRow][kingTwoCol].piece.check(kingTwoRow, kingTwoCol, board, player);
      }
    }
    return check !== '' ? true : false;
  }
  render() {
    return (
      <div className={styles.game}>
        <div className={styles.title}>
          <h1>Chess</h1>
        </div>
        <div className={styles.playerone}>
          <PlayerCard player={'ONE'} 
          score={this.state.playerOneScore- this.state.playerTwoScore}
          captures={this.state.playerOneCaptures}
          />
        </div>
        <div className={styles.board}>
          <Board 
            board={this.state.board}
            onSelect={this.onSelect}
          />
        </div>
        <div className={styles.playertwo}>
          <PlayerCard player={'TWO'} 
          score={this.state.playerTwoScore - this.state.playerOneScore}
          captures={this.state.playerTwoCaptures}
          />
        </div>
        <div className={styles.footer}>
          <h2>
            {`Player ${this.state.player}'s turn `}
            {this.state.inCheck && "-You're in check! "}
            {this.state.selfCheck && `-Can't do that..`}
          </h2>
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
        selected: false
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
