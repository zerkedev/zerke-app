import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import { Activity } from '../../containers/Activity';
import { ZerkeMap } from '../../containers/Map';
import {List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {withRouter} from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import { withFirebase } from 'firekit';
import isGranted  from '../../utils/auth';
import isOnline  from '../../utils/online';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import {FlatButton} from 'material-ui/FlatButton';
import Scrollbar from '../../components/Scrollbar/Scrollbar';
import MapMarkers from '../../components/Map/MapMarkers';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import LocationsMap from '../../utils/resources/locationsmap.png'
import NewChurch from '../../utils/resources/POL_Warsawa_Wawrzyszew_new_church.JPG'

const path='/locations';



class Locations extends Component {

  componentDidMount() {
    const { watchList, firebaseApp}=this.props;

    let ref=firebaseApp.database().ref('locations').limitToFirst(20);
    let coordsRef=firebaseApp.database().ref('location_coords')
    watchList(ref);
    watchList(coordsRef);
  }

  handleTabActive = (value) => {
    const { history, uid } = this.props;

    history.push(`${path}/`);

  }

  

  renderList(locations) {
    const {history} =this.props;

    if(locations===undefined){
      return <div></div>
    }

    return _.map(locations, (location, index) => {

      return <div key={index}>
        <ListItem
          leftAvatar={
            <Avatar
              src={location.val.photoURL}
              alt="bussines"
              icon={
                <FontIcon className="material-icons">
                  location_city
                </FontIcon>
              }
            />
          }
          key={index}
          primaryText={location.val.name}
          secondaryText={location.val.full_name}
          
          id={index}
          onClick={()=>{history.push(`/locations/${location.key}`)}}

          rightIconButton={

            <FontIcon 
            onClick={()=>{history.push(`/locations/edit/${location.key}`)}}
            className="material-icons">
              edit
            </FontIcon>
          }
        />
        <Divider inset={true}/>
      </div>
    });
  }



  render(i, keys){
    const { intl, locations, locationId,  location_coords, match, firebaseApp, muiTheme, history, isGranted,   } =this.props;

    let locationSource=[];

    if(locations){
      locationSource=locations.map(location=>{
        return {id: location.key, name: location.val.displayName}
      })
    };    
  

    let markers =[
              {
                 pos: {
                   lat: 30.335455 ,
                   lng: -97.741373,
                 },
                 
              },
              {
                pos: {
                  lat: 30.224934 ,
                  lng: -97.853066,
                 },
                 
              },
  
    ]


    return (
      <Activity
        isLoading={locations===undefined}
        containerStyle={{overflow:'hidden'}}
        title={intl.formatMessage({id: 'locations'})}>
        <Scrollbar>
          <Tabs
           // value={value}
            onChange={this.handleTabActive}>


            <Tab
             value={'map'}
              icon={<FontIcon className="material-icons">map</FontIcon>}>
              {
                <div>
                  <ZerkeMap 
                    containerElement={ <div style={{ height: `400px` }} />}
                    mapElement={ <div style={{ height: `100%` }} />}
                    googleMapURL={ `https://maps.googleapis.com/maps/api/js?key=AIzaSyAmpuktmkkpHuuXC57ZB9iZ01lgPB8Nd8c&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={ <div style={{ height: `100%` }} />}
                    markers={markers}
                  >
                  
                  </ZerkeMap>
                </div>         
              }

            </Tab>
            <Tab
              value={'locations'}
              icon={<FontIcon className="material-icons">location_city</FontIcon>}>
                {locationSource.map((val, i) => {

                  return (
                     <Card
                      style={{width:'398'}}>
                      <div key={val.id} value={val.id?val.id:i} label={val.name} 
                           onClick={()=>{history.push(`/locations/${locations[i].key}`)}}>
                        <CardHeader
                          title="Curator Name"
                          subtitle="Curator"
                          icon={<FontIcon className="material-icons">account_box</FontIcon>}
                        />
                        <CardMedia
                          overlay={
                            <CardTitle 
                            title={locations[i]?locations[i].val.name:undefined} 
                            subtitle="2 miles away"
                             />}
                        >
                          <img src={locations[i]?locations[i].val.photoURL:undefined} alt="" />
                        </CardMedia>
                        <CardText>
                         {<br/>}
                         {locations[i]?locations[i].val.description:undefined}
                        </CardText>
                      </div>
                     </Card> 
                   )
                  })}

            </Tab>
            <Tab
             value={'list'}
              icon={<FontIcon className="material-icons">list</FontIcon>}>
              {
                  isGranted('create_location') &&
                  <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                    {this.renderList(locations)}
                  </List>
              }

            </Tab>
     
          </Tabs>
        </Scrollbar>

          <div style={{position: 'fixed', right: 18, zIndex:3, bottom: 18, }}>
          {
              isGranted('create_location') &&
              <FloatingActionButton secondary={true} onClick={()=>{history.push(`/locations/create`)}} style={{zIndex:3}}>
                <FontIcon className="material-icons" >add</FontIcon>
              </FloatingActionButton>
          }
          </div>
    </Activity>
  );

}

}

Locations.propTypes = {
  locations: PropTypes.array.isRequired,
  history: PropTypes.object,
  isGranted: PropTypes.func.isRequired,
  isOnline: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
  location_coords: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const { auth, browser, lists } = state;
  const { match } = ownProps;

  const uid=match.params.uid;
  //const type = match.params.type?match.params.type:'data';


  return {
    locations: lists.locations,
    location_coords: lists.location_coords,
    auth,
    browser,
   // type,
    isGranted: grant=>isGranted(state, grant),
    isOnline: online=>isOnline(state, online)
  };
};


export default connect(
  mapStateToProps,
)(injectIntl(muiThemeable()(withRouter(withFirebase(Locations)))));
