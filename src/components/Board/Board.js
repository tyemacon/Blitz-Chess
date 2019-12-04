import React from 'react';
import styles from './Board.module.css';
import Square from './Square';
import { cloneDeep } from 'lodash'
import { castle, promotePawn, initializeBoard } from './boardHelpers';

export default class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      board: initializeBoard(),
      playerOneKing: [0,4],
      playerTwoKing: [7,4],
      selectedX: null,
      selectedY: null,
      history: [],
      path: [],
      passants: [],
      castles: [],
    }
    this.onSelect = this.onSelect.bind(this);
  }
  // Manage board state based on square selected
  onSelect(x, y){
    // Move piece if in allowed path
    if(this.state.path.includes(`${x}${y}`)){
      this.movePiece(x, y);
    // Clear the paths if the piece was re-selected or an empty square was selected
    }else if((this.state.selectedX === x && this.state.selectedY === y) || !this.state.board[x][y].piece){
      if(!isNaN(this.state.selectedX)){
        this.clearPaths();
      }
    // Generate the paths if player selected own piece
    }else if(this.state.board[x][y].piece.player === this.props.player){
      if(this.state.selectedX !== null){
        // Clear the paths and generate another set if different piece was selected
        this.clearPaths(() => this.generatePaths(x, y))
      }else{
        this.generatePaths(x, y)
      }
    }
  }
  // Generate all allowable spaces for piece to move
  generatePaths(x, y, checking){
    // Save selected piece and create a copy of the board to preserve/save history
    // Use selected piece to generate unique path set (up to/including another piece on the board)
    let selectedPiece = this.state.board[x][y].piece;
    const boardClone = cloneDeep(this.state.board);
    const availableSpaces = selectedPiece.availableSpaces(x, y, this.state.board, this.props.player, this.state.history);
    // Initialize empty arrays for paths and possible passants/castles
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
  // Clear the current path, takes callback as paramater if needed
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
    let boardClone = cloneDeep(this.state.board);
    let selectedPiece = boardClone[this.state.selectedX][this.state.selectedY].piece;
    if((x === 0 || x === 7) && selectedPiece.value === 1){
      selectedPiece = promotePawn(this.props.player);
    }
    boardClone[this.state.selectedX][this.state.selectedY].piece = null;
    boardClone[x][y].piece = selectedPiece;
    boardClone[x][y].piece.moved = true;
    // ^^ Castling ROOKS have not been moved yet with this ^^
    if(this.state.board[x][y].piece){
      this.props.capturePiece(x, y, this.state.board);
    }else if(this.state.passants.length){
      for(let i = 0; i < this.state.passants.length; i++){
        if(y === this.state.passants[i][1]){
          if(this.props.player === 1){
            this.props.capturePiece(this.state.passants[i][0] - 1, this.state.passants[i][1], boardClone);
            boardClone[this.state.passants[i][0] - 1][this.state.passants[i][1]].piece = null;
            break;
          }else{
            this.props.capturePiece(this.state.passants[i][0] + 1, this.state.passants[i][1], boardClone);
            boardClone[this.state.passants[i][0] + 1][this.state.passants[i][1]].piece = null;
            break;
          }
        }
      }
    }else if(this.state.castles.length){
      boardClone = castle(this.state.castles, boardClone, this.props.player, x);
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
      /// This is where all the check and checkmate shit happens;
      checked = this.checkChecks(kingX, kingY, this.state.board, player)
      this.props.togglePlayer(checked, () => {
        if(checked){
          this.props.setCheckMate(this.checkMate())
        }
      })
    })
  }
  // Return true if player in check
  checkChecks(kingX, kingY, board, player){
    return board[kingX][kingY].piece.check(kingX, kingY, board, player);
  }
  // Analyze all paths to King to determine checkmate
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
  // Reset the game board if button clicked
  componentDidUpdate(){
    if(this.props.resetTrigger){
      this.resetBoard();
    }
  }
  resetBoard(){
    this.setState({
      board: initializeBoard(),
      playerOneKing: [0,4],
      playerTwoKing: [7,4],
      selectedX: null,
      selectedY: null,
      history: [],
      path: [],
      passants: [],
      castles: [],
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