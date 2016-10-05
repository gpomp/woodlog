'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, Dimensions, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import TreeItem from '../components/TreeItem';

import * as TreeActions from '../actions/treeActions';
const { width, height } = Dimensions.get('window');

import {removeAllImages} from '../utils/debug';


class List extends Component {

  componentWillMount () {
    this.props.actions.reset();
    this.props.actions.getList();

    // removeAllImages();
  }

  componentDidUpdate() {

  }

  onNavClick (key) {
    NavActions.Tree({nextId: key});
  }

  onAddClick () {
    NavActions.Edit();
  }

  render () {
    let trees = [];
    if(this.props.initialized) {
      trees = this.props.list.map((t, i) => {
        const k = `tree-${i}`;
        return <TreeItem label={ t.species } photos={ t.photos } key={k} ukey={ i } onNavClick={ this.onNavClick.bind(this) }/>
      });
    }
    return(
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Woodlog</Text>
      {trees}
      <TouchableOpacity key="add-tree" onPress={() => { this.onAddClick() }} style={styles.button}>
        <Text>Add Bonsai</Text>
      </TouchableOpacity>
    </ScrollView>
  );
    
    
    
  }

}

const styles =  StyleSheet.create({
  container: {
    marginTop: 68,
    width, height
  },
  button: {
    marginTop: 5,
    padding: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Seattle Sans',
    color: 'black',
    fontSize: 30,
    alignItems: 'center',
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