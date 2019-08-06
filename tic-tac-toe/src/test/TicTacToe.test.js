import React from "react";
import { calculateCoordinates, calculateWinner, jumpTo } from "../TicTacToe";
import { mount, shallow } from 'enzyme';
import Game from '../TicTacToe';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("calculate coordinates", () => {
  it("should return the correct coordinates according to location", () => {
    const location = 1;
    const coordinates = calculateCoordinates(location);
    expect(coordinates).toEqual("0,1");
  });
});

describe("calculate winner", () => {
  it("should return winning player", () => {
    const squares = [null, null, null, "X", "X", "X"];
    const winner = calculateWinner(squares);
    const winningPlayer = winner.winner;
    expect(winningPlayer).toBe("X");
  });

  it("should return winning squares", () => {
    const squares = [null, "O", null, "X", "X", null, "O", "O", "O"];
    const winner = calculateWinner(squares);
    const winningSquares = winner.winningSquares;
    expect(winningSquares).toEqual([6, 7, 8]);
  });

  it("should be draw when there is no win and no nulls in the square array", () => {
    const squares = ["O", "X", "O"];
    const winner = calculateWinner(squares);
    expect(winner.isDraw).toBe(true);
  });

  it("should be no draw when there is no win but null values in the array", () => {
    // const board = mount(<Game />)
    // console.warn(board.debug());
    const squares = [null, "O", "X", "O", "X", "O" ];
    const winner = calculateWinner(squares);
    expect(winner.continuePlay).toBe(true);
  });
});

describe("game functions", () => {
  let wrapper = mount(<Game />);

  it("renders ", () => {
     wrapper = shallow(<Game/>);
    expect(wrapper.exists()).toBe(true);

  })

})

//tomorrow - what do I want to test, check how they test in //bulk settings, index.spec
