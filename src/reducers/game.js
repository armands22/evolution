import {
  CONNECTION_IN_PROGRESS,
  CONNECTION_SUCCESSFUL,
  CONNECTION_FAILED,
  CONNECTION_CLOSE,
  GET_HELP_IN_PROGRESS,
  GET_HELP_SUCCESSFUL,
  RELOAD_MAP_IN_PROGRESS,
  RELOAD_MAP_SUCCESSFUL,
  // LOAD_GAME_IN_PROGRESS,
  // LOAD_GAME_SUCCESSFUL,
  // LOAD_GAME_FAILED,
} from "./../actions/game"


const initialState = {
  tables: {
    session1: [],
    session2: [],
    session3: [],
    session4: [],
  },
  help: {
    fetch: null,
    fetchSuccessful: null,
    data: null,
  },
  map: {
    fetch: null,
    fetchSuccessful: null,
  },
  actionName: null,
  connecting: true,
  connectionSuccessful: null,
  connectionClosed: null,
}

export default (state = initialState, action) => {
  switch(action.type){
      case CONNECTION_IN_PROGRESS:
        return { ...state, connecting: true, connectionClosed: null }
      case CONNECTION_SUCCESSFUL:
        return { ...state, connecting: false,  connectionSuccessful: true }
      case CONNECTION_FAILED:
        return { ...state, connecting: false, connectionSuccessful: false}
      case CONNECTION_CLOSE:
        return { ...state, connectionSuccessful: null, connectionClosed: true}
      case GET_HELP_IN_PROGRESS:
        return { ...state, help: { ...state.help, fetch: true}}
      case GET_HELP_SUCCESSFUL:
        return { ...state, help: { ...state.help, fetch: null, fetchSuccessful: true, data: action.data }}
      case RELOAD_MAP_IN_PROGRESS:
        return { ...state, map: { ...state.map, fetch: true}}
      case RELOAD_MAP_SUCCESSFUL:
        return updateMap(state, action.data)
      default:
        return state;
  }
}


export const updateMap = (state, data) => {
  const session = `session${data.gameId}`
  let table = data.data.split("\n")
  table.shift()
  table.pop()
  return { ...state, 
      tables: {
        ...state.tables,
        [session]: table
      },
      map: { ...state.map, fetch: null, fetchSuccessful: true }
  }
}