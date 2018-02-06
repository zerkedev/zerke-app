import React from 'react';
import Paper from 'material-ui/Paper';
import {injectIntl} from 'react-intl';
import muiThemeable from 'material-ui/styles/muiThemeable';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import {ZerkeIcon} from '../Icons';

const styles={
  paper:{
    height: '100%',
    margin:0,
    padding: 1
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5
  },
  icon: {
    width:512,
    height: 512
  }
}


const PageNotFound = ({muiTheme, intl }) => {

  return (
    <Paper  zDepth={1} style={styles.paper}>
      <div style={styles.container}>
        <ZerkeIcon color={muiTheme.palette.primary2Color} fill={'black'} style={styles.icon}/>
        <h3>{intl.formatMessage({id: 'warning_404_message'})}</h3>
        <p>{intl.formatMessage({id: 'warning_404_description'})}</p>
        <FloatingActionButton secondary={true} href='/'>
          <ActionHome />
        </FloatingActionButton>
      </div>
    </Paper>
  );
}

export default injectIntl(muiThemeable()(PageNotFound));
