import React from "react";
import { calculateCoordinates, calculateWinner, jumpTo } from "../TicTacToe";
import { mount, shallow } from "enzyme";
import Game from "../TicTacToe";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import { exec } from "child_process";

configure({ adapter: new Adapter() });

describe("calculate coordinates", () => {
  it("should return the correct coordinates according to location", () => {
    const location = 1;
    const coordinates = calculateCoordinates(location);
    expect(coordinates).toEqual("0,1");
  });
});

describe("calculate winner", () => {
  let game = null;
  beforeEach(() => {

    game = mount(<Game />);
  })

  it("should return winning player", () => {
    const inst = game.instance();
    const squares = [null, null, null, "X", "X", "X"];
    const winner = inst.calculateWinner(squares);
    const winningPlayer = winner.winner;
    expect(winningPlayer).toBe("X");
  });

  it("should return winning squares", () => {
    const inst = game.instance();
    const squares = [null, "O", null, "X", "X", null, "O", "O", "O"];
    const winner = inst.calculateWinner(squares);
    const winningSquares = winner.winningSquares;
    expect(winningSquares).toEqual([6, 7, 8]);
  });

  it("should be draw when there is no win and no nulls in the square array", () => {
    const inst = game.instance();
    const squares = ["X", "O", "X", "X", "O", "X", "O", "X", "O"];
    const winner = inst.calculateWinner(squares);
    expect(winner.isDraw).toBe(true);
  });

  it("should be continue play when there is no win but null values in the array", () => {
    const inst = game.instance();
    const squares = [null, "O", "X", "O", "X", "O", null, null, "X"];
    const winner = inst.calculateWinner(squares);
    expect(winner.continuePlay).toBe(true);
  });
});

describe("game functions", () => {
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
          squares: ['X', 'X', null, null, 'O', null, null, null, null],
          coordinates: "0,1"
        },
        {
          squares: ['X', 'X', null, null, 'O', 'O', null, null, null],
          coordinates: "1,2"
        },
      ],
      stepNumber: 4,
    })

    inst.handleClick(2);

    const newState = inst.state.history;
   // expect(inst.state.isWinner).toBe(true);

   expect(game.find("div[id='winner-status']").text()).toBe('Winner: X');
   expect(inst.state.isDraw).toBe(false);
   // expect(inst.state.continuePlay).toBe(false);

   //pull stuff out from the state, make a winStatus object on the state that will have 
   //isWInner, isDraw, continue play to use in the test to only update state in calculateWinner, whivh gets called in handleClick


      
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
   expect(inst.state.isDraw).toBe(true);
   // expect(inst.state.continuePlay).toBe(false);

   //pull stuff out from the state, make a winStatus object on the state that will have 
   //isWInner, isDraw, continue play to use in the test to only update state in calculateWinner, whivh gets called in handleClick


      
  })
});
