import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { injectIntl } from 'react-intl';
import { Activity } from '../../containers/Activity';
import {List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {withRouter} from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import { withFirebase } from 'firekit';
import isGranted  from '../../utils/auth';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import {FlatButton} from 'material-ui/FlatButton';
import Scrollbar from '../../components/Scrollbar/Scrollbar';
import LocationsMap from '../../utils/resources/locationsmap.png'
import NewChurch from '../../utils/resources/POL_Warsawa_Wawrzyszew_new_church.JPG'

const path='/locations';



class Locations extends Component {

  componentDidMount() {
    const { watchList, firebaseApp}=this.props;

    let ref=firebaseApp.database().ref('locations').limitToFirst(20);

    watchList(ref);
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


  render(){
    const { intl, locations, muiTheme, history, isGranted, } =this.props;

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
                  <Card>
                  
                      <CardMedia
                        overlay={<CardTitle title="Austin" subtitle="zerke space in Austin" />}
                      >
                        <img src={LocationsMap} alt="" />
                      </CardMedia>
                     
                 
                    </Card>      
                </div>         
              }

            </Tab>
            <Tab
              value={'locations'}
              icon={<FontIcon className="material-icons">location_city</FontIcon>}>
              {
                  <div>
                    <Card>
                      <CardHeader
                        title="Curator Name"
                        subtitle="Curator"
                        icon={<FontIcon className="material-icons">account_box</FontIcon>}
                      />
                      <CardMedia
                        overlay={<CardTitle title="St Johns" subtitle="Episcopal Church" />}
                      >
                        <img src={NewChurch} alt="" />
                      </CardMedia>
                      <CardText>
                       {2} miles away.
                      </CardText>
                      <CardActions>

                      </CardActions>
                  
                    </Card>
                 </div>
              }

            </Tab>
            <Tab
             value={'list'}
              icon={<FontIcon className="material-icons">list</FontIcon>}>
              {
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
  match: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { auth, browser, lists } = state;
  const { match } = ownProps;

  const uid=match.params.uid;
  //const type = match.params.type?match.params.type:'data';


  return {
    locations: lists.locations,
    auth,
    browser,
   // type,
    isGranted: grant=>isGranted(state, grant)
  };
};


export default connect(
  mapStateToProps,
)(injectIntl(muiThemeable()(withRouter(withFirebase(Locations)))));
