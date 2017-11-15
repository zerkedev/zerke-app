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
import { Card, CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';


const currentYear=new Date().getFullYear();
const daysPath=`/user_registrations_per_day/${currentYear}/${new Date().toISOString().slice(5, 7)}`;
const monthsPath=`/user_registrations_per_month/${currentYear}`;
const providerPath=`/provider_count`;


class Dashboard extends Component {

  componentDidMount(){
    const { watchPath }=this.props;

    watchPath(daysPath);
    watchPath(monthsPath);
    watchPath(providerPath);
    watchPath('users_count');

  }

  handleDestroyLocations = (values) => {

    const {history, auth, match, firebaseApp}=this.props;


    var ref = firebaseApp.database().ref('/locations_online/');
    var now = Date.now();
    var cutoff = now + 8640000;
    var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
    var listener = old.on('child_added', function(snapshot) {
        snapshot.ref.remove();
    });
  }


  render() {

    const {muiTheme, intl, days, months, providers, usersCount, firebaseApp, uid}= this.props;


    let daysLabels=[];
    let daysData=[]



    if(days){
      Object.keys(days).sort().map(key =>{
        daysLabels.push(key);
        daysData.push(days[key]);
        return key;
      })
    }

    const daysComponentData = {
      labels: daysLabels,
      datasets: [
        {
          label: intl.formatDate(Date.now(),{month: 'long'}),
          fill: false,
          lineTension: 0.1,
          backgroundColor: muiTheme.palette.primary1Color,
          borderColor: muiTheme.palette.primary1Color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: muiTheme.palette.accent1Color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: muiTheme.palette.primary1Color,
          pointHoverBorderColor: muiTheme.palette.accent1Color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: daysData
        }
      ]
    };

    let monthsLabels=[];
    let monthsData=[]

    if(months){
      Object.keys(months).sort().map(key =>{

        let date=new Date(`${currentYear}-${key}-1`);
        monthsLabels.push(intl.formatDate(date,{month: 'long'}));


        monthsData.push(months[key]);
        return key;
      })
    }

    const monthsComponentData = {
      labels: monthsLabels,
      datasets: [
        {
          label: intl.formatMessage({id: 'user_registrationg_graph_label'}),
          fill: false,
          maintainAspectRatio: true,
          lineTension: 0.1,
          backgroundColor: muiTheme.palette.primary1Color,
          borderColor: muiTheme.palette.primary1Color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: muiTheme.palette.accent1Color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: muiTheme.palette.primary1Color,
          pointHoverBorderColor: muiTheme.palette.accent1Color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: monthsData
        }
      ]
    };


    let providersData=[];
    let providersLabels=[];
    let providersBackgrounColors=[];

    if(providers){
      Object.keys(providers).sort().map((key) =>{
        providersLabels.push(intl.formatMessage({id: key}));
        providersBackgrounColors.push(intl.formatMessage({id: `${key}_color`}));
        providersData.push(providers[key]);
        return key;
      })
    }

    const providersComponentData = {
      labels: providersLabels,
      datasets: [{
        data: providersData,
        backgroundColor: providersBackgrounColors,
        hoverBackgroundColor: providersBackgrounColors
      }]
    };

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
        title={intl.formatMessage({id: 'dashboard'})}>
        <div>
        <Card>
        <FlatButton
            label={intl.formatMessage({id: 'reset_locations_online'})}
            primary={true}
            onClick={this.handleDestroyLocations}
        />
        <FlatButton
            label={intl.formatMessage({id: 'reset_users_online'})}
            primary={true}
            onClick={() => { firebaseApp.database().ref(`/locations/:uid/coworkersHere/`).remove();}
          }
        />
        </Card>
        </div>

        <div style={{margin: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            <Line
              options={{
                maintainAspectRatio: true,
              }}
              data={monthsComponentData}
            />
          </div>

          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            <Bar
              options={{
                maintainAspectRatio: true,
              }}
              data={daysComponentData}
            />
          </div>

        </div>

        <br/>
        <div style={{margin: 5, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>

          <div style={{flexGrow: 1, flexShrink: 1, maxWidth: 600}}>
            <Doughnut
              data={providersComponentData}
            />
          </div>

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

Dashboard.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const { paths } = state;

  return {
    days: paths[daysPath],
    months: paths[monthsPath],
    providers: paths[providerPath],
    usersCount: paths['users_count']?paths['users_count']:0,
  };
};

export default connect(
  mapStateToProps
)(injectIntl(muiThemeable()(withFirebase(Dashboard))));
