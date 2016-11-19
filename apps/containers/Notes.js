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

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.isPending;
  }

  onNavClick (key) {
    switch(key) {
      case 'back': 
        NavActions.pop();
      break;
    }
  }

  render () {
    const { notes } = this.props;
    const d = new Date();
    const noteList = notes.map((n, i) => {
      const k = `tree-note-${i}`;
      const ref = `note${i}`;
      return <Note 
              date={ n.date } note={ n.note } eventID={ n.eventID } arrayID={i} key={k} ref={ref} 
              photoList={ this.props.photos }
              treeID={this.props.treeID}
              noteID={n.id}
              onToggleNote={this.props.onToggleNote}
              onNoteUpdate={this.props.onNoteUpdate}
              onFocusNote={(id) => {
                let n;
                if(id === -1) n = this.refs.addNote;
                else {
                  n = this.refs[`note${id}`];
                }
                this.props.onFocusNote(n); 
              }} />
    });
    return(
      <View style={{flex: 1, justifyContent: 'center'}}> 
        <Text style={styles.title}>NOTES</Text>
        {noteList}
        <Note date={ new Date().toString() } note="Add a new note here" eventID="-1" arrayID={-1} key={-1} ref='addNote'
          treeID={this.props.treeID}
          noteID={-1}
          onToggleNote={this.props.onToggleNote} 
          onNoteUpdate={this.props.onNoteUpdate}
          onFocusNote={(id) => {
            let n;
            if(id === -1) n = this.refs.addNote;
            else {
              n = this.refs[`note${id}`];
            }
            this.props.onFocusNote(n); 
          }}/>
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
    notes: state.notes.list,
    photos: state.tree.rawData.photos,
    isPending: state.notes.isPending,
    treeID: state.tree.id
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Notes)