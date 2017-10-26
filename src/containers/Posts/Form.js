import React, {Component} from 'react';
import {connect} from 'react-redux';
import { injectIntl } from 'react-intl';
import {Field, reduxForm} from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import {SuperSelectField} from '../../containers/SuperSelectField';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';


class PostForm extends Component {
  componentDidMount() {
    this.refs.title // the Field
    .getRenderedComponent() // on Field, returns ReduxFormMaterialUITextField
    .getRenderedComponent() // on ReduxFormMaterialUITextField, returns TextField
    .focus(); // on TextField
  }

  render() {
    const {handleSubmit, intl, users, initialized } = this.props;

    let userSource=[];

    if(users){
      userSource=users.map(user=>{
        return {id: user.key, name: user.val.displayName}
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
      users: lists.users
    };
  };

  PostForm=reduxForm({form: 'post'})(PostForm);

  export default connect(
    mapStateToProps
  )(injectIntl(PostForm));
