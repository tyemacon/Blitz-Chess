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
      playerOneCaptures: {
        1: [],
        3: [],
        3.5: [],
        5: [],
        9: []
      },
      playerTwoCaptures: {
        1: [],
        3: [],
        3.5: [],
        5: [],
        9: []
      },
      playerOneKing: [0,4],
      playerTwoKing: [7,4],
      playerOneScore: 0,
      playerTwoScore: 0,
      selectedX: null,
      selectedY: null,
      history: [],
      path: [],
      passants: [],
      castles: [],
      inCheck: false,
      checkMate: false,
    }
    this.onSelect = this.onSelect.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }
  // manage all logic delegated to each piece
  onSelect(x, y){
    console.log(this.state.board);
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
    }
  }
  generatePaths(x, y, checking){
    let selectedPiece = this.state.board[x][y].piece;
    const boardClone = cloneDeep(this.state.board);
    const availableSpaces = selectedPiece.availableSpaces(x, y, this.state.board, this.state.player, this.state.history);
    let path = [];
    let passants = [];
    let castles = [];
    availableSpaces.forEach((coord) => {
        let pathClone = cloneDeep(this.state.board);
        pathClone[x][y].piece = null;
        pathClone[coord[0]][coord[1]].piece = selectedPiece;
        let check = false;
        if(this.state.player === 'ONE'){
          // Is the King selected?
          if(selectedPiece.value === 0){
            check = this.checkChecks(coord[0], coord[1], pathClone, 'ONE');
          }else{
            check = this.checkChecks(this.state.playerOneKing[0], this.state.playerOneKing[1], pathClone, 'ONE');
          }
        }else{
          // Is the King selected?
          if(selectedPiece.value === 0){
            check = this.checkChecks(coord[0], coord[1], pathClone, 'TWO');
          }else{
            check = this.checkChecks(this.state.playerTwoKing[0], this.state.playerTwoKing[1], pathClone, 'TWO');
          }
        }
        if(!check){
          boardClone[coord[0]][coord[1]].selected = true;
          path.push(`${coord[0]}${coord[1]}`);
          if(availableSpaces.passants){
            for(let i = 0; i < availableSpaces.passants.length; i++){
              if(coord[0] === availableSpaces.passants[i][0] && coord[1] === availableSpaces.passants[i][1]){
                passants.push([coord[0], coord[1]])
              } 
            }
          }
          if(availableSpaces.castles){
            for(let i = 0; i < availableSpaces.castles.length; i++){
              if(coord[0] === availableSpaces.castles[i][0] && coord[1] === availableSpaces.castles[i][1]){
                castles.push([coord[0], coord[1]])
              }
            }
          }
        }
    })
    // Don't set the state if this is a checkmate check
    if(checking){ return path }
    this.setState({
      selectedX: x,
      selectedY: y,
      board: boardClone,
      path: path,
      passants: passants,
      castles: castles,
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
    boardClone[x][y].piece.moved = true;
    // ^^ Castling ROOKS have not been moved from this ^^
    if(this.state.board[x][y].piece){
      this.capturePiece(x, y, this.state.board);
    }else if(this.state.passants.length){
      for(let i = 0; i < this.state.passants.length; i++){
        if(y === this.state.passants[i][1]){
          if(this.state.player === 'ONE'){
            this.capturePiece(this.state.passants[i][0] - 1, this.state.passants[i][1], boardClone);
            boardClone[this.state.passants[i][0] - 1][this.state.passants[i][1]].piece = null;
            break;
          }else{
            this.capturePiece(this.state.passants[i][0] + 1, this.state.passants[i][1], boardClone);
            boardClone[this.state.passants[i][0] + 1][this.state.passants[i][1]].piece = null;
            break;
          }
        }
      }
    }else if(this.state.castles.length){
      for(let i = 0; i < this.state.castles.length; i++){
        if(x === this.state.castles[i][0]){
          if(this.state.player === 'ONE'){
            if(this.state.castles[i][1] === 6){
              // castling right
              let rook = boardClone[0][7].piece;
              boardClone[0][7].piece = null;
              boardClone[0][5].piece = rook;
              boardClone[0][5].piece.moved = true;
            }else{
              // castling left
              let rook = boardClone[0][0].piece;
              boardClone[0][0].piece = null;
              boardClone[0][3].piece = rook;
              boardClone[0][3].piece.moved = true;
            }
          }else{
            if(this.state.castles[i][1] === 6){
              // castling right
              let rook = boardClone[7][7].piece;
              boardClone[7][7].piece = null;
              boardClone[7][5].piece = rook;
              boardClone[7][5].piece.moved = true;
            }else{
              // castling left
              let rook = boardClone[7][0].piece;
              boardClone[7][0].piece = null;
              boardClone[7][3].piece = rook;
              boardClone[7][3].piece.moved = true;
            }
          }
        }
      }
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
    let moveFrom = this.state.board;
    let moveTo = boardClone;
    this.setState({
      selectedX: null,
      selectedY: null,
      board: boardClone,
      playerOneKing: pOneKing,
      playerTwoKing: pTwoKing,
      inCheck: false,
      history: [...this.state.history, [moveFrom, moveTo]],
      path: []
    }, () => {
      let kingX, kingY, player, checked;
      if(this.state.player === 'ONE'){
        kingX = this.state.playerTwoKing[0];
        kingY = this.state.playerTwoKing[1];
        player = 'TWO'
      }else{
        kingX = this.state.playerOneKing[0];
        kingY = this.state.playerOneKing[1];
        player = 'ONE'
      }
      checked = this.checkChecks(kingX, kingY, this.state.board, player)
      let checkMate = false;
      this.setState({
        checkMate: checkMate,
        inCheck: checked,
        player: this.state.player === 'ONE' ? 'TWO' : 'ONE'
      }, () => {
        if(this.state.inCheck){
          this.setState({
            checkMate: this.checkMate()
          }) 
        }
      })
    })
  }
  capturePiece(x, y, board) {
    if(this.state.player === 'ONE'){
      let cloneOne = cloneDeep(this.state.playerOneCaptures);
      cloneOne[board[x][y].piece.value].push(board[x][y].piece)
      this.setState({
        playerOneScore: Math.floor(this.state.playerOneScore + board[x][y].piece.value),
        playerOneCaptures: cloneOne
      })
    }else{
      let cloneTwo = cloneDeep(this.state.playerTwoCaptures);
      cloneTwo[board[x][y].piece.value].push(board[x][y].piece)
      this.setState({
        playerTwoScore: Math.floor(this.state.playerTwoScore + board[x][y].piece.value),
        playerTwoCaptures: cloneTwo
      })
    }
  }
  // Return true if player in check
  checkChecks(kingX, kingY, board, player){
    return board[kingX][kingY].piece.check(kingX, kingY, board, player);
  }
  checkMate(){
    let checkMate = true;
    this.state.board.forEach((row) => {
      row.forEach((square) => {
        if(square.piece){
          if(square.piece.player === this.state.player){
            let moves = this.generatePaths(square.position[0], square.position[1], true);
            if(moves.length){
              checkMate = false;
            }
          }
        }
      })
    })
    return checkMate;
  }
  resetGame(){
    this.setState({
      board: initializeBoard(),
      player: 'ONE',
      playerOneCaptures: {
        1: [],
        3: [],
        3.5: [],
        5: [],
        9: []
      },
      playerTwoCaptures: {
        1: [],
        3: [],
        3.5: [],
        5: [],
        9: []
      },
      playerOneKing: [0,4],
      playerTwoKing: [7,4],
      playerOneScore: 0,
      playerTwoScore: 0,
      selectedX: null,
      selectedY: null,
      history: [],
      path: [],
      passants: [],
      castles: [],
      inCheck: false,
      checkMate: false,
    })
  }

  render() {
    return (
      <div className={styles.game}>
        <div className={styles.title}>
          <h1>Chess</h1>
          <button onClick={this.resetGame}>Reset Game</button>
        </div>
        <div className={styles.player} style={{gridArea: 'playerone'}}>
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
        <div className={styles.player} style={{gridArea: 'playertwo'}}>
          <PlayerCard player={'TWO'} 
          score={this.state.playerTwoScore - this.state.playerOneScore}
          captures={this.state.playerTwoCaptures}
          />
        </div>
        <div className={styles.footer}>
          {!this.state.checkMate ?
            <h2>
              {`Player ${this.state.player}'s turn `}
              {this.state.inCheck && "- You're in check! "}
            </h2> 
            :
            <h2>
              Check Mate!
<<<<<<< Updated upstream
              {` Player ${this.state.player === 'ONE' ? 'TWO' : 'ONE'} Wins!`}
=======
              {` ${this.state.player === 'TWO' ? this.state.playerOne : this.state.playerTwo} Wins!`}
>>>>>>> Stashed changes
            </h2>
          }
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
