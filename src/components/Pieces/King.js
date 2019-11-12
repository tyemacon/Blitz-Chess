import Piece from './Piece';
import images from './piece-images';

export default class King extends Piece {
  constructor(player, x, y){
    super(player, 0, (player === 'ONE' ? images.king.white : images.king.black))
    this.x = x;
    this.y = y;
    this.availableSpaces = this.availableSpaces.bind(this);
    this.queenDirs = [[1,0], [-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    this.rookDirs = [[1,0], [-1,0],[0,1],[0,-1]];
    this.bishopDirs = [[1,1],[1,-1],[-1,1],[-1,-1]];
    this.pawnDirs = {
      'ONE': [[1,-1],[1,1]],
      'TWO': [[-1,-1],[-1,1]]
    };
    this.knightDirs = [
      [-2,1], // up2 -> right1
      [-2,-1], // up2 -> left1
      [2, 1], // down2 -> right1
      [2,-1], // down2 -> left1
      [-1,-2], // left2 -> up1
      [1,-2], // left2 -> down1
      [-1,2], // right2 -> up1
      [1,2], // right2 -> down1
    ]
  }

  check(x, y, board, player){
    // CHECK ENEMY PAWNS
    let checks = 0;
    this.pawnDirs[player].forEach((dir) => {
      if(this.isValidTile(x+dir[0], y+dir[1])){
        if(board[x+dir[0]][y+dir[1]].piece){
          if(board[x+dir[0]][y+dir[1]].piece.player !== player && board[x+dir[0]][y+dir[1]].piece.value === 1){
            checks = 1;
          }
        }
      }
    })
    // CHECK ENEMY BISHOPS
    this.bishopDirs.forEach((dir) => {
      let row = x + dir[0];
      let col = y + dir[1];
      while(this.isValidTile(row, col)){
        if(board[row][col].piece){
          if(board[row][col].piece.player !== player && board[row][col].piece.value === 3){
            checks = 1;
          }
          break;
        }
        row += dir[0];
        col += dir[1];
      }
    })
    // CHECK ENEMY KNIGHTS
    this.knightDirs.forEach((dir) => {
      if(this.isValidTile(x + dir[0], y + dir[1])){
        if(board[x+dir[0]][y+dir[1]].piece){
          if(board[x+dir[0]][y+dir[1]].piece.player !== player && board[x+dir[0]][y+dir[1]].piece.value === 3.5){
            checks = 1;
          }
        }
      }
    })
    // CHECK ENEMY ROOKS
    this.rookDirs.forEach((dir) => {
      let row = x + dir[0];
      let col = y + dir[1];
      while(this.isValidTile(row, col)){ 
        if(board[row][col].piece){
          if(board[row][col].piece.player !== player && board[row][col].piece.value === 5){
            checks = 1;
          }
          break;
        }
        row += dir[0];
        col += dir[1];
      }
    })
    // CHECK ENEMY QUEENS
    this.queenDirs.forEach((dir) => {
      let row = x + dir[0];
      let col = y + dir[1];
      while(this.isValidTile(row, col)){
        if(board[row][col].piece){
          if(board[row][col].piece.player !== player && board[row][col].piece.value === 9){
            checks = 1;
          }
          break;
        }
        row += dir[0];
        col += dir[1];
      }
    })
    // CHECK ENEMY KING
    this.queenDirs.forEach((dir) => {
      if(this.isValidTile(x + dir[0], y + dir[1])){
        if(board[x+dir[0]][y+dir[1]].piece){
          if(board[x+dir[0]][y+dir[1]].piece.player !== player && board[x+dir[0]][y+dir[1]].piece.value === 0){
            checks = 1;
          }
        }
      }
    })
    return checks !== 0 ? player : '';
  }

  availableSpaces(x, y, board, player){
    let availableSpaces = [];
    this.queenDirs.forEach((coord) => {
      if(this.isValidTile(x + coord[0], y + coord[1])){
        if(!board[x + coord[0]][y + coord[1]].piece){
          availableSpaces.push([x + coord[0],y + coord[1]])
        }else{
          if(board[x + coord[0]][y + coord[1]].piece.player !== player){
            availableSpaces.push([x + coord[0],y + coord[1]])
          }
        }
      }
    })
    return availableSpaces;
  }
}