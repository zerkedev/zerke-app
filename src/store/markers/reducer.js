import * as types from './types';

export default function markers(state={}, action){

  switch (action.type) {
    case types.ON_MARKER_OPEN_CHANGED:
    return {...state, [action.id]: action.isOpen};
    default:
    return state;
  }

}
