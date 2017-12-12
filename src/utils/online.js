
export const online = [
  'is_online',
  'is_offline',
 

]

export default function isOnline(state, online) {

  const { paths, } = state

  const isOnline=paths[`locations/`];

  if(isOnline!==true){
    return false;
  }

  if(isOnline===true){
    return true;
  }


  return false;
}
