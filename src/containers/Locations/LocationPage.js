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
    this.props.watchList('admins');
  }

  handleTabActive = (value) => {
    const { history, uid } = this.props;

    history.push(`${path}`);

  }

  

  // renderRoleItem = (i, k) => {
  //   const { roles, user_roles, match} =this.props;

  //   const uid=match.params.uid;
  //   const key=roles[i].key;
  //   const val=roles[i].val;
  //   let userRoles=[];

  //   if(user_roles!==undefined){
  //     user_roles.map(role=>{
  //       if(role.key===uid){
  //         if(role.val!==undefined){
  //           userRoles=role.val;
  //         }
  //       }
  //       return role;
  //     })
  //   }

  //   return <div key={key}>
  //     <ListItem
  //       leftAvatar={
  //         <Avatar
  //           alt="person"
  //           src={val.photoURL}
  //           icon={<FontIcon className="material-icons" >account_box</FontIcon>}
  //         />
  //       }
  //       rightToggle={
  //         <Toggle
  //           toggled={userRoles[key]===true}
  //           onToggle={(e, isInputChecked)=>{this.hanldeRoleToggleChange(e, isInputChecked, key)}}
  //         />
  //       }
  //       key={key}
  //       id={key}
  //       primaryText={val.name}
  //       secondaryText={val.description}
  //     />
  //     <Divider inset={true}/>
  //   </div>;
  // }

  // renderOnlineItem = (i, k) => {
  //   const { user_grants, match, intl} =this.props;

  //   const uid=match.params.uid;
  //   const key=i;
  //   const val=grants[i];
  //   let userGrants=[];

  //   if(user_grants!==undefined){
  //     user_grants.map(role=>{
  //       if(role.key===uid){
  //         if(role.val!==undefined){
  //           userGrants=role.val;
  //         }
  //       }
  //       return role;
  //     })
  //   }

  //   return <div key={key}>
  //     <ListItem
  //       leftAvatar={
  //         <Avatar
  //           alt="person"
  //           src={undefined}
  //           icon={<FontIcon className="material-icons" >checked</FontIcon>}
  //         />
  //       }
  //       rightToggle={
  //         <Toggle
  //           toggled={userGrants[val]===true}
  //           onToggle={(e, isInputChecked)=>{this.hanldeGrantToggleChange(e, isInputChecked, val)}}
  //         />
  //       }
  //       key={key}
  //       id={key}
  //       primaryText={intl.formatMessage({id: `grant_${val}`})}
  //       //secondaryText={val.description}
  //     />
  //     <Divider inset={true}/>
  //   </div>;
  // }



  render() {

    const {
      history,
      intl,
      submit,
      muiTheme,
      match,
      admins,
      editType,
      setFilterIsOpen,
      hasFilters,
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
      }
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
                 overlay={<CardTitle title="{location_name}" subtitle="locaion_distance" />}
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
                           subtitle="Details"
                         />
                         <CardActions>
                              <FlatButton label="Cowork Here"
                              primary={true}
                              backgroundColor={'black'} />
                             
                         </CardActions>
                         <CardText>
                          This is where details such as ammenities, wifi, parking, facilities, coffee are noted. 
                          
                          This also has information about room rentals.
                         </CardText>
                         
                     
                       </Card>
                    </div>
                    }

              </Tab>

           
              <Tab
                label={'Reviews'}>
                'this.renderListReviews'
              </Tab>
             
              <Tab
                label={'Instructions'}> 
                'this.renderInstructions'             
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


      </Activity>
    );
  }
}


LocationPage.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  submit: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  admins: PropTypes.array.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const { auth, intl, lists, filters } = state;
  const { match } = ownProps;

  const uid=match.params.uid;
  const editType = match.params.editType?match.params.editType:'data';
  const { hasFilters } = filterSelectors.selectFilterProps('user_grants', filters)

  return {
    hasFilters,
    auth,
    uid,
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
  mapStateToProps, { setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(LocationPage)))));
