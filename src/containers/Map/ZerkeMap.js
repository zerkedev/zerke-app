import React, { Component } from 'react';
import { setMarkerIsOpen } from '../../store/markers/actions';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

class ZerkeMap extends Component { 

  render(){

    const markers = this.props.markers.map((location_coords, i) => {
      const marker = {
        position: {
          lat: location_coords.pos.lat,
          lng: location_coords.pos.lng,
        }
        
      }
      return <Marker key={i} onClick={this.props.setMarkerIsOpen} {...marker}>
      >
      <InfoWindow onCloseClick={this.props.setMarkerIsOpen}>
          <div>
            {location_coords.pos.lat}
          </div>
        </InfoWindow>
      </Marker>

    })

    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 30.2672, lng: -97.7431 }}>
        {markers}
      </GoogleMap>
    )

  }
}


export default withScriptjs(withGoogleMap(ZerkeMap))

