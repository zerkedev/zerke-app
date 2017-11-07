import React from "react";
import { compose, withProps } from "recompose";
import ZerkeMap from '../../containers/Map/ZerkeMap.js';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import {withRouter} from 'react-router-dom';
import { getGeolocation } from '../../utils/googleMaps';
import { withFirebase } from 'firekit';
import { connect } from 'react-redux';

class MapMarkers extends React.PureComponent {
  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }
  handleAddLocation = ( pos) => { 
      
      const {history, auth, match, firebaseApp}=this.props;
      const uid=auth.uid
      const LocationCoords=`pos`
    

      if(uid){
            firebaseApp.database().ref(`/users/${uid}/location`).set(pos)
          }
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
    getGeolocation((pos) => {
        if(!pos) {
          return;
        } else if(!pos.coords) {
          return;
        }

        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        this.handleAddLocation("location", `https://www.google.com/maps/place/${lat}+${long}/@${lat},${long}`);
     },
      (error) => console.log(error))
    }

  render() {
    return (
      <ZerkeMap
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}
 export default connect()(injectIntl(withRouter(withFirebase(muiThemeable()(MapMarkers)))));