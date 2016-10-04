'use strict'

import React, {Component} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import Note from '../components/Note';

import { Form, InputField,
        Separator, SwitchField, LinkField ,
        PickerField, DatePickerField
      } from 'react-native-form-generator';

class Notes extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount () {

  }

  handleFormFocus (formData) {
  }

  handleFormChange (formData) {
    this.formData = Object.assign({}, this.formData, formData);
  }

  saveNote () {
    this.formData.id = -1;
    this.props.actions.saveNote(this.formData);
    this.onNoteUpdate();
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
          ref='addNote'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          label="Add a Note">
            <InputField ref='note' placeholder='Your Note' />
            <DatePickerField ref='date'
              format='YYYY/MM/DD'
              minimumDate={new Date('1900/1/1')}
              maximumDate={new Date()} mode='date' placeholder='Date Acquired'
              date={new Date()}
            />
              
          </Form>
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