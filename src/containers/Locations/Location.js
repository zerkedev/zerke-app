import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Activity } from '../../containers/Activity';
import { ResponsiveMenu } from 'material-ui-responsive-menu';
import { FireForm } from 'firekit';
import { setDialogIsOpen } from '../../store/dialogs/actions';
import LocationForm from '../../components/Forms/LocationForm';
import { setSimpleValue } from '../../store/simpleValues/actions';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { withFirebase } from 'firekit';
import { change, submit } from 'redux-form';
import isGranted  from '../../utils/auth';
import isOnline  from '../../utils/online';


const path='/locations/';
const form_name='location';


class Location extends Component {

  componentWillMount() {
    this.props.watchList('locations');
    this.props.watchList('locations_online');
  }




  validate = (values) => {
    const { intl } = this.props;
    const errors = {}

    errors.name = !values.name?intl.formatMessage({id: 'error_required_field'}):'';
    errors.full_name = !values.full_name?intl.formatMessage({id: 'error_required_field'}):'';
    errors.vat = !values.vat?intl.formatMessage({id: 'error_required_field'}):'';

    return errors
  }

  handleUpdateValues = (values) => {

    return {
      updated: firebase.database.ServerValue.TIMESTAMP ,
      ...values
    }
  }


  // handleOnlineToggleChange = (e, isInputChecked, key) => {
  //   const { firebaseApp, match } = this.props;
  //   const uid=match.params.uid;

  //   if(isInputChecked){
  //     firebaseApp.database().ref(`/locations_online/${uid}/${key}`).set(true);
  //   }else{
  //     firebaseApp.database().ref(`/locations_online/${uid}/${key}`).remove();
  //   }

  // }



  handleOnlineChange = (e, isInputChecked) => {
    const { firebaseApp, match } = this.props;
    const uid=match.params.uid;

    if(isInputChecked){
      firebaseApp.database().ref(`/locations_online/${uid}`).set(true);
    }else{
      firebaseApp.database().ref(`/locations_online/${uid}`).remove();
    }

  }


  

  handleClose = () => {
    const { setDialogIsOpen }=this.props;

    setDialogIsOpen('delete_location', false);

  }

  handleDelete = () => {

    const {history, match, firebaseApp}=this.props;
    const uid=match.params.uid;

    if(uid){
      firebaseApp.database().ref().child(`${path}${uid}`).remove().then(()=>{
        this.handleClose();
        history.goBack();
      })
    }
  }


  render() {

    const {
      history,
      intl,
      setDialogIsOpen,
      dialogs,
      match,
      submit,
      locations_online,
      muiTheme,
      isGranted,
      isOnline,
    }=this.props;

    const uid=match.params.uid;
   


    const actions = [
      <FlatButton
        label={intl.formatMessage({id: 'cancel'})}
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage({id: 'delete'})}
        secondary={true}
        onClick={this.handleDelete}
      />,
    ];

    const menuList=[
      {
        hidden: (uid===undefined && !isGranted(`create_${form_name}`)) || (uid!==undefined && !isGranted(`edit_${form_name}`)),
        text: intl.formatMessage({id: 'save'}),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
        tooltip:intl.formatMessage({id: 'save'}),
        onClick: ()=>{submit('location')}
      },
      {
        hidden: uid===undefined || !isGranted(`delete_${form_name}`),
        text: intl.formatMessage({id: 'delete'}),
        icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>delete</FontIcon>,
        tooltip: intl.formatMessage({id: 'delete'}),
        onClick: ()=>{setDialogIsOpen('delete_location', true);}
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
        title={intl.formatMessage({id: match.params.uid?'edit_location':'create_location'})}>

        <div style={{margin: 15, display: 'flex'}}>

          <FireForm
            name={'location'}
            path={`${path}`}
            validate={this.validate}
            onSubmitSuccess={(values)=>{history.push('/locations');}}
            onDelete={(values)=>{history.push('/locations');}}
            uid={match.params.uid}>
            <LocationForm
              handleOnlineChange={this.handleOnlineChange}
              isOnline={isOnline}
              {...this.props} 
             />
          </FireForm>
        </div>
        <Dialog
          title={intl.formatMessage({id: 'delete_location_title'})}
          actions={actions}
          modal={false}
          open={dialogs.delete_location===true}
          onRequestClose={this.handleClose}>
          {intl.formatMessage({id: 'delete_location_message'})}
        </Dialog>

      </Activity>
    );
  }
}

Location.propTypes = {
  history: PropTypes.object,
  intl: intlShape.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  muiTheme: PropTypes.object.isRequired,
  isGranted: PropTypes.func.isRequired,
  isOnline: PropTypes.func.isRequired,
  locations_online: PropTypes.array.isRequired,
};


const mapStateToProps = (state, ownProps) => {
  const { intl, dialogs, auth,  lists } = state;
  const { match } = ownProps;

  const uid=match.params.uid;



  return {
    intl,
    dialogs,
    uid,
    auth,
    locations_online: lists.locations_online,
    isGranted: grant=>isGranted(state, grant),
    isOnline: online=>isOnline(state, online)
  };
};

export default connect(
  mapStateToProps, {setDialogIsOpen, change, submit, setSimpleValue,}
)(injectIntl(withRouter(withFirebase(muiThemeable()(Location)))));
