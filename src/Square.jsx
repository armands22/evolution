import React from 'react';
import styles from './Square.module.scss';
import classnames from 'classnames';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBahai } from '@fortawesome/free-solid-svg-icons'

class Square extends React.PureComponent {

  state = {
    mine: false
  }

  rightClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState(prevState => ({
      mine: !prevState.mine
    }))
  }

  openCordinates = (e) => {
    const { socket, coordX, coordY, cell } = this.props
    if(cell !== 'M'){
      socket.send(`open ${coordX} ${coordY}`)
      socket.send(`map`)
    }
  }

  showValue = (cell) => {
    const { coordX, coordY } = this.props
    if (cell === '□') {
      return <span className={classnames(styles["small"])}>{coordX}, {coordY}</span>
    } else {
      return cell
    }
  }

  render() {
    const { cell } = this.props;
    const numbers = ['0', '1', '2', '3', '□', 'M', 'F'];
    const { mine } = this.state;
    let className = null;
    if (numbers.includes(cell)) {
      className = `sq${numbers.indexOf(cell)}`
    } else if (cell === '*') {
      className = 'gameover'
    }
    return <div
      className={styles["cell"]}
      onContextMenu={(e) => this.rightClick(e)}
      onClick={(e) => this.openCordinates(e)}
      className={classnames("d-inline-block", styles["cell"], styles[className], { [styles.mine]: mine })}>{mine ? <FontAwesomeIcon icon={faBahai} /> : this.showValue(cell)}</div>
  }
}

export default Square;