import React from "react";
import { calculateCoordinates, calculateWinner, jumpTo } from "../TicTacToe";
import { mount, shallow } from "enzyme";
import Game from "../TicTacToe";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("calculate coordinates", () => {
  it("should return the correct coordinates according to location", () => {
    // Arrange
    const location = 1;

    // Act
    const coordinates = calculateCoordinates(location);

    // Assert
    expect(coordinates).toEqual("0,1");
  });
});

describe("calculate winner", () => {
  let game = null;
  beforeEach(() => {

    game = mount(<Game />);
  })

  it("should return winning player, ", () => {
    // Arrange
    const inst = game.instance();
    const squares = [null, null, null, "X", "X", "X"];

    // Act
    inst.calculateWinner(squares);

    //Assert
    const winner = inst.state.winStatus;
    const winningPlayer = winner.winner;
    expect(winningPlayer).toBe("X");
  });

  it("should return winning squares", () => {
    // Arrange
    const inst = game.instance();
    const squares = [null, "O", null, "X", "X", null, "O", "O", "O"];

    // Act
    inst.calculateWinner(squares);

    // Assert
    const winner = inst.state.winStatus;
    const winningSquares = winner.winningSquares;
    expect(winningSquares).toEqual([6, 7, 8]);
  });

  it("should be draw when there is no win and no nulls in the square array", () => {
    // Arrange
    const inst = game.instance();
    const squares = ["X", "O", "X", "X", "O", "X", "O", "X", "O"];
    
    //Act
    inst.calculateWinner(squares);

    //Assert
    const winner = inst.state.winStatus;
    expect(winner.isDraw).toBe(true);
  });

  it("should be continue play when there is no win but null values in the array", () => {
    // Arrange
    const inst = game.instance();
    const squares = [null, "O", "X", "O", "X", "O", null, null, "X"];

    // Act
    inst.calculateWinner(squares);

    // Assert
    const winner = inst.state.winStatus;
    expect(winner.continuePlay).toBe(true);
  });
});

describe("Game", () => {
  let game = null;
  
  beforeEach(() => {
    game = mount(<Game />);
  })

  it("renders ", () => {
    expect(game.exists()).toBe(true);
  });

  describe("<Game /> functions", () => {
    it("test the toggle function", () => {
     const inst = game.instance();
     inst.toggle();
     expect(inst.state.isToggled).toBe(true);
    });
  });

  it("test the jumpTo function", () => {
    const inst = game.instance();
    inst.setState({
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          coordinates: null
        },
        {
          squares: ['X', null, null, null, null, null, null, null, null],
          coordinates: "0,0"
        },
        {
          squares: ['X', 'O', null, null, null, null, null, null, null],
          coordinates: "1,1"
        },
      ]
    })
    inst.jumpTo(2);
    expect(inst.state.stepNumber).toBe(2);
  });

  it("handleClick re-renders entire board and updates state for winning move", () => {
    const inst = game.instance();
    inst.setState({
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          coordinates: null
        },
        {
          squares: ['X', null, null, null, null, null, null, null, null],
          coordinates: "0,0"
        },
        {
          squares: ['X', null, null, null, 'O', null, null, null, null],
          coordinates: "1,1"
        },
        {
          squares: ['X', null, null, null, 'O', null, null, null, null],
          coordinates: "0,1"
        },
        {
          squares: ['X', null, null, 'O', 'X', null, null, null, null],
          coordinates: "1,2"
        },
      ],
      stepNumber: 4,
    })

    inst.handleClick(8);
    game.update();

    console.warn(game.debug());

    const newState = inst.state.history;
   // expect(inst.state.isWinner).toBe(true);

   const expectedWinStatus = { isDraw: false, continuePlay: false, isWinner: true};

   expect(game.find("div[id='winner-status']").text()).toBe('Winner: X');
   const squares = game.find("button.square");

   expect(squares.getElements()[0].props.className).toContain("winning-squares");
   expect(squares.getElements()[4].props.className).toContain("winning-squares");
   expect(squares.getElements()[8].props.className).toContain("winning-squares");
   expect(inst.state.winStatus.isWinner).toBe(true);
   expect(inst.state.winStatus.winner).toBe('X');
   expect(inst.state.winStatus.winningSquares).toEqual([0,4,8]);
      
  })
  it("handleClick re-renders entire board and updates state for draw", () => {
    const inst = game.instance();
    inst.setState({
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          coordinates: null
        },
        {
          squares: ['O', null, null, null, null, null, null, null, null],
          coordinates: "0,0"
        },
        {
          squares: ['O', 'X', null, null, null, null, null, null, null],
          coordinates: "0,1"
        },
        {
          squares: ['O', 'X', 'O', null, null, null, null, null, null],
          coordinates: "0,2"
        },
        {
          squares: ['O', 'X', 'O', 'O', null, null, null, null, null],
          coordinates: "1,0"
        },
        {
          squares: ['O', 'X', 'O', 'O', 'X', null, null, null, null],
          coordinates: "1,1"
        },
        {
          squares: ['O', 'X', 'O', 'O', 'X', 'X', null, null, null],
          coordinates: "1,2"
        },
        {
          squares: ['O', 'X', 'O', 'O', 'X', 'X', 'X', null, null],
          coordinates: "2,0"
        },
        {
          squares: ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', null],
          coordinates: "2,1"
        },
      ],
      stepNumber: 8,
    })

    inst.handleClick(8);

    const newState = inst.state.history;
   // expect(inst.state.isWinner).toBe(true);

   expect(game.find("div[id='winner-status']").text()).toBe('Draw');
  //  expect(inst.state.isDraw).toBe(true);
   // expect(inst.state.continuePlay).toBe(false);

   //pull stuff out from the state, make a winStatus object on the state that will have 
   //isWInner, isDraw, continue play to use in the test to only update state in calculateWinner, whivh gets called in handleClick


      
  })

  it("handleClick re-renders entire board and continuePlay state remains true when no win and no draw", () => {
    const inst = game.instance();
    inst.setState({
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          coordinates: null
        },
        {
          squares: ['X', null, null, null, null, null, null, null, null],
          coordinates: "0,0"
        },
      ],
      stepNumber: 1,
    })

    inst.handleClick(8);

    const newState = inst.state.history;
   // expect(inst.state.isWinner).toBe(true);

   expect(game.find("div[id='winner-status']").text()).toBe("Next player: O");
  //  expect(inst.state.isDraw).toBe(true);
   // expect(inst.state.continuePlay).toBe(false);

   //pull stuff out from the state, make a winStatus object on the state that will have 
   //isWInner, isDraw, continue play to use in the test to only update state in calculateWinner, whivh gets called in handleClick


      
  })
});
