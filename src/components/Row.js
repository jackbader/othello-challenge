import React, { Component } from 'react'
import Square from './Square'

class Row extends Component {

    returnSquares = () => {
        return this.props.cells.map((square, i) => (
            <Square allCells={this.props.allCells} aiMakingMove={this.props.aiMakingMove} outOfMoves={() => this.props.outOfMoves()} availableMoves={this.props.availableMoves} isBlackTurn={this.props.isBlackTurn} type={square} handleClick={(x, y) => this.props.handleClick(x, y)} cells={this.props.cells} key={i} y={i} x={this.props.x}/>
        ))
    }

    render() {
        return (

            <tr>
                {this.returnSquares()}
            </tr>
        );
    }
}

export default Row