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
import { Card, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Scrollbar from '../../components/Scrollbar/Scrollbar';

const path='/locations';


class Locations extends Component {

  componentDidMount() {
    const { watchList, firebaseApp}=this.props;

    let ref=firebaseApp.database().ref('locations').limitToFirst(20);
    let coordsRef=firebaseApp.database().ref(`locations`);
    watchList(ref);
    watchList(coordsRef);
  }

  handleTabActive = (value) => {
    const { history } = this.props;

    history.push(`${path}/`);

  }

  

  renderList(locations) {
    const {history, muiTheme, paths} =this.props;


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

          rightIcon={<FontIcon style={{marginTop: 22}} className="material-icons" color={paths?muiTheme.palette.primary1Color:muiTheme.palette.disabledColor}>offline_pin</FontIcon>}
          
        />
        <Divider inset={true}/>
      </div>
    });
  }



  render (i, keys) {
    const { intl, locations, firebaseApp, history, isGranted, } =this.props;
    let ref=firebaseApp.database().ref('locations').limitToFirst(20);
    
   let locationSource=[];

    if(locations){
      locationSource=locations
        .filter(location=>{
        return location.val.online
      })
        .map(location=>{
        return {id: location.key, name: location.val.displayName}
      })
    };    

    let markersRef=firebaseApp.database().ref('locations').limitToFirst(20);
    let markers =[];
    if(markers){
   // console.log('locations', locations)
    markers=locations
      .filter(location=>{
      return location.val.online
    })
      .map(location=>{
      return {id: location.key, name: location.val.full_name, pos: location.val.pos, key:location.id}
    })
    }
  
    console.log(ref);
                  
          
   


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
                      style={{width:''}}>
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
  //const { match } = ownProps;



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
