import React from 'react';
import styles from './App.module.css';
import PlayerCard from './components/PlayerCard';
import Board from './components/Board/Board';
import { cloneDeep } from 'lodash'
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      player: 1,
      oneChange: 'White',
      twoChange: 'Black',
      playerOne: 'White',
      playerTwo: 'Black',
      checked: false,
      checkMate: false,
      playerOneScore: 0,
      playerTwoScore: 0,
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
      resetTrigger: false
    }
    this.saveName = this.saveName.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.updateName = this.updateName.bind(this);
    this.setCheckMate = this.setCheckMate.bind(this);
    this.togglePlayer = this.togglePlayer.bind(this);
    this.capturePiece = this.capturePiece.bind(this);
  }
  saveName(player){
    if(player === this.state.playerOne){
      this.setState({
        playerOne: this.state.oneChange,
        oneChange: ''
      })
    }else{
      this.setState({
        playerTwo: this.state.twoChange,
        twoChange: ''
      })
    }
  }
  updateName(e, player){
    if(player === this.state.playerOne){
      this.setState({
        oneChange: e.target.value
      })
    }else{
      this.setState({
        twoChange: e.target.value
      })
    }
  } 
  // Notify players of gameover
  setCheckMate(checkMate){
    this.setState({
      checkMate: checkMate
    })
  }
  // Change current player and set check (if checked)
  togglePlayer(checked, callback){
    this.setState({
      player: this.state.player === 1 ? 2 : 1,
      checked: checked
    }, callback)
  }
  // Add captured piece to array to display and update score
  capturePiece(x, y, board) {
    if(this.state.player === 1){
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
  resetGame(){
    this.setState({
      resetTrigger: true
    }, () => {
      this.setState({
        player: 1,
        oneChange: 'White',
        twoChange: 'Black',
        playerOne: 'White',
        playerTwo: 'Black',
        checked: false,
        checkMate: false,
        playerOneScore: 0,
        playerTwoScore: 0,
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
        resetTrigger: false
      })
    })
  }
  render() {
    return (
      <div className={styles.game}>
        <div className={styles.input} style={{gridArea: 'inputone'}}>
          Player One: Enter your name<br></br>
          <form onSubmit={(e) => {
              e.preventDefault();
              this.saveName(this.state.playerOne)}}>
            <input type="text" placeholder={this.state.playerOne}
              onChange={(e) => {this.updateName(e, this.state.playerOne)}}>
            </input>
          </form>
        </div>

        <div className={styles.title}>
          <h1>Chess</h1>
          <button onClick={this.resetGame}>Reset Game</button>
        </div>

        <div className={styles.input} style={{gridArea: 'inputtwo'}}>
          Player Two: Enter your name<br></br>
          <form onSubmit={(e) => {
              e.preventDefault();
              this.saveName(this.state.playerTwo)}}>
            <input type="text" placeholder={this.state.playerTwo}
              onChange={(e) => {this.updateName(e, this.state.playerTwo)}}>
            </input>
          </form>
        </div>
        
        <div className={styles.player} style={{gridArea: 'playerone'}}>
          <PlayerCard player={this.state.playerOne} 
          score={this.state.playerOneScore- this.state.playerTwoScore}
          captures={this.state.playerOneCaptures}
          updateName={this.updateName} saveName={this.saveName}
          />
        </div>
        <div className={styles.board}>
          <Board 
            player={this.state.player}
            setCheckMate={this.setCheckMate}
            togglePlayer={this.togglePlayer}
            capturePiece={this.capturePiece}
            resetTrigger={this.state.resetTrigger}
          />
        </div>
        <div className={styles.player} style={{gridArea: 'playertwo'}}>
          <PlayerCard player={this.state.playerTwo} 
          score={this.state.playerTwoScore - this.state.playerOneScore}
          captures={this.state.playerTwoCaptures}
          updateName={this.updateName} saveName={this.saveName}
          />
        </div>
        <div className={styles.footer}>
          {!this.state.checkMate ?
            <h2>
              {`${this.state.player === 1 ? this.state.playerOne : this.state.playerTwo}'s turn `}
              {this.state.checked && "- You're in check! "}
            </h2> 
            :
            <h2>
              Check Mate!
              {` ${this.state.player === 2 ? this.state.playerOne : this.state.playerTwo} Wins!`}
            </h2>
          }
        </div>
      </div>
    )
  }
}

