import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import {withRouter} from 'react-router-dom';
import { withFirebase } from 'firekit';
import { connect } from 'react-redux';


export  const ZerkeMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmpuktmkkpHuuXC57ZB9iZ01lgPB8Nd8c&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 30.2672, lng: -97.7431 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: 30.2672, lng: -97.7431 }} onClick={props.onMarkerClick} />}
  </GoogleMap>
)

export default connect(
  )(injectIntl(muiThemeable()(withRouter(withFirebase(ZerkeMap)))));

