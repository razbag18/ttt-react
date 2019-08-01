import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: "black",
    color: "#fff"
    };
  return (
    <button
      className="square"
      style={props.winningSquare ? winningSquareStyle: null}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare={winningSquare}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coordinates: null
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      currentCoord: null,
      isToggled: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coord = calcuateCoordinates(i);
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinates: coord
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      currentCoord: coord
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  toggle() {
    this.setState({
      isToggled: !this.state.isToggled
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const isDraw = calculateWinner(current.squares);
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const coordinate = history[move].coordinates;
      const isCurrentlySelected = move === this.state.stepNumber;
      let desc = "";
      desc = move
        ? `Go to move # ${move} at coordinate ${coordinate}`
        : "Go to game start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {isCurrentlySelected ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (isDraw) {
      status = "Draw";
    } else if(winner){
      status = "Winner: " + winner.winner;
    } else{
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} winner={winner && winner.winningSquares}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.isToggled ? moves.reverse() : moves}</ol>
          <button onClick={() => this.toggle()}>Toggle Board</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  if(!squares.includes(null)){
    return{
      isDraw: false
    }
  }

  //if there is an X or an O in the lines but there is still a null value left on the board, isDraw is false, else isDraw is true
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winningSquares: lines[i],
        winner: squares[a]
      } 
    } 
  }
  return null;
}

function calcuateCoordinates(location) {
  const coords = [
    ["0,0"],
    ["0,1"],
    ["0,2"],
    ["1,0"],
    ["1,1"],
    ["1,2"],
    ["2,0"],
    ["2,1"],
    ["2,2"]
  ];
  return coords[location].join();
}
