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
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import { green800} from 'material-ui/styles/colors';
import {BottomNavigation} from 'material-ui/BottomNavigation';
import {withRouter} from 'react-router-dom';
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { withFirebase } from 'firekit';


const path='/locations';

class Posts extends Component {

  constructor(props) {
    super(props);
    this.name = null;
    this.listEnd=null
    this.new_post_title = null;
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

    let postsRef=firebaseApp.database().ref('public_posts').orderByKey().limitToLast(20);
    watchList(postsRef)
    this.scrollToBottom();
  }

  handleKeyDown = (event, onSucces) => {
    if(event.keyCode===13){
      onSucces();
    }
  }

  handleAddPost = () => {
    const { auth, firebaseApp}=this.props;

    const title=this.name.getValue();

    const newpost={
      title: title,
      created: firebase.database.ServerValue.TIMESTAMP ,
      userName: auth.displayName,
      userPhotoURL: auth.photoURL,
      userId: auth.uid,
      completed: false
    }

    this.name.input.value='';

    if(title.length>0){
      firebaseApp.database().ref('public_posts').push(newpost);
    }



  }

  handleUpdatePost = (key, post) => {
    const { firebaseApp }=this.props;
    firebaseApp.database().ref(`public_posts/${key}`).update(post);
  }


  userAvatar = (key, post) => {
    const {auth} =this.props;

    return post.completed?
    <Avatar
      onClick={auth.uid===post.userId?()=>{this.handleUpdatePost(key,{...post, completed: !post.completed})}:undefined}
      alt="person"
      icon={<FontIcon className="material-icons" >done</FontIcon>}
      backgroundColor={green800}
    />
    :
    <Avatar
      src={post.userPhotoURL}
      onClick={auth.uid===post.userId?()=>{this.handleUpdatePost(key,{...post, completed: !post.completed})}:undefined}
      alt="person"
      icon={
        <FontIcon className="material-icons">
          person
        </FontIcon>
      }
    />
  }

  handleTabActive = (value) => {
    const { history } = this.props;

    history.push(`${path}/`);

  }

  renderList(posts) {
    const { auth, intl, history, muiTheme, } =this.props;

    if(posts===undefined){
      return <div></div>
    }

    return _.map(posts, (row, i) => {

      const post=row.val;
      const key=row.key;

      return <div key={key}>

        <ListItem
          key={key}
          onClick={post.userId===auth.uid?()=>{history.push(`/posts/edit/${key}`)}:undefined}
          primaryText={post.title}
          secondaryText={`${post.userName} ${post.created?intl.formatRelative(new Date(post.created)):undefined}`}
          leftAvatar={this.userAvatar(key, post)}
          rightIconButton={
            post.userId===auth.uid?
            <IconButton
              tooltip={intl.formatMessage({id: 'upvote'})}
             >
              <FontIcon
                      className="material-icons"
                      color={muiTheme.palette.primary1Color}>
                      keyboard_arrow_up
                    </FontIcon>
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
    setDialogIsOpen('delete_post_from_list', undefined);
  }

  handleDelete = (key) => {
    const {firebaseApp, dialogs, unwatchList, watchList} =this.props;

    unwatchList('public_posts');

    firebaseApp.database().ref(`public_posts/${dialogs.delete_post_from_list}`).remove();

    let messagesRef=firebaseApp.database().ref('public_posts').orderByKey().limitToLast(20);
    watchList(messagesRef)

    this.handleClose();

  }

  render(){
    const {intl, posts, muiTheme, dialogs} =this.props;


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
        isLoading={posts===undefined}
        containerStyle={{overflow:'hidden'}}
        title={intl.formatMessage({id: 'posts'})}>

        <div id="scroller" style={{overflow: 'auto', height: '100%'}}>
          <Tabs
            onChange={this.handleTabActive}>
            <Tab
              label={'all'}>
              <div style={{overflow: 'none', backgroundColor: muiTheme.palette.convasColor, paddingBottom: 56}}>
                <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                  {this.renderList(posts)}
                </List>
                <div style={{ float:"left", clear: "both" }}
                  ref={(el) => { this.listEnd = el; }}
                />
              </div>


              {posts &&
                <BottomNavigation style={{width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50}}>
                  <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                    <TextField
                      id="public_post"
                      fullWidth={true}
                      onKeyDown={(event)=>{this.handleKeyDown(event, this.handleAddPost)}}
                      ref={(field) => { this.name = field; this.name && this.name.focus(); }}
                      type="Text"
                    />
                    <IconButton
                      onClick={this.handleAddPost}>
                      <FontIcon className="material-icons" color={muiTheme.palette.primary1Color}>send</FontIcon>
                    </IconButton>
                  </div>
                </BottomNavigation>
              }
              </Tab>
              <Tab
                label={'city'}>
                <div style={{overflow: 'none', backgroundColor: muiTheme.palette.convasColor, paddingBottom: 56}}>
                  <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                    {this.renderList(posts)}
                  </List>
                  <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.listEnd = el; }}
                  />
                </div>


                {posts &&
                  <BottomNavigation style={{width: '100%', position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 50}}>
                    <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
                      <TextField
                        id="public_post"
                        fullWidth={true}
                        onKeyDown={(event)=>{this.handleKeyDown(event, this.handleAddPost)}}
                        ref={(field) => { this.name = field; this.name && this.name.focus(); }}
                        type="Text"
                      />
                      <IconButton
                        onClick={this.handleAddPost}>
                        <FontIcon className="material-icons" color={muiTheme.palette.primary1Color}>send</FontIcon>
                      </IconButton>
                    </div>
                  </BottomNavigation>
                }
                </Tab>
            </Tabs>

          <Dialog
            title={intl.formatMessage({id: 'delete_post_title'})}
            actions={actions}
            modal={false}
            open={dialogs.delete_post_from_list!==undefined}
            onRequestClose={this.handleClose}>
            {intl.formatMessage({id: 'delete_post_message'})}
          </Dialog>


        </div>

      </Activity>
    );

  }

}

Posts.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { lists, auth, browser, dialogs } = state;

  return {
    posts: lists.public_posts,
    auth,
    browser,
    dialogs
  };
};




export default connect(
  mapStateToProps,
  { setDialogIsOpen }
)(injectIntl(muiThemeable()(withRouter(withFirebase(Posts)))));
