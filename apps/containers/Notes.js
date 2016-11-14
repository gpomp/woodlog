'use strict'
import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Animated, Easing
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import Note from '../components/Note';

import t from 'tcomb-form-native';

import BottomNav from '../components/BottomNav';

import { width, 
          height, 
          REG_PADDING, 
          container as ctnStyles, 
          textReg, 
          TEXT_PADDING, 
          BIG_FONT_SIZE, 
          formatDate,
          TRADE_GOTHIC } from '../utils/globalStyles';

import {mergeDeep} from '../utils/utils';

const ctnWidth = width - REG_PADDING * 2 - TEXT_PADDING * 2;

class Notes extends Component {

  constructor(props) {
    super(props);
    this.addOpen = false;
    this.state = { height: new Animated.Value(0) };
  }

  componentWillMount () {

  }

  componentDidMount () {
    this.state.height.setValue(0);
    // this.refs.bottomNav.animateIn();
  }

  componentDidUpdate () {
    this.props.onNoteUpdate();
  }

  onNavClick (key) {
    switch(key) {
      case 'back': 
        NavActions.pop();
      break;
    }
  }

  noteUpdate () {
    console.log('force update!!');
    this.forceUpdate();
  }

  render () {
    const { notes } = this.props;
    const d = new Date();
    const noteList = notes.map((n, i) => {
      const k = `tree-note-${i}`;
      return <Note date={ n.date } note={ n.note } arrayID={i} key={k} onNoteUpdate={this.noteUpdate.bind(this)} onToggleNote={this.props.onToggleNote} />
    });
    return(
      <View style={{flex: 1, justifyContent: 'center'}}> 
        <Text style={styles.title}>NOTES</Text>
        {noteList}
        <Note date={ new Date().toString() } note="Add a new note here" arrayID={-1} key={-1} onNoteUpdate={this.noteUpdate.bind(this)} onToggleNote={this.props.onToggleNote}/>
        {/*<BottomNav 
                      ref="bottomNav"
                      buttons={ [ { label: 'BACK', key: 'back' } ] } 
                      onNavClick = {this.onNavClick.bind(this)} />*/}
      </View>
    );
  }
}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles, {}),
  innerContainer: { 
    justifyContent: 'center'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
  textButton: Object.assign({}, textReg, {
    fontSize: 20,
    opacity: 1
  }),
  title: Object.assign({}, textReg, {
    opacity: 1,
    marginBottom: 35,
    width: ctnWidth
  })
});

const stateToProps = (state) => {
  return {
    id: state.tree.id,
    notes: state.tree.rawData.notes
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Notes)