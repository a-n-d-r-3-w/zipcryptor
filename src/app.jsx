import React from 'react';
import { ipcRenderer } from 'electron';
import Reboot from 'material-ui/Reboot';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FileIcon from 'material-ui-icons/InsertDriveFile';

const styles = theme => ({
  gridContainer: {
    marginTop: theme.spacing.unit * 8,
  },
  gridItem: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  listItem: {
    padding: 0,
  },
  listItemText: {
    padding: 0,
  },
  button: {
    marginLeft: theme.spacing.unit * 2,
  }
});

class App extends React.Component {
  static showOpenDialog() {
    ipcRenderer.send('show-open-dialog');
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: [],
      password: '',
      isZipFileWritten: false,
      zipFileName: '',
    };
    this.updatePassword = this.updatePassword.bind(this);
    this.writeZipFile = this.writeZipFile.bind(this);
    this.handlePasswordFieldKeyPress = this.handlePasswordFieldKeyPress.bind(this);
  }

  componentWillMount() {
    ipcRenderer.on('files-selected', (event, selectedFiles) => {
      this.setState({ selectedFiles });
    });
    ipcRenderer.on('zip-file-written', (event, zipFileName) => {
      this.setState({
        isZipFileWritten: true,
        zipFileName,
      });
    });
  }

  updatePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  writeZipFile() {
    ipcRenderer.send('write-zip-file', this.state);
  }

  handlePasswordFieldKeyPress(event) {
    if (event.key === 'Enter') {
      this.writeZipFile();
    }
  }

  render() {
    const { classes } = this.props;
    if (this.state.isZipFileWritten) {
      return (
        <Grid container direction="column" alignItems="center" className={classes.gridContainer}>
          <Reboot/>
          <br /><br /><br />
          <Grid item className={classes.gridItem}>
            <Typography variant="title">ZIP file written to ~/Desktop/{this.state.zipFileName}.</Typography>
          </Grid>
          <br /><br /><br />
          <Grid item className={classes.gridItem}>
            <Typography variant="title">Thank you for using ZipCryptor!</Typography>
          </Grid>
          <br />
          <Grid item className={classes.gridItem}>
            <Typography variant="title">Press command+q to quit.</Typography>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid container direction="column" alignItems="center" className={classes.gridContainer}>
        <Reboot/>
        <Grid item className={classes.gridItem}>
          <Typography variant="display1">Welcome to ZipCryptor!</Typography>
        </Grid>
        <Grid item>
          <Button autoFocus variant="raised" onClick={App.showOpenDialog}>Select files</Button>
        </Grid>
        {
          this.state.selectedFiles.length > 0 &&
          <Grid item className={classes.gridItem}>
            <Typography variant="subheading">Selected files:</Typography>
            <List>
              {this.state.selectedFiles.map(file => {
                return <ListItem key={file} className={classes.listItem}>
                  <ListItemIcon><FileIcon/></ListItemIcon>
                  <ListItemText primary={file} className={classes.listItemText}/>
                </ListItem>
              })}
            </List>
          </Grid>
        }
        {
          this.state.selectedFiles.length > 0 &&
          <Grid item className={classes.gridItem}>
            <TextField
              onKeyPress={this.handlePasswordFieldKeyPress}
              autoFocus
              label="Password"
              type="password"
              onChange={this.updatePassword}
              value={this.state.password}
            />
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.writeZipFile}
              disabled={!this.state.password}>
              Write encrypted ZIP file
            </Button>
          </Grid>
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(App);