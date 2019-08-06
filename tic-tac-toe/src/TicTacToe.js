import React, { Component } from "react";
import "./index.css";

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: "black",
    color: "#fff"
  };
  return (
    <button
      className="square"
      style={props.winningSquare ? winningSquareStyle : null}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    let winningSquare =
      this.props.winner && this.props.winner.includes(i) ? true : false;
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

export default class Game extends React.Component {
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
      isToggled: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coord = calculateCoordinates(i);

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
    if (winner) {
      if (winner.winner) {
        status = "Winner: " + winner.winner;
      } else if (winner.isDraw) {
        status = "Draw";
      }
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={winner && winner.winningSquares}
          />
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

// ReactDOM.render(<Game />, document.getElementById("root"));

export function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winningSquares: lines[i],
        winner: squares[a]
      };
    }
  }
  if (!squares.includes(null)) {
    return {
      isDraw: true
    };
  }
  return {
      continuePlay: true
  };
}

export function calculateCoordinates(location) {
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

