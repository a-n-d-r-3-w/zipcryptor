import React from 'react';
import { ipcRenderer } from 'electron';
import Reboot from 'material-ui/Reboot';

export default class App extends React.Component {
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
    ipcRenderer.send('show-open-dialog');
  }

  render() {
    return (<div>
      <Reboot />
      <h2>Welcome to React!</h2>
    </div>);
  }
}
