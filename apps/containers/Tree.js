'use strict'

import React, {Component} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

class Tree extends Component {

  componentWillMount () {
    console.log("will mount", this.props.nextId);
    this.props.actions.show(this.props.nextId);
  }

  render () {
    return(
      <View style={styles.container}> 
        <Text>TREE {this.props.nextId}</Text>
        <Text>{this.props.tree.rawData.species}</Text>
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
    id: state.tree.id,
    tree: state.tree.rawData
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Tree)