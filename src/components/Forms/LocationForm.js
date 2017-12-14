import React, {Component} from 'react';
import {connect} from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import {Field, reduxForm, formValueSelector } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import {Avatar} from '../../containers/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { setDialogIsOpen } from '../../store/dialogs/actions';
import { ImageCropDialog } from '../../containers/ImageCropDialog';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';





class LocationForm extends Component {

  componentWillMount() {
    this.props.watchList('locations');
  }

  handlePhotoUploadSuccess = (snapshot) =>{
    const { setDialogIsOpen, change}=this.props;
    change('photoURL', snapshot.downloadURL);
    setDialogIsOpen('new_location_photo', undefined);
  }


  handleOnlineChange = (e, isInputChecked) => {
    const { firebaseApp, match } = this.props;
    const uid=match.params.uid;
    console.log('Toggled', uid)
    if(isInputChecked){
      firebaseApp.database().ref(`/locations/${uid}/online`).set(true);
    }else{
      firebaseApp.database().ref(`/locations/${uid}/online`).remove();
    }

  }

  render() {
    const{
      handleSubmit,
      intl,
      initialized,
      setDialogIsOpen,
      handleOnlineChange,
      online,
      dialogs,
      match,
      watchList,
      firebaseApp,
    } = this.props;

    const uid=match.params.uid
    let locationRef=firebaseApp.database().ref(`locations/${uid}`);
    watchList(locationRef);
   

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
      <button type="submit" style={{display: 'none'}} />

      <div style={{margin: 15, display: 'flex', flexDirection: 'column'}}>

        <div>
          <Field
            name="photoURL"
            size={120}
            component={Avatar}
            icon={
              <FontIcon
                className="material-icons">
                business
              </FontIcon>
            }
            ref="photoURL"
            withRef
          />
        </div>


        <FlatButton
          onClick={()=>{
            setDialogIsOpen('new_location_photo', true)
          }}
          disabled={uid===undefined || !initialized}
          containerElement='label'
          primary={true}
          icon={
            <FontIcon
              className="material-icons">
              photo_camera
            </FontIcon>
          }
        />
      </div>

      <div>
        <div>
          <Field
            name="name"
            disabled={!initialized}
            component={TextField}
            hintText={intl.formatMessage({id: 'name_hint'})}
            floatingLabelText={intl.formatMessage({id: 'name_label'})}
            ref="name"
            withRef
          />
        </div>

        <div>
          <Field
            name="address"
            disabled={!initialized}
            component={TextField}
            multiLine={true}
            rows={2}
            hintText={intl.formatMessage({id: 'address_hint'})}
            floatingLabelText={intl.formatMessage({id: 'address_label'})}
            ref="address"
            withRef
          />
        </div>

        <div>
          <Field
            name="vat"
            disabled={!initialized}
            component={TextField}
            hintText={intl.formatMessage({id: 'vat_hint'})}
            floatingLabelText={intl.formatMessage({id: 'vat_label'})}
            ref="vat"
            withRef
          />
        </div>


        <div>
          <Field
            name="description"
            disabled={!initialized}
            component={TextField}
            multiLine={true}
            rows={2}
            hintText={intl.formatMessage({id: 'description_hint'})}
            floatingLabelText={intl.formatMessage({id: 'description_label'})}
            ref="description"
            withRef
          />
        </div>
        <div>
          <Field
            name="location_instructions"
            disabled={!initialized}
            component={TextField}
            multiLine={true}
            rows={2}
            hintText={intl.formatMessage({id: 'instructions_hint'})}
            floatingLabelText={intl.formatMessage({id: 'instructions_label'})}
            ref="location_instructions"
            withRef
          />
        </div>
        <div>
          <Field
            name="location_amenities"
            disabled={!initialized}
            component={TextField}
            multiLine={true}
            rows={2}
            hintText={intl.formatMessage({id: 'amenities_hint'})}
            floatingLabelText={intl.formatMessage({id: 'amenities_label'})}
            ref="amenities_instructions"
            withRef
          />
        </div>

        <ImageCropDialog
          path={`locations/${uid}`}
          fileName={`photoURL`}
          onUploadSuccess={(s)=>{this.handlePhotoUploadSuccess(s) }}
          open={dialogs.new_location_photo!==undefined}
          src={dialogs.new_location_photo}
          handleClose={()=>{setDialogIsOpen('new_location_photo',undefined)}}
          title={intl.formatMessage({id: 'change_photo'})}
        />
      </div>
      <br/>

      <div style={{marginLeft: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
        
        <Toggle
         path={`locations/${uid}/online`}
         label={intl.formatMessage({id: 'is_online_label'})}
         name="online"
         //toggled={locationRef.online}
         ref="online"
         withRef
         onToggle={(e, isInputChecked)=>{this.handleOnlineChange(e, isInputChecked)}}
        />
      </div>

      

    </form>
  );
}
}

LocationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  online: PropTypes.bool,
  handleOnlineChange: PropTypes.func,
  setDialogIsOpen: PropTypes.func.isRequired,
  isOnline: PropTypes.bool.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};


LocationForm=reduxForm({form: 'location'})(LocationForm);
const selector = formValueSelector('location')

const mapStateToProps = state => {
  const { intl, vehicleTypes, users, dialogs } = state;

  return {
    intl,
    vehicleTypes,
    users,
    dialogs,
    photoURL: selector(state, 'photoURL')
  };
};

export default connect(
  mapStateToProps, { setDialogIsOpen }
)(injectIntl(withRouter(muiThemeable()(LocationForm))));
