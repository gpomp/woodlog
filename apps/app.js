import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

import Tree from './containers/Tree';
import List from './containers/List';
import Edit from './containers/Edit';

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

    global.storage = storage;
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="list" component={List} title="Tree List" />
          <Scene key="Tree" component={Tree} title="Bonzai" />
          <Scene key="Edit" component={Edit} title="Edit Bonzai" initial={true} />
        </Scene>
      </Router>
    )
  }
}