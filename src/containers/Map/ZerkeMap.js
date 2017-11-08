import React, { Component } from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

class ZerkeMap extends Component { 

  render(){

    const markers = this.props.markers.map((venue, i) => {
      const marker = {
        position: {
          lat:30.2672,
          //venue.location.lat,
          lng:-97.7431,
          //venue.location.lng,
        }
      }
      return <Marker key={i} {...marker}/>
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

