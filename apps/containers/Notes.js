'use strict'

import React, {Component} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import Note from '../components/Note';

import t from 'tcomb-form-native';

const Form = t.form.Form;

const NoteModel = t.struct({
  note: t.String,
  date: t.Date
});

const formOptions = {
  auto: 'placeholders'
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
      <View style={styles.container}> 
        <Text>Notes</Text>
        {noteList}
        <Text>Add Note</Text>
        <Form
          ref="addNote"
          type={NoteModel}
          options={formOptions}
          value={this.defaultValues}
        />
        <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
          <Text>Save Note</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles =  StyleSheet.create({
  container: {
    marginTop: 70,
    justifyContent: 'center'
  },
  button: {
    width: 100,
    height: 30,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  }
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