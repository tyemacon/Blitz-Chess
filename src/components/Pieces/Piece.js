export default class Piece {
  constructor(player, value, url){
    this.player = player;
    this.style = {
      backgroundImage: `url(${url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      zIndex: '5',
      cursor: 'pointer',
    }
    this.selected = false;
    this.value = value;
    this.moved = false;
    this.checked = false;
  }

  isValidTile(x, y){
    return x >=0 && y >= 0 && x < 8 && y < 8;
  }
}