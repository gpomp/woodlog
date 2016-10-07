import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';

import t from 'tcomb-form-native';

import { width, 
          height, 
          REG_PADDING, 
          container as ctnStyles, 
          textReg, 
          TEXT_PADDING, 
          BIG_FONT_SIZE, 
          formStyleSheet,
          dateFieldSS,
          mediumFieldSS,
          monthNames,
          formatDate } from '../utils/globalStyles';

import {mergeDeep} from '../utils/utils';
import datepicker from '../components/DatePickerCustomTemplate';

const Form = t.form.Form;
t.form.Form.stylesheet = formStyleSheet;

const NoteModel = t.struct({
  note: t.String,
  date: t.Date
});

const ctnWidth = width - REG_PADDING * 2 - TEXT_PADDING * 2;

let datess = mergeDeep({}, formStyleSheet);
datess = mergeDeep(datess, dateFieldSS);

let notess = mergeDeep({}, formStyleSheet);
notess = mergeDeep(notess, {
  textbox: {
    formGroup: {
      normal: {
        backgroundColor: 'white'
      }
    },
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
  textButton: Object.assign({}, textReg, {
    fontSize: 15,
    opacity: 1
  }),
  title: Object.assign({}, textReg, {
    opacity: 1
  }),
  btnCtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    flex: 1, 
    width: ctnWidth
  },
  ctn: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    flex: 1, 
    width: ctnWidth
  },
  textCtn: {
    flex: ctnWidth * 0.75
  },
  textText: Object.assign({}, textReg, {
    opacity: 1,
    fontSize: 11
  }),
  dateCtn: {
    flex: ctnWidth * 0.25
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
              <View style={styles.btnCtn}>
                <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
                  <Text style={styles.textButton}>SAVE</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { this.cancelNote() }} style={styles.button}>
                  <Text style={styles.textButton}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>);
  }

  renderNote (date, note) {
    const d = new Date(date);
    return (<View style={{width: width - REG_PADDING * 2, flexDirection: 'column', alignItems: 'center'}} ref="NoteView"> 
              <View style={styles.ctn}>
                <View style={styles.textCtn}>
                  <Text style={styles.textText}>{note}</Text>
                </View>
                <View style={styles.dateCtn}>
                  <Text style={styles.textText}>{`${d.getFullYear()}`}</Text>
                  <Text style={styles.textText}>{`${monthNames[d.getMonth()]} ${d.getDate()}`}</Text>
                  <TouchableOpacity onPress={() => { this.editNote() }} style={styles.button}>
                    <Text style={styles.textButton}>EDIT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.removeNote() }} style={styles.button}>
                    <Text style={styles.textButton}>REMOVE</Text>
                  </TouchableOpacity>
                </View>
              </View>
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