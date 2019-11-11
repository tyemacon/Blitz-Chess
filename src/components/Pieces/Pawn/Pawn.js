import Piece from '../Piece';
import images from '../piece-images';

export default class Pawn extends Piece {
  constructor(player, x, y){
    super(player, (player === 'ONE' ? images.pawn.white : images.pawn.black))
    this.availableSpaces =  this.availableSpaces.bind(this)
  }

  // return an array of available spaces
  availableSpaces(x, y){
    if(this.player === 'ONE'){
      if(x === 1){
        return [[x + 1,y],[x + 2, y]];
      }else{
        return [[x + 1,y]];
      }
    }else{
      if(x === 6){
        return [[x - 1,y],[x - 2, y]];
      }else{
        return [[x - 1,y]];
      }
    }
  }

}