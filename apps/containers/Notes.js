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
  }

  render () {
    const { notes } = this.props;

    const noteList = notes.map((n, i) => {
      const k = `tree-${i}`;
      return <Note date={ n.date } text={ t.text } key={k} />
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
              minimumDate={new Date('1/1/1900')}
              maximumDate={new Date()} mode='date' placeholder='Date Acquired'/>
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