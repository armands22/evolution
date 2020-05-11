import React from 'react';
import Spinner from './Spinner';
import LeftSideBar from './LeftSideBar';
import Close from './Close';
import GameNav from './GameNav';
import Table from './Table';
import { connectFn, gameInstructionsFn } from './actions/game';
import { connect } from 'react-redux';

class App extends React.PureComponent {

  state = {
    timeout: 250,
    existingGameId: null,
    count: 0,
    xMin: 1,
    yMin: 1,
    xMax: 50,
    yMax: 25
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
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
      const timeout = (connectingTime > 200) ? 0 : (200 - connectingTime);
      setTimeout(() => this.props.makeConnection('CONNECTION_SUCCESSFUL'), timeout)
      this.setState({ socket: socket });

      self.timeout = 250;
      clearTimeout(connectInterval);

      this.openSession()
    };

    socket.onmessage = event => {
      let { xMin, yMin, xMax, yMax, count } = this.state
      let y = Math.floor((Math.random() * yMax) + yMin);
      let x = Math.floor((Math.random() * xMax) + xMin);
      switch (true) {
        case event.data.startsWith('map'):
          this.props.gameInstructions("RELOAD_MAP_SUCCESSFUL", { data: event.data, gameId: this.state.existingGameId, websocket: socket})
          break;
        case event.data.startsWith('new'):
          socket.send(`open ${y} ${x}`)
          break;
        case event.data.startsWith('open: You win'):
          alert(event.data.substr(5))
          break;
        case event.data.startsWith('open: You lose'):
          window.location.reload();
          break;
        case event.data.startsWith('open'):
          this.setState({
            count: count + 1
          });
          if (count < 4) {
            this.sendCoords(socket, x, y)
          } else if (count === 4) {
            this.changeZones(50, 25, 100, 50)
            this.sendCoords(socket, x, y)
          } else if (count < 8) {
            this.sendCoords(socket, x, y)
          } else if (count === 8) {
            this.changeZones(1, 25, 50, 50)
            this.sendCoords(socket, x, y)
          } else if (count < 12) {
            this.sendCoords(socket, x, y)
          } else if (count === 12) {
            this.changeZones(50, 1, 100, 25)
            this.sendCoords(socket, x, y)
          } else if (count < 16) {
            this.sendCoords(socket, x, y)
          }
          break;
        default:
          this.props.gameInstructions("GET_HELP_SUCCESSFUL", event.data, socket)
      }

      socket.onclose = e => {
        const { connectionClosed } = this.props.game
        if (!connectionClosed) {
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
  }

  changeZones = (xMin, yMin, xMax, yMax) => {
    this.setState({
      xMin: xMin,
      yMin: yMin,
      xMax: xMax,
      yMax: yMax,
    });
  }

  sendCoords = (socket, x, y) => {
    setTimeout(() => {
      socket.send(`open ${y} ${x}`)
      socket.send(`map`)
    }, 200)
  }

  openSession = () => {
    const gameIds = [1, 2, 3, 4]
    const { id } = this.props.match.params
    if (gameIds.includes(Number(id))) {
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
  }

  buildLayout = (props) => {
    const { id } = props
    const { connecting, connectionSuccessful, connectionClosed, tables, toggled } = this.props.game
    const { existingGameId, socket } = this.state
    const table = `session${existingGameId}`
    if (connecting) {
      return <Spinner size="lg" />
    } else if (connectionSuccessful) {
      return <>
        <div className="col-1">
          <LeftSideBar gameId={id} websocket={this.state.socket} />
        </div>
        <div className="col-11 d-flex flex-column">
          <GameNav />
          <Table table={tables[table]} socket={socket} toggled={toggled}/>
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
    game: store.game,
    table: store.game.tables.session1,
    toggled: store.game.toggled
  }
})

const mapDispatchToProps = dispatch => {
  return {
    makeConnection: (typeName) => dispatch(connectFn(typeName)),
    gameInstructions: (actionType, data) => dispatch(gameInstructionsFn(actionType, data))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
