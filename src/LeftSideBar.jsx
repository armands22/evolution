import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle, faPowerOff, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { connectFn, gameInstructionsFn } from './actions/game'
import Spinner from './Spinner'
import { connect } from 'react-redux';

class LeftSideBar extends React.PureComponent {
  state = {
    help: null
  }

  send = (what, actionType) => {
    const { websocket } = this.props
    const info = null
    websocket.send(what)
    this.props.gameInstructions(actionType, info)
  }

  close = () => {
    window.location.reload();
  }

  displayHelp = () => {
    const { data } = this.props.help
    const h = data.split('\n')
    h.shift();
    h.pop()
    return h.map((line, idx) => <div key={idx} ><small >{line}</small><br /></div>)
  }

  render() {
    const { gameId, help } = this.props
    return (
      <div className="card" >
        <div className="card-header">
          You are on game number {gameId}
        </div>
        <ul className="list-group list-group-flush">
          <li key="help" className="list-group-item">
            <button
              className="btn btn-outline-info"
              disabled={(help.fetch || help.fetchSuccessful) ? true : false}
              onClick={() => this.send('help', 'GET_HELP_IN_PROGRESS')}>
              {help.fetch && <Spinner size="sm" color="text-info" />}
              {(help.fetch === null || help.fetchSuccessful) && <FontAwesomeIcon className="mr-1" icon={faInfoCircle} />}
              Help
            </button>
            <br />
            <code className="text-info">Press button to get game instructions</code><br />
            {help.data && this.displayHelp()}
          </li>
          <li key="map" className="list-group-item">
            <button
              className="btn btn-outline-info"
              onClick={() => this.send('map', 'RELOAD_MAP_IN_PROGRESS')}>
              {help.fetch && <Spinner size="sm" color="text-info" />}
              {(help.fetch === null || help.fetchSuccessful) && <FontAwesomeIcon className="mr-1" icon={faQuestionCircle} />}
              Map
            </button>
            <br />
            <code className="text-info">Press button to show map</code><br />
          </li>
          <li key="stop" className="list-group-item">
            <button
              className="btn btn-outline-danger"
              onClick={() => this.close()}><FontAwesomeIcon className="mr-1" icon={faPowerOff} />Restart</button>
            <br />
            <code>Press button to restart game</code>
          </li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ((store) => {
  return {
    help: store.game.help,
    map: store.game.map
  }
})

const mapDispatchToProps = dispatch => {
  return {
    makeConnection: (typeName) => dispatch(connectFn(typeName)),
    gameInstructions: (actionType, data) => dispatch(gameInstructionsFn(actionType, data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);
