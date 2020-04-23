import React from 'react';
import Spinner from './Spinner'
import LeftSideBar from './LeftSideBar'
import Close from './Close'
import GameNav from './GameNav'
import Table from './Table'
import { connectFn, gameInstructionsFn } from './actions/game'
import { connect } from 'react-redux';

class App extends React.PureComponent {

  state = {
    timeout: 250,
    existingGameId: null
  }

  componentDidUpdate(prevProps) {
    if(prevProps.match.params.id !== this.props.match.params.id){
      this.openSession()
    }
  }

  componentDidMount() {
    this.connect()
  }

  connect = () => {
    this.props.makeConnection('CONNECTION_IN_PROGRESS')
    let socket = new WebSocket('wss://hometask.eg1236.com/game1/')
    let self = this;
    const connectingStart = new Date().getTime();
    var connectInterval;

    socket.onopen = () => {
      const connectingTime = connectingStart - new Date().getTime()
      const timeout = (connectingTime > 1200) ? 0 : (1200 - connectingTime);
      setTimeout(() => this.props.makeConnection('CONNECTION_SUCCESSFUL'), timeout)
      this.setState({ socket: socket });

      self.timeout = 250;
      clearTimeout(connectInterval);

      this.openSession()
    };

    socket.onmessage = event => {
      console.log(event.data)
      switch(true){
        case event.data.startsWith('map'):
          this.props.gameInstructions("RELOAD_MAP_SUCCESSFUL", { data: event.data, gameId: this.state.existingGameId })
          break;
        case event.data.startsWith('new'):
          break;
        case event.data.startsWith('open: You win'):
          alert(event.data.substr(5))
          break;
        case event.data.startsWith('open'):
          break;
        default:
          this.props.gameInstructions("GET_HELP_SUCCESSFUL", event.data)
      }
    }

    socket.onclose = e => {
      const { connectionClosed } = this.props.game
      if(!connectionClosed){
        self.timeout = self.timeout + self.timeout;
        connectInterval = setTimeout(this.checkConnection, Math.min(10000, self.timeout));

      }
    };

    socket.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      socket.close();
    };
  }

  openSession = () => {
    const gameIds = [1,2,3,4]
    const { id } = this.props.match.params
    if(gameIds.includes(Number(id))){
      this.state.socket.send(`new ${id}`)
      this.state.socket.send('map')
      this.setState({
        existingGameId: id 
      })
    }
  }

  checkConnection = () => {
    const { socket } = this.state;
    if (!socket || socket.readyState === WebSocket.CLOSED) this.connect();
  };

  buildLayout = (props) => {
    const { id } = props
    const { connecting, connectionSuccessful, connectionClosed, tables } = this.props.game
    const { existingGameId, socket } = this.state
    const table = `session${existingGameId}`
    if (connecting) {
      return <Spinner size="lg" />
    } else if (connectionSuccessful) {
      return <>
        <div className="col-3">
          <LeftSideBar gameId={id} websocket={this.state.socket} />
        </div>
        <div className="col-9 d-flex flex-column">
          <GameNav />
          <Table table={tables[table]} socket={socket}/>
        </div>
      </>
    } else if (connectionClosed) {
      return <Close />
    }
  }

  render() {
    return (
      <div className="bg-dark">
        <div className="container-fluid p-3 min-vh-100 d-flex">
          {this.buildLayout(this.props.match.params)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ((store) => {
  return {
    game: store.game
  }
})

const mapDispatchToProps = dispatch => {
  return {
    makeConnection: (typeName) => dispatch(connectFn(typeName)),
    gameInstructions: (actionType, data) => dispatch(gameInstructionsFn(actionType, data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
