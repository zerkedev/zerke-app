import React, {Component} from 'react';
import {connect} from 'react-redux';
import { injectIntl } from 'react-intl';
import {Field, reduxForm} from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import {SuperSelectField} from '../../containers/SuperSelectField';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';


class ReviewForm extends Component {
  componentDidMount() {
    this.refs.title // the Field
    .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
    .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
    .focus(); // on TextField
  }

  render() {
    const {handleSubmit, intl, locations, initialized } = this.props;

    let locationSource=[];

    if(locations){
      locationSource=locations.map(location=>{
        return {id: location.key, name: location.val.displayName}
      })
    }

    return (
      <form onSubmit={handleSubmit} style={{height: '100%', alignItems: 'strech'}}>
        <div>
          <Field
            name="title"
            disabled={!initialized}
            component={TextField}
            hintText={intl.formatMessage({id: 'title_hint'})}
            floatingLabelText={intl.formatMessage({id: 'title_label'})}
            ref="title"
            withRef
          />
        </div>

        <div>
          <Field
            name="description"
            component={TextField}
            disabled={!initialized}
            floatingLabelText="Description"
            hintText="Enter description"
            multiLine
            rows={3}
            ref="description"
            withRef
          />
        </div>
        <div>
          <Field
            name='helper'
            component={SuperSelectField}
            showAutocompleteThreshold={5}
            elementHeight={60}
            hintText='location'>
            {locationSource.map((val, i) => {
              return (
                <div key={val.id} value={val.id?val.id:i} label={val.name}>
                  <div style={{display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={locations[i]?locations[i].val.photoURL:undefined}
                      alt="person"
                      icon={
                        <FontIcon className="material-icons" >
                          person
                        </FontIcon>}
                      />
                      <div style={{marginLeft: 15}}>
                        {val.name}
                      </div>
                    </div>
                  </div>
                )
              })}
            </Field>
          </div>
          <br/>

          <div>
            <RaisedButton
              label={intl.formatMessage({id: 'submit'})}
              type="submit"
              primary={true}
              disabled={!initialized}
            />
          </div>
        </form>
      );
    }
  }

  const mapStateToProps = state => {
    const { intl, lists } = state;

    return {
      intl,
      locations: lists.locations
    };
  };

  ReviewForm=reduxForm({form: 'review'})(ReviewForm);

  export default connect(
    mapStateToProps
  )(injectIntl(ReviewForm));
