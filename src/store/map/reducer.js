import * as types from './types';
import Immutable from 'seamless-immutable';

const map = (state = Immutable('en') , action) => {

  switch (action.type) {
    case types.UPDATE_MAP:
    return action.map;

    default:
    return state;
  }
}

export default map;
