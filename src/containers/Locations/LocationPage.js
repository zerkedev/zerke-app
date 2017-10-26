import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from '../../containers/Activity'
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { FireForm } from 'firekit'
import { setSimpleValue } from '../../store/simpleValues/actions';
import { withRouter } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import { withFirebase } from 'firekit';
import { change, submit } from 'redux-form';
import {Paper} from 'material-ui/Paper';
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {ListItem} from 'material-ui/List';
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
import NewChurch from '../../utils/resources/POL_Warsawa_Wawrzyszew_new_church.JPG'


const path='/locations/${uid}';
const form_name='location';


class LocationPage extends Component {


  componentWillMount() {
    this.props.watchList('locations');
    this.props.watchList('user_roles');
    this.props.watchList('locations_online');
    this.props.watchList('admins');
  }

  handleTabActive = (value) => {
    const { history, uid } = this.props;

    history.push(`${path}`);

  }

  handleClose = () => {
    const { setDialogIsOpen }=this.props;

    setDialogIsOpen('cowork_here', false);

  }
  handleConfirm = () => {

    const {history, match, firebaseApp}=this.props;
    const uid=match.params.uid;

    if(uid){
      firebaseApp.database().ref().child(`${path}${uid}`).then(()=>{
        //this is where confirmation happens. currently it just breaks it. 
        this.handleClose();
        history.goBack();
      })
    }
  }

  // renderItem(i, k)=>{
  //   const { locationSource, muiTheme, setSimpleValue } = this.props;

  //   const key = locationSource[i].key;
  //   const name = locationSource[i].val.name;

  //   return <div key={key}>
  //     <ListItem
  //       rightIconButton={
  //         <IconButton
  //           onClick={() => {
  //             setSimpleValue('chatMessageMenuOpen', false)
  //             this.handleAddMessage("text", message)
  //           }}>
  //           <FontIcon className="material-icons" color={muiTheme.palette.text1Color}>send</FontIcon>
  //         </IconButton>
  //       }
  //       onClick={()=>{
  //         setSimpleValue('chatMessageMenuOpen', false);
  //         this.name.input.value = message;
  //         this.name.state.hasValue = true;
  //         this.name.state.isFocused = true;
  //         this.name.focus();
  //       }}
  //       key={key}
  //       id={key}
  //       primaryText={message}
  //     />
  //     <Divider/>
  //   </div>;
  // }

  ////renderList(users){}
  
  ////renderList(reviews) {}





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
      editType,
      locations,
      setFilterIsOpen,
      hasFilters,
      isGranted
    } = this.props;

    let locationSource=[];

    if(locations){
      locationSource=locations.map(location=>{
        return {id: location.key, name: location.val.displayName, description: location.val.description}
      })
    }

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
        title={intl.formatMessage({id: 'location_name'})}>

        <Scrollbar>
           <Card>
           
               <CardMedia
                 overlay={<CardTitle 
                            title='{locations[i]?locations[i].val.name:undefined}'
                            subtitle="location_distance"
                            />}
               >
                 <img src={NewChurch} alt="" />
               </CardMedia>
              
           
             </Card>     

            <Tabs
              onChange={this.handleTabActive}>


              <Tab
                label={'Details'}>
                    {
                     <div>
                       <Card>
                         <CardHeader
                           title="Location Details"
                           subtitle='{locations[i]?locations[i].val.details:undefined}'
                         />
                         <CardActions>
                              <FlatButton label="Cowork Here"
                              primary={true}
                              backgroundColor={'black'}
                              onClick={()=>{setDialogIsOpen('cowork_here', true)}} />
                             
                         </CardActions>
                         <CardHeader
                           title="Location Instructions"
                           subtitle='{locations[i]?locations[i].val.location_instructions:undefined}'
                         />
                         <CardText>
                          This is where details such as ammenities, wifi, parking, facilities, coffee are noted. 
                          
                          This also has information about nav instructions.
                         </CardText>
                         <CardHeader
                           title="Amenities"
                           subtitle='{locations[i]?locations[i].val.location_amenities:undefined}'
                         />
                         
                     
                       </Card>
                    </div>
                    }

              </Tab>

           
              <Tab
                label={'Reviews'}>
                'this.renderListReviews'
              </Tab>
             
              <Tab
                label={'Rooms'}> 
                {
                 <div>
                   <Card>
                     <CardHeader
                       title="Rooms"
                       subtitle='{locations[i]?locations[i].val.location_instructions:undefined}'
                     />
                   
                         
                       <CardText>
                      
                      This also has information about room rentals.
                     </CardText>
                     
                 
                   </Card>
                </div>
                }           
              </Tab>

               isGranted('edit_location') &&
              <Tab
                label={'Coworkers'}>
                'this.renderListCoworkers'
              
              </Tab>
            </Tabs>
        </Scrollbar>


        <div style={{position: 'fixed', right: 18, zIndex:3, bottom: 18, }}>
        {
            isGranted('edit_location') &&
            <FloatingActionButton secondary={true} onClick={()=>{history.push(`/locations/${uid}/edit`)}} style={{zIndex:3}}>
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
    user_roles: lists.user_roles,
    user_grants: lists.user_grants,
    admins: lists.admins,
    isGranted: grant=>isGranted(state, grant)
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen, setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(LocationPage)))));
