import React from 'react';
import styles from './Board.module.css';
import Square from './Square';
import { cloneDeep } from 'lodash'
import { initializeBoard } from './boardHelpers';

// remove this later
import Queen from '../Pieces/Queen';

export default class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      board: initializeBoard(),
      oneChange: 'White',
      twoChange: 'Black',
      playerOne: 'White',
      playerTwo: 'Black',
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
    }else if(this.state.board[x][y].piece.player === this.props.player){
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
    const availableSpaces = selectedPiece.availableSpaces(x, y, this.state.board, this.props.player, this.state.history);
    let path = [];
    let passants = [];
    let castles = [];
    availableSpaces.forEach((coord) => {
        let pathClone = cloneDeep(this.state.board);
        pathClone[x][y].piece = null;
        pathClone[coord[0]][coord[1]].piece = selectedPiece;
        let check = false;
        if(this.props.player === 1){
          // Is the King selected?
          if(selectedPiece.value === 0){
            check = this.checkChecks(coord[0], coord[1], pathClone, 1);
          }else{
            check = this.checkChecks(this.state.playerOneKing[0], this.state.playerOneKing[1], pathClone, 1);
          }
        }else{
          // Is the King selected?
          if(selectedPiece.value === 0){
            check = this.checkChecks(coord[0], coord[1], pathClone, 2);
          }else{
            check = this.checkChecks(this.state.playerTwoKing[0], this.state.playerTwoKing[1], pathClone, 2);
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
    if((x === 0 || x === 7) && selectedPiece.value === 1){
      selectedPiece = new Queen(this.props.player);
    }
    boardClone[this.state.selectedX][this.state.selectedY].piece = null;
    boardClone[x][y].piece = selectedPiece;
    boardClone[x][y].piece.moved = true;
    // ^^ Castling ROOKS have not been moved yet with this ^^
    if(this.state.board[x][y].piece){
      this.capturePiece(x, y, this.state.board);
    }else if(this.state.passants.length){
      for(let i = 0; i < this.state.passants.length; i++){
        if(y === this.state.passants[i][1]){
          if(this.props.player === 1){
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
          if(this.props.player === 1){
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
    if(this.props.player === 1 && (pOneKing[0] === this.state.selectedX && pOneKing[1] === this.state.selectedY)){
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
      if(this.props.player === 1){
        kingX = this.state.playerTwoKing[0];
        kingY = this.state.playerTwoKing[1];
        player = 2
      }else{
        kingX = this.state.playerOneKing[0];
        kingY = this.state.playerOneKing[1];
        player = 1
      }
      checked = this.checkChecks(kingX, kingY, this.state.board, player)
      let checkMate = false;
      this.setState({
        checkMate: checkMate,
        inCheck: checked,
        player: this.props.player === 1 ? 2 : 1
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
    if(this.props.player === 1){
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
          if(square.piece.player === this.props.player){
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
      player: 1,
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

  render(){
    return (
      <div className={styles.board}>
      {this.state.board.map((row, i) => {
        return row.map((square, j) => 
          <Square key={`${i}${j}`} 
          x={square.position[0]} 
          y={square.position[1]} 
          piece={square.piece}
          selected={square.selected}
          onSelect={this.onSelect}
          />
        )
      })}
    </div>
  )
}
}

