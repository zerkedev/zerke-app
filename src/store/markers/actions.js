import * as types from './types';

export function setMarkerIsOpen(id, isOpen){
  return {
    type: types.ON_MARKER_OPEN_CHANGED,
    id,
    isOpen
  };
}
