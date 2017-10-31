import {
	withGoogleMap.
	GoogleMap,
	InfoWindow,
	Marker,
} from "react-google-maps";

const InitialMap = withGoogleMap(props=> {

	return (
		<GoogleMap
		ref={props.onMapLoad}
		defaultZoom={14}
		defaultCenter={{lat:40.6944, lng: -73.9213}}
		>
		<Marker
		key={index}
		position={marker.position}
		onClick={()=> props.onMarkerClick(marker)}
		/>
		
		</GoogleMap>
	)
});

