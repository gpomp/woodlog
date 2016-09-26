'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View, StyleSheet, Text
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import BottomNav from '../components/BottomNav';

export const SEENOTES = 'see_notes';
export const EDIT = 'edit';

class Tree extends Component {

  componentWillMount () {
    this.props.actions.show(this.props.nextId);
  }

  onNavClick (key) {
    switch(key) {
      case SEENOTES:
        NavActions.Notes();
      break;
      case EDIT:
        NavActions.Edit({id: this.props.nextId});
      break;
    }
  }

  render () {

    if(!this.props.initialized) return (<View style={styles.container}></View>);

    const { tree } = this.props;

    const list = [];

    for(const name in this.props.tree) {
      list.push(<Text>{name} {this.props.tree[name]}</Text>);
    }

    return(
      <View style={styles.container}> 
        {list}
        <BottomNav 
          items={ [ { label: 'See Notes', key: SEENOTES }, { label: 'Edit', key: EDIT } ] } 
          onNavClick = {this.onNavClick.bind(this)} />
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
    initialized: state.tree.initialized,  
    tree: state.tree.rawData
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Tree)