'use strict'

import React, {Component} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

class List extends Component {

  componentWillMount () {
    this.props.actions.getList();
  }

  getTree () {

  }

  render () {
    let trees = [];
    if(this.props.initialized) {
      trees = this.props.list.map((t) => {
        return <Text>{t.species}</Text>;
      });
    }
    return(
    <View style={styles.container}>
      <Text>LIST</Text>
      {trees}
    </View>
  );
    
    
    
  }

}

const styles =  StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
      justifyContent: 'center'
  }
});

const stateToProps = (state) => {
  return {
    list: state.list.data,
    initialized: state.list.initialized
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(List)