import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import { Form, InputField,
        Separator, SwitchField, LinkField ,
        PickerField, DatePickerField
      } from 'react-native-form-generator';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';

const styles = StyleSheet.create({
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

class Note extends Component {
  constructor(props) {
    super(props);
    this.formData = {};
  }

  componentWillMount() {
    this.formData = Object.assign({}, this.props, this.formData);
    this.setState({ editMode: false, saving: false });
  }

  editNote () {
    this.setState({ editMode: !this.state.editMode });

  }

  saveNote () {
    this.props.actions.saveNote(this.formData, this.props.arrayID);
    this.setState({ saving: true });
  }

  cancelNote () {
    this.setState({ editMode: false });
  }

  removeNote () {
    this.props.actions.removeNote(this.props.arrayID);
    this.setState({ saving: true });
  }

  handleFormFocus () {

  }

  componentDidUpdate () {
    if(this.state.saving) {
      this.setState({ editMode: false, saving: false });
      this.props.onNoteUpdate();
    }    
  }

  handleFormChange (formData) {
    this.formData = Object.assign({}, this.formData, formData);
  }

  renderEdit (date, note) {
    return (<View ref="formView"> 
              <Form
                  ref='editNote'
                  onFocus={this.handleFormFocus.bind(this)}
                  onChange={this.handleFormChange.bind(this)}
                  label="Edit Note">
                    <DatePickerField ref='date' date={date}
                      minimumDate={new Date('1/1/1900')}
                      maximumDate={new Date()} mode='date' placeholder='Date Acquired'/>
                    <InputField ref='note' placeholder='Your Note' value={note} />
                </Form>
                <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
                  <Text>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { this.cancelNote() }} style={styles.button}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
            </View>);
  }

  renderNote (date, note) {
    const d = new Date(date);
    return (<View ref="NoteView"> 
              <Text>{`${d.getFullYear()}/${d.getMonth()}/${d.getDay()}`}</Text>
              <Text>{note}</Text>
              <TouchableOpacity onPress={() => { this.editNote() }} style={styles.button}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.removeNote() }} style={styles.button}>
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>);
  }

  render() {
    const { date, note } = this.props;

    return (this.state.editMode ? 
              this.renderEdit(date, note) :
              this.renderNote(date, note));
  }
}



const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(null, dispatchToProps)(Note)