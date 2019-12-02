import React from 'react';
import styles from './App.module.css';
import PlayerCard from './components/PlayerCard';
import Board from './components/Board/Board';
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
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
      }
    }
    this.updateName = this.updateName.bind(this);
    this.saveName = this.saveName.bind(this);
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
            board={this.state.board}
            onSelect={this.onSelect}
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
              {this.state.inCheck && "- You're in check! "}
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

