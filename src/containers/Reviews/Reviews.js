import React, {Component} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactDOM  from 'react-dom';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {injectIntl, intlShape} from 'react-intl';
import { Activity } from '../../containers/Activity';
import { setDialogIsOpen } from '../../store/dialogs/actions';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
//import ReactList from 'react-list';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import { green800} from 'material-ui/styles/colors';
import {BottomNavigation} from 'material-ui/BottomNavigation';
import {withRouter} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { withFirebase } from 'firekit';

class Reviews extends Component {

  constructor(props) {
    super(props);
    this.name = null;
    this.listEnd=null
    this.new_review_title = null;
    this.state={value: '' }
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.listEnd);
    node.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate(prevProps, prevState) {

    this.scrollToBottom();

  }

  componentDidMount() {
    const {watchList, firebaseApp}=this.props;

    let reviewsRef=firebaseApp.database().ref('location_reviews').orderByKey().limitToLast(20);
    watchList(reviewsRef)
    this.scrollToBottom();
  }

  handleKeyDown = (event, onSucces) => {
    if(event.keyCode===13){
      onSucces();
    }
  }

  handleAddReview = () => {
    const { auth, firebaseApp}=this.props;

    const title=this.name.getValue();

    const newReview={
      title: title,
      created: firebase.database.ServerValue.TIMESTAMP ,
      userName: auth.displayName,
      userPhotoURL: auth.photoURL,
      userId: auth.uid,
      stars: 0,
    }

    this.name.input.value='';

    if(title.length>0){
      firebaseApp.database().ref('location_reviews').push(newReview);
    }



  }

  handleUpdateReview = (key, review) => {
    const { firebaseApp }=this.props;
    firebaseApp.database().ref(`location_reviews/${key}`).update(review);
  }


  userAvatar = (key, review) => {

    return review.completed?
    <Avatar
      alt="person"
      icon={<FontIcon className="material-icons" >done</FontIcon>}
      backgroundColor={green800}
    />
    :
    <Avatar
      src={review.userPhotoURL}
      alt="person"
      icon={
        <FontIcon className="material-icons">
          person
        </FontIcon>
      }
    />
  }

  renderList(reviews) {
    const { auth, intl, history, browser, setDialogIsOpen} =this.props;

    if(reviews===undefined){
      return <div></div>
    }

    return _.map(reviews, (row, i) => {

      const review=row.val;
      const key=row.key;

      return <div key={key}>

        <ListItem
          key={key}
          onClick={review.userId===auth.uid?()=>{history.push(`/reviews/edit/${key}`)}:undefined}
          primaryText={review.title}
          secondaryText={`${review.userName} ${review.created?intl.formatRelative(new Date(review.created)):undefined}`}
          leftAvatar={this.userAvatar(key, review)}
          rightIconButton={
            review.userId===auth.uid?
            <IconButton
              style={{display:browser.lessThan.medium?'none':undefined}}
              onClick={()=>{setDialogIsOpen('delete_review_from_list', key);}}>
              <FontIcon className="material-icons" color={'red'}>{'delete'}</FontIcon>
            </IconButton>:undefined
          }
          id={key}
        />


        <Divider inset={true}/>
      </div>
    });
  }

  handleClose = () => {
    const { setDialogIsOpen }=this.props;
    setDialogIsOpen('delete_review_from_list', undefined);
  }

  handleDelete = (key) => {
    const {firebaseApp, dialogs, unwatchList, watchList} =this.props;

    unwatchList('location_reviews');

    firebaseApp.database().ref(`location_reviews/${dialogs.delete_review_from_list}`).remove();

    let reviewsRef=firebaseApp.database().ref('location_reviews').orderByKey().limitToLast(20);
    watchList(reviewsRef)

    this.handleClose();

  }

  render(){
    const {intl, reviews, muiTheme, dialogs} =this.props;


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

    return (
      <Activity
        isLoading={reviews===undefined}
        containerStyle={{overflow:'hidden'}}
        title={intl.formatMessage({id: 'reviews'})}>

        <div id="scroller" style={{overflow: 'auto', height: '100%'}}>

          <div style={{overflow: 'none', backgroundColor: muiTheme.palette.convasColor, paddingBottom: 56}}>
            <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
              {this.renderList(reviews)}
            </List>
            <div style={{ float:"left", clear: "both" }}
              ref={(el) => { this.listEnd = el; }}
            />
          </div>


          {reviews &&
            <BottomNavigation style={{width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50}}>
              <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                <TextField
                  id="location_review"
                  fullWidth={true}
                  onKeyDown={(event)=>{this.handleKeyDown(event, this.handleAddReview)}}
                  ref={(field) => { this.name = field; this.name && this.name.focus(); }}
                  type="Text"
                />
                <IconButton
                  onClick={this.handleAddReview}>
                  <FontIcon className="material-icons" color={muiTheme.palette.primary1Color}>send</FontIcon>
                </IconButton>
              </div>
            </BottomNavigation>
          }

          <Dialog
            title={intl.formatMessage({id: 'delete_review_title'})}
            actions={actions}
            modal={false}
            open={dialogs.delete_review_from_list!==undefined}
            onRequestClose={this.handleClose}>
            {intl.formatMessage({id: 'delete_review_message'})}
          </Dialog>


        </div>

      </Activity>
    );

  }

}

Reviews.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { lists, auth, browser, dialogs } = state;

  return {
    reviews: lists.location_reviews,
    auth,
    browser,
    dialogs
  };
};




export default connect(
  mapStateToProps,
  { setDialogIsOpen }
)(injectIntl(muiThemeable()(withRouter(withFirebase(Reviews)))));
