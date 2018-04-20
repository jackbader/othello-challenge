import React from 'react';

class Square extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: false,
            calledHoverLeaveBackup: false,
        }
    }

    handleHover = (moves) => {
        if (moves.length === 0) {
            this.setState({
                ...this.state,
                hover: false,
            })
            return null
        }
        moves.forEach(arr => {
            if (arr[1] === this.props.x && arr[0] === this.props.y) {
                this.setState({
                    hover: true,
                })
            }
        })
    }

    handleHoverLeave = (string) => {
        if (string === 'string') {
            this.setState({
                hover: false,
                calledHoverLeaveBackup: true,
            })
        }
        this.setState({
            hover: false,
        })
    }

    handleClick = (moves) => {
        moves.forEach(arr => {
            if (arr[1] === this.props.x && arr[0] === this.props.y) {
                this.props.handleClick(this.props.x, this.props.y)
            }
        })
    }

    render() {
        if (this.props.availableMoves && this.props.availableMoves.length === 1 && this.props.aiMakingMove === false && this.state.calledHoverLeaveBackup === false) {
            this.handleHoverLeave('string')
        }
        return (
            <td 
            onClick={() => this.handleClick(this.props.availableMoves)}
            onMouseEnter={() => this.handleHover(this.props.availableMoves)}
            onMouseLeave={() => this.handleHoverLeave()}
            style={{width: '50px', height: '50px', backgroundColor: 'green'}}>
                {this.props.type === '+' 
                    ?
                        this.state.hover === true 
                            ?
                            <div className="hover"></div>
                            :
                            null
                    :
                    <div>
                        {this.props.type === 'black'
                            ?
                            <div className="Green-circle"></div>
                            :
                            <div className="Red-circle"></div>
                        }
                    </div>
                }
            </td>
        )
    }
}

export default Square

