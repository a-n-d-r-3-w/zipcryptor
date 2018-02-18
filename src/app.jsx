import React from 'react';
import { ipcRenderer } from 'electron';

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
      <h2>Welcome to React!</h2>
    </div>);
  }
}
