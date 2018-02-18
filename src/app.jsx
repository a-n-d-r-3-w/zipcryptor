import React from 'react';
import { ipcRenderer } from 'electron';
import Reboot from 'material-ui/Reboot';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 8,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: [],
    };
  }

  componentWillMount() {
    ipcRenderer.on('files-selected', (event, selectedFiles) => {
      console.log(selectedFiles);
    });
    // ipcRenderer.send('show-open-dialog');
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container direction="column" alignItems="center" className={classes.container}>
        <Reboot/>
        <Grid item>
          <Typography variant="title">Welcome to ZipCryptor!</Typography>
        </Grid>
        <Grid item>
          <Button variant="raised">Select files</Button>
        </Grid>
        <Grid item>
          
        <Grid item>
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(App);