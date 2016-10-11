'use strict'
import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, Animated, Easing
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
          formStyleSheet,
          mediumFieldSS,
          dateFieldSS,
          formatDate } from '../utils/globalStyles';
import datepicker from '../components/DatePickerCustomTemplate';

import {mergeDeep} from '../utils/utils';


const Form = t.form.Form;
t.form.Form.stylesheet = formStyleSheet;

const NoteModel = t.struct({
  note: t.String,
  date: t.Date
});

let datess = mergeDeep({}, formStyleSheet);
datess = mergeDeep(datess, dateFieldSS);

let notess = mergeDeep({}, formStyleSheet);
notess = mergeDeep(notess, {
  formGroup: {
    normal: {
      
    }
  },
  textbox: {
    normal: {
      paddingLeft: 0,
      paddingRight: 0,
      height: 200
    }
  }
});

const formOptions = {
  auto: 'placeholders',
  autoCapitalize: 'characters',
  stylesheet: formStyleSheet,
  fields: {
    note: {
      stylesheet: notess,
      placeholder: 'YOUR NOTE',
      multiline: true
    },
    date: {
      template: datepicker,
      stylesheet: datess,
      label: 'NOTE\'S DATE',
      config: {
        format: formatDate
      }
    }
  }
};

class Notes extends Component {

  constructor(props) {
    super(props);
    this.addOpen = false;
    this.state = { height: new Animated.Value(0) };
  }

  componentWillMount () {
    this.defaultValues = {
      note: '',
      date: new Date()
    }
  }

  componentDidMount () {
    this.state.height.setValue(0);
    this.refs.bottomNav.animateIn();
  }

  onNavClick (key) {
    switch(key) {
      case 'back': 
        NavActions.pop();
      break;
      case 'add':
        this.addOpen = !this.addOpen;
        this.toggleAddNote();
      break;
    }
  }

  toggleAddNote () {
    if(this.addOpen) {
      Animated.timing(this.state.height, {
        duration: 500,
        toValue: 370,
        easing: Easing.inOut(Easing.exp)
      }).start();
    } else {
      Animated.timing(this.state.height, {
        duration: 500,
        toValue: 0,
        easing: Easing.inOut(Easing.exp)
      }).start();
    }
  }

  saveNote () {    
    const validation = this.refs.addNote.validate();
    if(validation.errors.length > 0) {

    } else {
      const formData = Object.assign({}, validation.value);
      formData.id = -1;
      this.props.actions.saveNote(formData);
      this.onNoteUpdate();
      this.addOpen = false;
      this.toggleAddNote();
    }
  }

  onNoteUpdate () {
    this.forceUpdate();
  }

  render () {
    const { notes } = this.props;
    const d = new Date();
    const noteList = notes.map((n, i) => {
      const k = `tree-note-${i}`;
      return <Note date={ n.date } note={ n.note } arrayID={i} key={k} onNoteUpdate={this.onNoteUpdate.bind(this)} />
    });

    return(
      <ScrollView style={styles.container}> 
        <Text style={styles.title}>NOTES</Text>
        {noteList}
        <Animated.View style={{overflow:'hidden', height: this.state.height }}>
          <Text style={[styles.textButton, { marginTop: 20, marginBottom: 10, paddingLeft: TEXT_PADDING, paddingRight: TEXT_PADDING }]}>ADD NOTE</Text>
          <Form 
            ref="addNote"
            type={NoteModel}
            options={formOptions}
            value={this.defaultValues}
          />
          <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
            <Text style={styles.textButton}>SAVE NOTE</Text>
          </TouchableOpacity>
        </Animated.View>
        <BottomNav 
              ref="bottomNav"
              buttons={ [ { label: 'BACK', key: 'back' }, { label: 'ADD NOTE', key: 'add' } ] } 
              onNavClick = {this.onNavClick.bind(this)} />
      </ScrollView>
    );
  }
}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles, {}),
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
    opacity: 1
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