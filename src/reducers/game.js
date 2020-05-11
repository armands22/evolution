import {
  CONNECTION_IN_PROGRESS,
  CONNECTION_SUCCESSFUL,
  CONNECTION_FAILED,
  CONNECTION_CLOSE,
  GET_HELP_IN_PROGRESS,
  GET_HELP_SUCCESSFUL,
  RELOAD_MAP_IN_PROGRESS,
  RELOAD_MAP_SUCCESSFUL,
  RELOAD_MAP_SUCCESSFUL2
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
  toggled: true,
  counter: 0,
  actionName: null,
  connecting: true,
  connectionSuccessful: null,
  connectionClosed: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTION_IN_PROGRESS:
      return { ...state, connecting: true, connectionClosed: null }
    case CONNECTION_SUCCESSFUL:
      return { ...state, connecting: false, connectionSuccessful: true }
    case CONNECTION_FAILED:
      return { ...state, connecting: false, connectionSuccessful: false }
    case CONNECTION_CLOSE:
      return { ...state, connectionSuccessful: null, connectionClosed: true }
    case GET_HELP_IN_PROGRESS:
      return { ...state, help: { ...state.help, fetch: true } }
    case GET_HELP_SUCCESSFUL:
      return { ...state, help: { ...state.help, fetch: null, fetchSuccessful: true, data: action.data } }
    case RELOAD_MAP_IN_PROGRESS:
      return { ...state, map: { ...state.map, fetch: true } }
    case RELOAD_MAP_SUCCESSFUL:
      return updateMap(state, action.data)
    case RELOAD_MAP_SUCCESSFUL2:
      return updateMap2(state, action.data)
    default:
      return state;
  }
}


export const updateMap = (state, data) => {
  let deck = []
  const session = `session${data.gameId}`
  let table = data.data.split("\n")
  table.shift()
  table.pop()
  table.forEach((line, index) => {
    deck.push(line.split(''))
  })

  for (let i = 0; i < deck.length; i++) {
    for (let j = 0; j < deck[i].length; j++) {
      let minesCounter = 0;
      let minesCoordinates = []
      // right
      if (j < deck[i].length - 1) {
        if (deck[i][j + 1] === 'M') {
          minesCounter++
        }
        if (deck[i][j + 1] === '□') {
          minesCoordinates.push([i, j + 1])
          minesCounter++
        }
      }
      // left
      if (j > 0) {
        if (deck[i][j - 1] === 'M') {
          minesCounter++
        }
        if (deck[i][j - 1] === '□') {
          minesCoordinates.push([i, j - 1])
          minesCounter++
        }
      }
      // above
      if (i > 0) {
        if (deck[i - 1][j] === 'M') {
          minesCounter++
        }
        if (deck[i - 1][j] === '□') {
          minesCoordinates.push([i - 1, j])
          minesCounter++
        }
      }
      // belove
      if (i < deck.length - 1) {
        if (deck[i + 1][j] === 'M') {
          minesCounter++
        }
        if (deck[i + 1][j] === '□') {
          minesCoordinates.push([i + 1, j])
          minesCounter++
        }
      }
      // top - right
      if (i < deck.length - 1 && j < deck[i].length - 1) {
        if (deck[i + 1][j + 1] === 'M') {
          minesCounter++
        }
        if (deck[i + 1][j + 1] === '□') {
          minesCoordinates.push([i + 1, j + 1])
          minesCounter++
        }
      }
      // bottom - right
      if (i > 0 && j < deck[i].length - 1) {
        if (deck[i - 1][j + 1] === 'M') {
          minesCounter++
        }
        if (deck[i - 1][j + 1] === '□' ) {
          minesCoordinates.push([i - 1, j + 1])
          minesCounter++
        }
      }
      // top - left
      if (i < deck.length - 1 && j > 0) {
        if (deck[i + 1][j - 1] === 'M') {
          minesCounter++
        }
        if (deck[i + 1][j - 1] === '□' ) {
          minesCoordinates.push([i + 1, j - 1])
          minesCounter++
        }
      }
      // left - bottom
      if (i > 0 && j > 0) {
        if (deck[i - 1][j - 1] === 'M') {
          minesCounter++
        }
        if (deck[i - 1][j - 1] === '□' ) {
          minesCoordinates.push([i - 1, j - 1])
          minesCounter++
        }
      }

      if (minesCounter === Number(deck[i][j]) && minesCounter > 0) {
        if (minesCoordinates.length) {
          minesCoordinates.forEach(val => {
            deck[val[0]][val[1]] = "M"
          })
        }
      }
    }
  }
  
  return {
    ...state,
    tables: {
      ...state.tables,
      [session]: deck
    },
    map: { ...state.map, fetch: null, fetchSuccessful: true }
  }
}


export const updateMap2 = (state, data) => {
  const session = `session${data.gameId}`
  let deck = state.tables[session]
  for (let i = 0; i < deck.length; i++) {
    for (let j = 0; j < deck[i].length; j++) {
      let freeSquareCoordinates = []
      let freeSquareCounter = 0
      // right
      if (j < deck[i].length - 1) {
        if (deck[i][j + 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i][j + 1] === '□') {
          freeSquareCoordinates.push([i, j + 1])
        }
      }
      // left
      if (j > 0) {
        if (deck[i][j - 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i][j - 1] === '□') {
          freeSquareCoordinates.push([i, j - 1])
        }
      }
      // above
      if (i > 0) {
        if (deck[i - 1][j] === 'M') {
          freeSquareCounter++
        }
        if (deck[i - 1][j] === '□') {
          freeSquareCoordinates.push([i - 1, j])
        }
      }
      // belove
      if (i < deck.length - 1) {
        if (deck[i + 1][j] === 'M') {
          freeSquareCounter++
        }
        if (deck[i + 1][j] === '□') {
          freeSquareCoordinates.push([i + 1, j])
        }
      }
      // top - right
      if (i < deck.length - 1 && j < deck[i].length - 1) {
        if (deck[i + 1][j + 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i + 1][j + 1] === '□') {
          freeSquareCoordinates.push([i + 1, j + 1])
        }
      }
      // bottom - right
      if (i > 0 && j < deck[i].length - 1) {
        if (deck[i - 1][j + 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i - 1][j + 1] === '□' ) {
          freeSquareCoordinates.push([i - 1, j + 1])
        }
      }
      // top - left
      if (i < deck.length - 1 && j > 0) {
        if (deck[i + 1][j - 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i + 1][j - 1] === '□' ) {
          freeSquareCoordinates.push([i + 1, j - 1])
        }
      }
      // left - bottom
      if (i > 0 && j > 0) {
        if (deck[i - 1][j - 1] === 'M') {
          freeSquareCounter++
        }
        if (deck[i - 1][j - 1] === '□' ) {
          freeSquareCoordinates.push([i - 1, j - 1])
        }
      }
      
      if(freeSquareCoordinates.length){
        if(freeSquareCounter === Number(deck[i][j])){
          freeSquareCoordinates.forEach((val) => {
            deck[val[0]][val[1]] = "F"
            data.websocket.send(`open ${val[1]} ${val[0]}`)
          })
        }
      }
    }
  }
  let newToggle = !state.toggled
  return {
    ...state,
    tables: {
      ...state.tables,
      [session]: deck
    },
    toggled: newToggle,
    map: { ...state.map, fetch: null, fetchSuccessful: true }
  }
}