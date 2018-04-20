import React, { Component } from 'react'
import Row from './Row'
import './GameBoard.css';


class GameBoard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cells: Array(8).fill().map(x => Array(8).fill("+")),
            isBlackTurn: true,
            isMounted: false,
            outOfMoves: null,
        }
    }

    componentDidMount = () => {
        this._ismounted = true;
        this.setState({
            ...this.state,
            isMounted: true,
        })
        this.initGame()
    }

    initGame = () => {
        let clone = Array(8).fill().map(x => Array(8).fill("+"))
        clone[3][3] = 'white'
        clone[3][4] = 'black'
        clone[4][3] = 'black'
        clone[4][4] = 'white'
        this.setState({
            ...this.state,
            cells: clone,
            isBlackTurn: true,
            aiMakingMove: false,
            someoneWon: null,
        })
    }

    getAvailableMoves = () => {
        let clone = this.state.cells.map(function (arr) {
            return arr.slice();
        });
        const positions = []
        let position = -1
        clone.map((row, y) => {
            row.map((square, x) => {
                position += 1;
                if (this.getFlippedBoard(position) !== null) {
                    positions.push([x, y])
                }
                return null
            })
            return null
        })
        return positions
    }

    getFlippedBoard = (position) => {
        let test = this.state.cells
        let clone = []
        for (let i = 0; i<this.state.cells.length; i++) {
            let row = test[i].slice()
            clone.push(row)
        }
        
        let modifiedBoard = null;
        let arr = [1, 7, 8, 9, -1, -7, -8, -9]
        let [startX, startY] = [position % 8, (position - position % 8) / 8];
        if (clone[startY][startX] !== '+') {
            return null
        }

        arr.forEach((int) => {
            let flippedSquares = modifiedBoard ? modifiedBoard.slice() : clone;
            let [lastX, lastY] = [startX, startY];
            let atLeastOneMarkIsFlipped = false;
            for (let y = position + int; y < 64; y = y + int) {
                let [xPos, yPos] = [y % 8, (y - y % 8) / 8];


                if (Math.abs(lastX - xPos) > 1 || Math.abs(lastY - yPos) > 1) {
                    break;
                }

                if (typeof this.state.cells[yPos] === 'undefined') {
                    break;
                }
                if (typeof this.state.cells[yPos][xPos] === 'undefined') {
                    break;
                }

                if (flippedSquares[yPos][xPos] === (!this.state.isBlackTurn ? 'black' : 'white')) {
                    flippedSquares[yPos][xPos] = this.state.isBlackTurn ? 'black' : 'white'
                    atLeastOneMarkIsFlipped = true;
                    [lastX, lastY] = [xPos, yPos];
                    continue;
                }
                else if ((flippedSquares[yPos][xPos] === (this.state.isBlackTurn ? 'black' : 'white')) && atLeastOneMarkIsFlipped) {
                    let [positionX, positionY] = [position % 8, (position - position % 8) / 8];
                    flippedSquares[positionY][positionX] = this.state.isBlackTurn ? 'black' : 'white'
                    modifiedBoard = flippedSquares.slice();
                }
                break;
            }

        })
        return modifiedBoard
    }

    getChangedSquares = (position) => {
        let theRealDealArray = []
        let arr = [1, 7, 8, 9, -1, -7, -8, -9]

        let [startX, startY] = [position % 8, (position - position % 8) / 8];

        arr.map((int) => {
            let newPos = position + int

            let [lastXPos, lastYPos] = [startX, startY];
            let [newXPos, newYPos] = [newPos % 8, (newPos - newPos % 8) / 8];

            if (Math.abs(lastXPos - newXPos) > 1 || Math.abs(lastYPos - newYPos) > 1) {
                return null
            }
            
            // cell doesnt exist 
            if (typeof this.state.cells[newYPos] === 'undefined') {
                return null
            }
            if (typeof this.state.cells[newYPos][newXPos] === 'undefined') {
                return null
            }

            let square = this.state.cells[newYPos][newXPos]

            let color = this.state.isBlackTurn ? 'white' : 'black'

            if (square === color) {
                lastXPos = newXPos
                lastYPos = newYPos

                // the first square in the iteration
                let firstCellIteration = newPos

                // lets continue in this direction
                let possibleCoinFlips = []
                let fuckingDope = false;
                for (let i = 0; i<64; i++) {
                    newPos = newPos + int

                    if (newPos >= 64 || newPos < 0) {
                        break;
                    }

                    let [newNewXPos, newNewYPos] = [newPos % 8, (newPos - newPos % 8) / 8];

                    if (Math.abs(lastXPos - newNewXPos) > 1 || Math.abs(lastYPos - newNewYPos) > 1) {
                        break;
                    }

                    let newSquare
                    if (typeof this.state.cells[newNewYPos] === 'undefined') {
                        newSquare = 'undefined'
                    } else {
                        newSquare = this.state.cells[newNewYPos][newNewXPos]
                    }

                    let myColor = this.state.isBlackTurn ? 'black' : 'white'
                    
                    if (newSquare === '+') {
                        possibleCoinFlips = []
                        lastXPos = newNewXPos
                        lastYPos = newNewYPos
                        break;
                    }

                    if (newSquare === color) {
                        // oooh we found another possible coin that could possibly be overtaken muahahahha
                        possibleCoinFlips.push(newPos)
                    }

                    if (i === 0) {
                        lastXPos = newNewXPos
                        lastYPos = newNewYPos
                        possibleCoinFlips.push(firstCellIteration)
                    }
                    if (newSquare === myColor) {
                        fuckingDope = true;
                        lastXPos = newNewXPos
                        lastYPos = newNewYPos
                        break;
                    }
                    lastXPos = newNewXPos
                    lastYPos = newNewYPos

                }
                if (possibleCoinFlips.length !== 0 && fuckingDope === true) {
                    theRealDealArray.push(possibleCoinFlips)
                    return possibleCoinFlips
                }
            }
            lastXPos = newXPos
            lastYPos = newYPos
            return null
        })
        let bigArray = []
        for (let i = 0; i<theRealDealArray.length; i++) {
            let miniArray = theRealDealArray[i]
            miniArray.map(a => bigArray.push(a))
        }
        return bigArray
    }

    handleClick = (x, y) => {
        if (this.state.aiMakingMove === true) {
            return null
        }
        let clone = this.state.cells.map(function (arr) {
            return arr.slice();
        });
        let color = this.state.isBlackTurn ? 'black' : 'white'

        let position = ((x * 8) - 1) + (y + 1)
        let changedSquares = this.getChangedSquares(position)
        for (let i = 0; i<changedSquares.length; i++) {
            let string = changedSquares[i]
            if (typeof string !== 'undefined') {
                string = parseInt(string, 10)
                let [flipXPos, flipYPos] = [string % 8, (string - string % 8) / 8];
                clone[flipYPos][flipXPos] = color
            }
        }

        clone[x][y] = color

        let aiMakingMove = false
        if (this.state.isBlackTurn === true) {
            aiMakingMove = true
        }

        this.setState({
            cells: clone,
            isBlackTurn: !this.state.isBlackTurn,
            outOfMoves: null,
            aiMakingMove,
        }, () => {
            if (this.state.isBlackTurn === false) {
                this.doAiMove()
            }
        })

    }

    outOfMoves = () => {
        // count cells
        let black = 0
        let white = 0
        for (let row of this.state.cells) {
            for (let cell of row) {
                if (cell === 'black') {
                    black += 1

                }
                if (cell === 'white') {
                    white += 1
                } 
            }
        }
        if (black + white < 64) {
            if (black === 0 || white === 0) {
                if (black > white) {
                    return this.endGame('black won')
                } else {
                    return this.endGame('white won')
                }
            } else {
                let aiMakingMove = false
                if (this.state.aiMakingMove === true) {
                    aiMakingMove = false
                }
                this.setState({
                    ...this.state,
                    outOfMoves: this.state.isBlackTurn ? 'black' : 'white',
                    isBlackTurn: !this.state.isBlackTurn,
                    aiMakingMove,
                })
                return null
            }
        } else {
            if (black === white) {
                return this.endGame('draw')
            } else if (black > white) {
                return this.endGame('black won')
            } else {
                return this.endGame('white won')
            }
        }
    }

    endGame = string => {
        this.setState({
            ...this.state,
            someoneWon: string,
            outOfMoves: null,
        })
        setTimeout(function () { //Start the timer
            this.initGame()
        }.bind(this), 3000)
    }

    doAiMove() {
        let moves = this.getAvailableMoves()
        if (moves.length === 0) {
            return this.outOfMoves()
        }
        let moveOptions = []
        moves.forEach(move => {
            let position = ((move[1] * 8) - 1) + (move[0] + 1)
            let changedSquares = this.getChangedSquares(position)
            moveOptions.push({position, number: changedSquares.length})
        })
        if (moves.length > 0) {
            setTimeout(function () { //Start the timer
                moves = moveOptions.sort((a, b) => { return b.number - a.number });
                let movePosition = moves[0].position
                let [x, y] = [movePosition % 8, (movePosition - movePosition % 8) / 8];

                this.setState({
                    ...this.state,
                    aiMakingMove: false,
                    outOfMoves: null,
                }, () => {
                    this.handleClick(y, x)
                })
            }.bind(this), 1000)
        } else {
            this.setState({
                ...this.state,
                aiMakingMove: false,
                outOfMoves: null,
            }, () => {
                this.outOfMoves()
            })
        }
    }

    returnRows = (availableMoves) => {
        if (availableMoves && availableMoves.length === 0) {
            this.outOfMoves()
        }
        return this.state.cells.map((cells, i) => (
            <Row aiMakingMove={this.state.aiMakingMove} outOfMoves={() => this.outOfMoves()} availableMoves={availableMoves} isBlackTurn={this.state.isBlackTurn} handleClick={(x, y) => this.handleClick(x, y)} key={i} x={i} allCells={this.state.cells} cells={cells}/>
        ))
    }

    render() {
        let availableMoves = null
        if (this._ismounted === true) {
            availableMoves = this.getAvailableMoves()
        }
        return (
            <div className="Game-board">
            {this.state.someoneWon 

                ?
                    <table>
                        {this.state.someoneWon

                            ?
                            <h1>{this.state.someoneWon}</h1>
                            :
                            this.returnRows(availableMoves)
                        }
                    </table>
                : 
                    <div>
                        <h1>{this.state.isBlackTurn ? "Blacks turn" : "Whites turn"}</h1>
                        {this.state.outOfMoves !== null ? <p style={{textAlign: 'center'}}>{this.state.outOfMoves} ran out of moves!</p> : null}
                        <table>
                        {this.state.someoneWon

                            ?
                            <h1>{this.state.someoneWon}</h1>
                            :
                                <tbody>{this.returnRows(availableMoves)}</tbody>
                        }
                        </table>
                    </div>
            }
            </div>
        )
    }


}

export default GameBoard