import React, { Component } from 'react';
import RNFS from 'react-native-fs';
import { Router, Scene } from 'react-native-router-flux';

import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

import Tree from './containers/Tree';
import List from './containers/List';
import Edit from './containers/Edit';
import Notes from './containers/Notes';
// import SlideShow from './containers/PhotoSlideShow';

export default class App extends Component {
  constructor(props) {
      super(props);
  
    const storage = new Storage({
        // maximum capacity, default 1000 
        size: 1000,

        // Use AsyncStorage for RN, or window.localStorage for web.
        // If not set, data would be lost after reload.
        storageBackend: AsyncStorage,

        // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
        // can be null, which means never expire.
        defaultExpires: null,

        // cache data in the memory. default is true.
        enableCache: true
    });
    global.targetFilePath = [ RNFS.DocumentDirectoryPath, 'woodlog' ].join('/');
    global.storage = storage;
  }

  render() {
    return (
      <Router>
        <Scene type='replace' key="root">
          <Scene type='replace' key="List" component={List} title="Tree List" initial={true} hideNavBar={true}/>
          <Scene type='replace' key="Tree" component={Tree} title="Bonsai" hideNavBar={true}/>
          <Scene key="Notes" component={Notes} title="Notes"/>
          {/*<Scene key="SlideShow" component={SlideShow} title="Slide Show"/>*/}
          <Scene type='replace' key="Edit" component={Edit} title="Edit Bonsai"  hideNavBar={true}/>
        </Scene>
      </Router>
    )
  }
}