import Pawn from '../Pieces/Pawn';
import Rook from '../Pieces/Rook';
import Knight from '../Pieces/Knight';
import Bishop from '../Pieces/Bishop';
import Queen from '../Pieces/Queen';
import King from '../Pieces/King';

export function castle(castles, board, player, x){
  for(let i = 0; i < castles.length; i++){
    // only the x coordinate needs to match
    // x can only be 0 or 7 
    if(x === castles[i][0]){
      if(player === 1){
        if(castles[i][1] === 6){
          // castling right
          let rook = board[0][7].piece;
          board[0][7].piece = null;
          board[0][5].piece = rook;
          board[0][5].piece.moved = true;
        }else{
          // castling left
          let rook = board[0][0].piece;
          board[0][0].piece = null;
          board[0][3].piece = rook;
          board[0][3].piece.moved = true;
        }
      }else{
        if(castles[i][1] === 6){
          // castling right
          let rook = board[7][7].piece;
          board[7][7].piece = null;
          board[7][5].piece = rook;
          board[7][5].piece.moved = true;
        }else{
          // castling left
          let rook = board[7][0].piece;
          board[7][0].piece = null;
          board[7][3].piece = rook;
          board[7][3].piece.moved = true;
        }
      }
    }
  }
  return board;
}


/** Returns an 8x8 chess Board  */
export function initializeBoard(){
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
    board[1][j].piece = new Pawn(1);
    board[6][j].piece = new Pawn(2);
  }
  // Place Rooks
  board[0][0].piece = new Rook(1);
  board[0][7].piece = new Rook(1);
  board[7][0].piece = new Rook(2);
  board[7][7].piece = new Rook(2);
  // Place Knights
  board[0][1].piece = new Knight(1);
  board[0][6].piece = new Knight(1);
  board[7][1].piece = new Knight(2);
  board[7][6].piece = new Knight(2);
  // Place Bishops
  board[0][2].piece = new Bishop(1);
  board[0][5].piece = new Bishop(1);
  board[7][2].piece = new Bishop(2);
  board[7][5].piece = new Bishop(2);
  // Place Queens
  board[0][3].piece = new Queen(1);
  board[7][3].piece = new Queen(2);
  // Place Kings
  board[0][4].piece = new King(1);
  board[7][4].piece = new King(2);

  return board;
}
