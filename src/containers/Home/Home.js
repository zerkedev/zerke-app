import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { injectIntl, intlShape } from 'react-intl';
import { ZerkeIcon } from '../../components/Icons';
import { Activity } from '../../containers/Activity';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Line, Bar, Doughnut} from 'react-chartjs-2';
import { withFirebase } from 'firekit';
import CountUp from 'react-countup';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import Scrollbar from '../../components/Scrollbar/Scrollbar';
import NewChurch from '../../utils/resources/POL_Warsawa_Wawrzyszew_new_church.JPG'



const currentYear=new Date().getFullYear();
const daysPath=`/user_registrations_per_day/${currentYear}/${new Date().toISOString().slice(5, 7)}`;
const monthsPath=`/user_registrations_per_month/${currentYear}`;
const providerPath=`/provider_count`;


class Home extends Component {

  componentDidMount(){
    const { watchPath }=this.props;

    //watchPath(moneyToLocations);
    //watchPath(days_count);
   // watchPath(locations_count);
    watchPath('users_count');

  }

  render() {

    const {muiTheme, intl, days, months, providers, usersCount}= this.props;





    return (
      <Activity
        iconElementRight={
          <FlatButton
            style={{marginTop: 4}}
            href="https://zerke.co"
            target="_blank"
            rel="noopener"
            secondary={true}
            icon={<ZerkeIcon/>}
          />
        }
        title={intl.formatMessage({id: 'home'})}>

        <div style={{margin: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            
             <Card>
               <CardHeader
                 title="News"
                 subtitle="November 2017"
                 icon={<FontIcon className="material-icons">account_box</FontIcon>}
               />
               <CardMedia
                 overlay={<CardTitle title="St Johns Joins zerke!" subtitle="Episcopal Church" />}
               >
                 <img src={NewChurch} alt="" />
               </CardMedia>
               <CardText>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                 Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                 Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
               </CardText>
           
             </Card>
            </div>                
          </div>
          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            
             <Card>
               <CardHeader
                 title="Announcements"
                 subtitle="November 2017"
                 icon={<FontIcon className="material-icons">account_box</FontIcon>}
               />
               
               <CardText>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                 Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                 Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
               </CardText>
           
             </Card>
            </div>    
          <div style={{margin: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>

            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 30}}>
              <CountUp
                style={{
                  fontSize: 100,
                  color: muiTheme.palette.primary1Color,
                  fontFamily: muiTheme.fontFamily,
                }}
                start={0}
                end={usersCount}
              />
              <div>
                <FontIcon
                  color={muiTheme.palette.accent1Color}
                  className="material-icons"
                  style={{fontSize: 70, marginLeft: 16}}>
                  location_city
                </FontIcon>
              </div>

            </div>
          </div>
  
          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            
             <Card>
               <CardHeader
                 title="Verse of the Day"
                 subtitle="zerke"
                 icon={<FontIcon className="material-icons">account_box</FontIcon>}
               />
               
               <CardText>
                And then Jesus said to his disciples, "If anyone would come after me, he must deny himself, take up his cross and follow me. -Matt 16:24             </CardText>
           
             </Card>
            </div>      
          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            <Bar
              options={{
                maintainAspectRatio: true,
              }}
            />
          </div>


        <br/>
        <div style={{margin: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 30}}>
            <CountUp
              style={{
                fontSize: 100,
                color: muiTheme.palette.primary1Color,
                fontFamily: muiTheme.fontFamily,
              }}
              start={0}
              end={usersCount}
            />
            <div>
              <FontIcon
                color={muiTheme.palette.accent1Color}
                className="material-icons"
                style={{fontSize: 70, marginLeft: 16}}>
                group
              </FontIcon>
            </div>

          </div>
        </div>



      </Activity>
    );
  }

}

Home.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const { paths } = state;

  return {
    usersCount: paths['users_count']?paths['users_count']:0,
  };
};

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withFirebase(Home))));
