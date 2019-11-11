export default class Piece {
  constructor(player, url){
    this.player = player;
    this.style = {
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      cursor: 'pointer',
    }
    this.selected = false;
  }

  isValidTile(x, y){
    return x >=0 && y >= 0 && x < 8 && y < 8;
  }
}