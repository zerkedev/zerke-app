
export const online = [
  'is_online',
  'is_offline',
 

]

export default function isOnline(state, online) {

  const { auth, lists, paths, match } = state

  const isOnline=paths[`locations_online/`];

  if(isOnline!==true){
    return false;
  }

  if(isOnline===true){
    return true;
  }


  return false;
}
