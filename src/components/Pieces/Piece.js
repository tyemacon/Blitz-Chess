export default class Piece {
  constructor(player, url){
    this.player = player;
    this.style = {
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      cursor: 'pointer'
    }
  }
}