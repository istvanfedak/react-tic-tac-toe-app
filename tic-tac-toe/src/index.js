import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight': '');
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winSquares = this.props.winSquares;
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}
        highlight={winSquares && winSquares.includes(i)}
      />
    );
  }

  render() {
    let board = [];
    for(let i = 0; i < 3; i++) {
        let row = [];
        for(let j = 0; j < 3; j++) {
            row.push(this.renderSquare((i * 3) + j));
        }
        board.push(<div className="board-row" key={i}>{row}</div>);
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        rowMove: null,
        colMove: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        rowMove: Math.floor(i / 3),
        colMove: i % 3,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleMovesOrder() {
    const isAscending = !this.state.isAscending;
    this.setState({
        isAscending: isAscending,
    })
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;
    const winSquares = winInfo.winSquares;
    const stepNumber = this.state.stepNumber;
    const movesOrder = this.state.isAscending ? 'ascending': 'descending';

    const moves = history.map((step, move) => {
      const fontWeight = stepNumber === move? 'bold': 'normal';
      const desc = move ?
        'Go to move #' + move + ` (${step.colMove}, ${step.rowMove})`:
        'Go to game start';
      return (
        <li key={9 - move}>
          <button 
            onClick={()=>this.jumpTo(move)}
            style={{fontWeight: fontWeight}}
          >
            {desc}
          </button>
        </li>
      );
    });
    if (this.state.isAscending) moves.reverse();

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X": "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSquares={winSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=> this.handleMovesOrder()}>
            Sorted {movesOrder}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {'winner': squares[a], 'winSquares': lines[i]};
    }
  }
  return {'winner': null, 'WinSquares': null};
}

