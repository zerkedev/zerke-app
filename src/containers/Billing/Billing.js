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
import {Card, CardText} from 'material-ui/Card'
//import {FlatButton} from 'material-ui/FlatButton';
import Scrollbar from '../../components/Scrollbar/Scrollbar';

const path='/billing';



class Billing extends Component {

  componentDidMount() {
    const { watchList, firebaseApp}=this.props;

    let ref=firebaseApp.database().ref('billing').limitToFirst(20);

    watchList(ref);
  }

  handleTabActive = (value) => {
    const { history} = this.props;

    history.push(`${path}/`);

  }

  renderList(billing) {
    const {history} =this.props;

    if(billing===undefined){
      return <div></div>
    }

    return _.map(billing, (bill, index) => {

      return <div key={index}>
        <ListItem
          leftAvatar={
            <Avatar
              src={bill.val.photoURL}
              alt="bussines"
              icon={
                <FontIcon className="material-icons">
                  monetization_on
                </FontIcon>
              }
            />
          }
          key={index}
          primaryText={bill.val.name}
          secondaryText={bill.val.creation_date}
          rightText={bill.val.amount}
          
          id={index}
          rightIconButton={
            <FontIcon 
            onClick={()=>{history.push(`/billing/edit/${bill.key}`)}}
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
    const { intl, billing, history, isGranted, } =this.props;

    return (
      <Activity
        isLoading={billing===undefined}
        containerStyle={{overflow:'hidden'}}
        title={intl.formatMessage({id: 'billing'})}>
        <Scrollbar>
          <Tabs
           // value={value}
            onChange={this.handleTabActive}>


            <Tab
             value={'credits'}
              icon={<FontIcon className="material-icons">credit_card</FontIcon>}>
              <Card>
              <CardText>
                Current Account Info
              </CardText>
              </Card> 
              <Card>
              <CardText>
                Stripe API
              </CardText>
              </Card>     
              

            </Tab>
            <Tab
           value={'donations'}
              icon={<FontIcon className="material-icons">redeem</FontIcon>}>
              {
              <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                {this.renderList(billing)}
              </List>
                    }

            </Tab>
            <Tab
             value={'other'}
              icon={<FontIcon className="material-icons">list</FontIcon>}>
              {
                  <List  id='test' style={{height: '100%'}} ref={(field) => { this.list = field; }}>
                    {this.renderList(billing)}
                  </List>
              }

            </Tab>
     
          </Tabs>
        </Scrollbar>

          <div style={{position: 'fixed', right: 18, zIndex:3, bottom: 18, }}>
          {
              isGranted('create_location') &&
              <FloatingActionButton secondary={true} onClick={()=>{history.push(`/billing/create`)}} style={{zIndex:3}}>
                <FontIcon className="material-icons" >add</FontIcon>
              </FloatingActionButton>
          }
          </div>
    </Activity>
  );

}

}

Billing.propTypes = {
  billing: PropTypes.array.isRequired,
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
    billing: lists.billing,
    auth,
    browser,
    uid,
   // type,
    isGranted: grant=>isGranted(state, grant)
  };
};


export default connect(
  mapStateToProps,
)(injectIntl(muiThemeable()(withRouter(withFirebase(Billing)))));
