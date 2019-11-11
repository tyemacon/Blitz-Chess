import Piece from '../Piece';
import images from '../piece-images';
// import styles from './Pawn.module.css';


export default class Pawn extends Piece {
  constructor(player){
    super(player, (player === 'ONE' ? images.pawn.white : images.pawn.black))
  }
}