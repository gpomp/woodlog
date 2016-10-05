import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';

import t from 'tcomb-form-native';

const Form = t.form.Form;

const NoteModel = t.struct({
  date: t.Date,
  note: t.String
});

const formOptions = {
  auto: 'placeholders'
};

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

    this.defaultValues = {
      note: this.props.note,
      date: new Date(this.props.date)
    }
  }

  editNote () {
    this.setState({ editMode: !this.state.editMode });

  }

  saveNote () {
    const validation = this.refs.editNote.validate();
    if(validation.errors.length > 0) {

    } else {
      this.formData = Object.assign({}, validation.value);
      this.props.actions.saveNote(this.formData, this.props.arrayID);
      this.setState({ saving: true });
    }

    
  }

  cancelNote () {
    this.setState({ editMode: false });
  }

  removeNote () {
    this.props.actions.removeNote(this.props.arrayID);
    this.setState({ saving: true });
  }

  componentDidUpdate () {
    if(this.state.saving) {
      this.setState({ editMode: false, saving: false });
      this.props.onNoteUpdate();
    }    
  }

  renderEdit () {
    return (<View ref="formView"> 
              <Form
                ref="editNote"
                type={NoteModel}
                options={formOptions}
                value={this.defaultValues}
              />
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
              <Text>{`${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`}</Text>
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
              this.renderEdit() :
              this.renderNote(date, note));
  }
}



const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(null, dispatchToProps)(Note)