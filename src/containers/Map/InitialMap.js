// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import {
// 	withGoogleMap,
// 	GoogleMap,
// 	InfoWindow,
// 	Marker,
// 	withScriptsjs,
// } from "react-google-maps";

// const InitialMap = withScriptsjs(withGoogleMap((props) => {
// 	return (
// 		<GoogleMap
// 			ref={props.onMapLoad}
// 			defaultZoom={14}
// 			defaultCenter={{lat:40.6944, lng: -73.9213}}
// 			onClick={props.onMapClick}
// 			defaultOptions={{ styles: fancyStyles }}
// 		>
// 			{props.markers.map((marker, index) => (
// 					<Marker
// 						key={index}
// 						position={marker.position}
// 						onClick={()=> props.onMarkerClick(marker)}
// 						>
// 						{marker.showInfow && (
// 							<InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
// 							{
// 								<div id="infowindow"><img src = {marker.imageUrl}/><p id="description"/></div>
// 							}
// 							</InfoWindow>
// 						)}
// 					</Marker>
// 			))}
// 		</GoogleMap>
// 	))

// 	const fancyStyles = [
// 	{"featureType":"water","stylers":[{"color":"#19a0d8"}]},

// 	]

// }

// InitialMap.propTypes = {
//   history: PropTypes.object,
//   intl: intlShape,
//   setDialogIsOpen: PropTypes.func,
//   dialogs: PropTypes.object,
//   match: PropTypes.object,
//   submit: PropTypes.func,
//   muiTheme: PropTypes.object,
//   isGranted: PropTypes.func,
//   locations_online: PropTypes.array,
// };


// const mapStateToProps = (state, ownProps) => {
//   const { intl, dialogs, auth,  lists } = state;
//   const { match } = ownProps;

//   const uid=match.params.uid;



//   return {
//     intl,
//     dialogs,
//     uid,
//     auth,
//     locations_online: lists.locations_online,
//     isGranted: grant=>isGranted(state, grant)
//   };
// };

// export default connect(
//   mapStateToProps, {change, submit,}
// )(injectIntl(withRouter(withFirebase(muiThemeable()(InitialMap)))));