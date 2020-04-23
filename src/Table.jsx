import React from 'react';
import Square from './Square';
import { Scrollbars } from 'react-custom-scrollbars'
import classnames from 'classnames'
import styles from './Table.module.scss'

class Table extends React.PureComponent {

  buildTable = () => {
    const { table, socket } = this.props
    return table.map((tableLine, index) => {
      const cells = tableLine.split('')
      return <div key={index} className="d-block">{cells.map((cell, idx) => {
        return <Square key={idx} socket={socket} cell={cell} coordX={idx} coordY={index} />
      })}</div>
    })
  }

  render() {
    return (<div className={classnames(styles["wrapper"])}>
      <Scrollbars>
        <div className={classnames(styles["nowrap"])}>
          {this.buildTable()}
        </div>
      </Scrollbars>
    </div>
    )
  }
}

export default Table;