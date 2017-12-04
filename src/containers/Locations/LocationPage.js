import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from '../../containers/Activity';
import { Reviews } from '../../containers/Reviews';
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { FireForm } from 'firekit';
import firebase from 'firebase';
import { setSimpleValue } from '../../store/simpleValues/actions';
import { withRouter } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import { withFirebase } from 'firekit';
import { change, submit } from 'redux-form';
import IconButton from 'material-ui/IconButton';
import ReactList from 'react-list';
import {List, ListItem} from 'material-ui/List';
import {Paper} from 'material-ui/Paper';
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import { setDialogIsOpen } from '../../store/dialogs/actions';
import Toggle from 'material-ui/Toggle';
import { grants } from '../../utils/auth';
import { Tabs, Tab } from 'material-ui/Tabs';
import Scrollbar from '../../components/Scrollbar/Scrollbar';
import { filterSelectors, filterActions } from 'material-ui-filter'
import isGranted  from '../../utils/auth';
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField';
import LocationForm from '../../components/Forms/LocationForm';
import NewChurch from '../../utils/resources/yuriy-kovalev-97508.jpg'


const path=`/locations/`;
const pathUsers='users';
const form_name='location';
const locationPath=`/locations/`;
const timePath=`/locations_online`;
const currentYear=new Date().getFullYear();
const currentDay=new Date().toString();


class LocationPage extends Component {



  componentWillMount() {
    this.props.watchList('locations');
    this.props.watchList('user_roles');
    this.props.watchList('users');
    this.props.watchList('locations_online');
    this.props.watchList('admins');
    this.props.watchList('location_reviews');

  };

  
  componentDidMount() {
    const { watchList, firebaseApp, key, uid}=this.props;

    this.props.watchList(pathUsers);

    let ref=firebaseApp.database().ref(`locations/`);

    watchList(ref);

    let reviewRef=firebaseApp.database().ref(`location_reviews/${uid}/${key}`);
    watchList(reviewRef);

    let coworkersHereRef=firebaseApp.database().ref(`locations/${uid}/coworkersHere/`);
    watchList(coworkersHereRef);
  }

  handleTabActive = (value) => {
    const { history, uid } = this.props;

    history.push(`${uid}`);

  }

  handleClose = () => {
    const { setDialogIsOpen }=this.props;

    setDialogIsOpen('cowork_here', false);

  }



  handleConfirm = () => {

    const {history, auth, match, firebaseApp}=this.props;
    const uid=match.params.uid;
    const userId=auth.uid;


  //  Timer.schedule(TimerTask .handleDestroyValues, Date .now + 12 * 60 * 60 * 1000);



    if(uid){
      firebaseApp.database().ref(`/locations/${uid}/coworkersHere/${userId}`).set(true)
      .then(()=>{
        this.handleUpdateValues();
        this.handleClose();
        history.goBack();
      })
    }

  }


  handleUpdateValues = (values) => {

    return {
      updated: firebase.database.ServerValue.TIMESTAMP ,
      ...values
    }
  }

 

  renderList(locations) {
      const { auth, intl, history, browser, setDialogIsOpen, match} =this.props;
      const uid=match.params.uid

      if(locations===undefined){
        return <div></div>
      }

      return 

      _.filter(locations, (location, index) => {
        return location.val.coworkersHere
      })

      _.map(locations, (location, index) => {


        return <div key={index}>

          <ListItem
            key={index}
            rightIconButton={
              locations.userId.displayName===auth.uid?
              <IconButton
               >
                <FontIcon className="material-icons" color={'red'}>{'delete'}</FontIcon>
              </IconButton>:undefined
            }
            id={index}
          />
            <Divider inset={true}/>
          </div>
        });
      }

  //firebaseApp.database().ref(`/locations/${uid}/coworkersHere/${userId}`)

  renderList(locations) {
    const { auth, intl, history, browser, setDialogIsOpen, match} =this.props;
    const uid=match.params.uid

    if(locations===undefined){
      return <div></div>
    }

    return _.map(locations, (location, index) => {

      

      return <div key={index}>

        <ListItem
          key={index}
          primaryText={locations[uid]?locations[uid].val.name:undefined}
          secondaryText={locations.val.name}
          primary={true}
          id={index}
        />


        <Divider inset={true}/>
      </div>
    });
  }
  
  renderList(reviews) {
    const { auth, intl, history, browser, setDialogIsOpen, match} =this.props;
    const uid=match.params.uid

    if(reviews===undefined){
      return <div></div>
    }

    return _.map(reviews, (review, index) => {


      return <div key={index}>

        <ListItem
          key={index}
          //onClick={review.userId===auth.uid?()=>{history.push(`/review/edit/${key}`)}:undefined}
          primaryText={review.key}
          //secondaryText={`${review.userName} ${review.created?intl.formatRelative(new Date(review.created)):undefined}`}
          //leftAvatar={this.userAvatar(index, review)}
          rightIconButton={
            review.userId===auth.uid?
            <IconButton
             >
              <FontIcon className="material-icons" color={'red'}>{'delete'}</FontIcon>
            </IconButton>:undefined
          }
          id={index}
        />


     
  


        <Divider inset={true}/>
      </div>
    });
  }

  


  render() {

    const {
      history,
      intl,
      submit,
      muiTheme,
      setDialogIsOpen,
      dialogs,
      match,
      admins,
      ref,
      editType,
      reviews,
      reviewRef,
      coworkersHere,
      locationDataRef,
      list,
      users,
      locations,
      location,
      setFilterIsOpen,
      hasFilters,
      firebaseApp,
      locationId,
      isGranted
    } = this.props;



 

    const uid=match.params.uid;
    let isAdmin=false;

    if(admins!==undefined){
      for (let admin of admins) {
        if(admin.key===uid){
          isAdmin=true;
          break;
        }
      }
    }
    let isOnline=false;



    const actions = [
      <FlatButton
        label={intl.formatMessage({id: 'cancel'})}
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage({id: 'confirm'})}
        secondary={true}
        onClick={this.handleConfirm}
      />,
    ];

    const menuList = [
      {
        hidden: (uid===undefined && !isGranted(`administration`)) || editType !== 'profile' ,
        text: intl.formatMessage({id: 'save'}),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip:intl.formatMessage({id: 'save'}),
        onClick: ()=>{submit(form_name)}
      },
      {
        hidden: editType !== 'grants',
        text: intl.formatMessage({id: 'open_filter'}),
        icon: <FontIcon className="material-icons" color={hasFilters?muiTheme.palette.accent1Color:muiTheme.palette.canvasColor}>filter_list</FontIcon>,
        tooltip:intl.formatMessage({id: 'open_filter'}),
        onClick: () => setFilterIsOpen('user_grants', true)
      },

    ]




    return (
      <Activity
        iconStyleRight={{width:'50%'}}
        iconElementRight={
          <div>
            <ResponsiveMenu
              iconMenuColor={muiTheme.palette.canvasColor}
              menuList={menuList}
            />
          </div>
        }

        onBackClick={()=>{history.goBack()}}
        title={intl.formatMessage({id: 'locations'})}>

        <Scrollbar>
           <Card>
                
           
               <CardMedia
                 overlay={<CardTitle 
                            title='zerke space'
                            path={path}
                            ref="name"
                            withRef
                            subtitle="location_distance"
                            />}
               >
                 <img src={NewChurch} alt="" />
               </CardMedia>
              
           
             </Card>     
            <div>
              <br/>
            </div>

            <Tabs
              onChange={this.handleTabActive}>


              <Tab
                label={'Details'}>
                    {
                       <div style={{marginLeft: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                        <div style={{ display: 'center',}}> 
                          <CardActions>
                               <FlatButton label="Cowork Here"
                               primary={true}
                               style={{display: 'center'}}
                               backgroundColor={'black'}
                               onClick={()=>{setDialogIsOpen('cowork_here', true)}} />
                              
                          </CardActions>
                        </div>
                        <div style={{margin: 15, display: 'flex'}}>

                          <FireForm
                            name={'location'}
                            path={`${locationPath}`}
                            isDisabled={true}
                            onSubmitSuccess={(values)=>{history.push('/locations');}}
                            onDelete={(values)=>{history.push('/locations');}}
                            uid={match.params.uid}>
                            <LocationForm
                              handleOnlineChange={this.handleOnlineChange}
                              isOnline={isOnline}
                              isDisabled={true}
                              {...this.props} 
                             />
                          </FireForm>
                        </div>
                    
                    </div>
                    }

              </Tab>

           
              <Tab
                label={'Reviews'}>
                  <div>
                   <List  id='list' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                       {this.renderList(reviews)}
                    </List>
                  </div>
              </Tab>
             
              

              isGranted('edit_location') &&
              <Tab
                label={'Coworkers'}
                value={'list'}>
                <div>
                  <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                      {this.renderList(users)}
                   </List>
                 </div>
                 
              
              </Tab>
            </Tabs>
        </Scrollbar>


        <div style={{position: 'fixed', right: 18, zIndex:3, bottom: 18, }}>
        {
            isGranted('edit_location') &&
            <FloatingActionButton secondary={true} onClick={()=>{history.push(`/locations/edit/${uid}`)}} style={{zIndex:3}}>
              <FontIcon className="material-icons" >edit</FontIcon>
            </FloatingActionButton>
        }
        </div>

        <Dialog
          title={intl.formatMessage({id: 'cowork_here_title'})}
          actions={actions}
          modal={false}
          open={dialogs.cowork_here===true}
          onRequestClose={this.handleClose}>
          {intl.formatMessage({id: 'cowork_here_message'})}
        </Dialog>


      </Activity>
    );
  }
}


LocationPage.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  submit: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
  users: PropTypes.array,
  user: PropTypes.array.isRequired,
  reviews: PropTypes.array.isRequired,
  location_reviews: PropTypes.array,
  coworkersHere: PropTypes.array,
  locations: PropTypes.array.isRequired,

};


const mapStateToProps = (state, ownProps) => {
  const { auth, intl, lists, dialogs, filters } = state;
  const { match } = ownProps;

  const uid=match.params.uid;
  const editType = match.params.editType?match.params.editType:'data';
  const { hasFilters } = filterSelectors.selectFilterProps('user_grants', filters)

  return {
    hasFilters,
    auth,
    uid,
    dialogs,
    editType,
    intl,
    roles: lists.roles,
    locations: lists.locations,
    users: lists.users,
    reviews: lists.location_reviews,
    user_roles: lists.user_roles,
    user_grants: lists.user_grants,
    admins: lists.admins,
    isGranted: grant=>isGranted(state, grant)
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen, setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(LocationPage)))));
