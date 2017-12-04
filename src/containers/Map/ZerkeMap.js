import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import isGranted  from '../../utils/auth';
import isOnline  from '../../utils/online';
import {withRouter} from 'react-router-dom';
import { setMarkerIsOpen } from '../../store/markers/actions';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

const path='/locations';


class ZerkeMap extends Component { 




  render(){
    const { history, locations, match } = this.props;
    const uid=match.params.uid;

    console.log('markers', this.props.markers);
    const markers = this.props.markers.map((location, i) => {
      const marker = {
        position: {
          lat: location.pos.lat,
          lng: location.pos.lng,
        },
        id: location.id,
        key: location.key
      }

      return <Marker key={i} id={i}  onClick={()=>{history.push(`/locations/${location.id}`)}} {...marker}>
      >
      <InfoWindow  
          onCloseClick={this.props.setMarkerIsOpen}

          >
          <div>
            {location.name}
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

ZerkeMap.propTypes = {
  locations: PropTypes.array,
  history: PropTypes.object,
  isOnline: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
  location_coords: PropTypes.array,
  setMarkerIsOpen: PropTypes.func.isRequired,

};

const mapStateToProps = (state, ownProps) => {
  const { auth, browser, lists } = state;
  const { match } = ownProps;


  return {
    locations: lists.locations,
    location_coords: lists.location_coords,
    auth,
    browser,
    isGranted: grant=>isGranted(state, grant),
    isOnline: online=>isOnline(state, online)
  };
};




export default connect(mapStateToProps, {setMarkerIsOpen})(injectIntl(muiThemeable()(withRouter(withScriptjs(withGoogleMap(ZerkeMap))))));

