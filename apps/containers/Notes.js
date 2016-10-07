'use strict'
import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import Note from '../components/Note';

import t from 'tcomb-form-native';

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
      backgroundColor: 'white'
    }
  },
  textbox: {
    normal: {
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
  }

  componentWillMount () {
    this.defaultValues = {
      note: '',
      date: new Date()
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
        <Text style={{ marginTop: 30 }}>ADD NOTE</Text>
        <Form 
          ref="addNote"
          type={NoteModel}
          options={formOptions}
          value={this.defaultValues}
        />
        <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
          <Text style={styles.textButton}>SAVE NOTE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { NavActions.pop(); }} style={styles.button}>
          <Text style={styles.textButton}>BACK</Text>
        </TouchableOpacity>
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