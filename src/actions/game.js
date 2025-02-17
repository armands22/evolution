export const CONNECTION_IN_PROGRESS = 'CONNECTION_IN_PROGRESS'
export const CONNECTION_SUCCESSFUL = 'CONNECTION_SUCCESSFUL'
export const CONNECTION_FAILED = 'CONNECTION_FAILED'
export const CONNECTION_CLOSE = 'CONNECTION_CLOSE'
export const GET_HELP_IN_PROGRESS = 'GET_HELP_IN_PROGRESS'
export const GET_HELP_SUCCESSFUL = 'GET_HELP_SUCCESSFUL'
export const RELOAD_MAP_IN_PROGRESS = 'RELOAD_MAP_IN_PROGRESS'
export const RELOAD_MAP_SUCCESSFUL = 'RELOAD_MAP_SUCCESSFUL'
export const RELOAD_MAP_SUCCESSFUL2 = 'RELOAD_MAP_SUCCESSFUL2'

export const connectFn = (typeName) => {
  return  {
    type: typeName 
  }
}

export const gameInstructionsFn = (actionType, data) => (dispatch, getState) => { 
  dispatch({
    type: actionType,
    data: data
  });
  if(actionType === 'RELOAD_MAP_SUCCESSFUL')
  dispatch({
    type: 'RELOAD_MAP_SUCCESSFUL2',
    data: data
  });
}