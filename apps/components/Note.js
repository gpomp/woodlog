import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated, Easing} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';
import { Actions as NavActions } from 'react-native-router-flux';

import FakeCheckbox from './FakeCheckbox'; 

import t from 'tcomb-form-native';

import ImagePicker from 'react-native-image-picker';

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
          formatDate,
          TRADE_GOTHIC,
          BORDER_COLOR } from '../utils/globalStyles';

import {mergeDeep, imgPickerResponse, addInCalendar, removeInCalendar} from '../utils/utils';
import datepicker from '../components/DatePickerCustomTemplate';
import PhotoSlideShow from '../containers/PhotoSlideShow';

const Form = t.form.Form;
t.form.Form.stylesheet = formStyleSheet;

const NoteModel = t.struct({
  note: t.String,
  date: t.Date
});

const ctnWidth = width - REG_PADDING * 2;

let datess = mergeDeep({}, formStyleSheet);
datess = mergeDeep(datess, dateFieldSS);
datess = mergeDeep(datess, {
  formGroup: {
    normal: {
      paddingLeft: 0,
      width: ctnWidth * 0.75
    }
  },
  dateTouchable: {
    normal: {
      width: ctnWidth * 0.75
    }
  },
  datepicker: {
    normal: {
      width: ctnWidth * 0.75
    }
  },
  dateValue: {
    normal: {
      fontFamily: TRADE_GOTHIC,
      fontSize: 12
    }
  },
  controlLabel: {
    normal: {
      fontFamily: TRADE_GOTHIC,
      fontSize:12,
      width: ctnWidth * 0.75
    }
  }
});

let notess = mergeDeep({}, formStyleSheet);
notess = mergeDeep(notess, {
  formGroup: {
    normal: {
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  textbox: {    
    normal: {
      height: 150,
      fontFamily: TRADE_GOTHIC,
      fontSize:12
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
      config: {
        format: formatDate
      }
    }
  }
};

const styles = StyleSheet.create({
  button: {
    margin: 3,
    borderBottomColor: BORDER_COLOR,
    borderBottomWidth: 1,
  },
  textButton: Object.assign({}, textReg, {
    fontFamily: TRADE_GOTHIC,
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
    flex: 1
  },
  ctn: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    flex: 1,
    overflow: 'hidden'
  },
  insideCtn: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'center', 
    flex: 1
  },
  textCtn: {
    width: ctnWidth * 0.75
  },
  textText: Object.assign({}, textReg, {
    fontFamily: TRADE_GOTHIC,
    opacity: 1,
    fontSize: 12,
    fontWeight: 'bold'
  }),
  dateCtn: {
    width: ctnWidth * 0.25
  }
});

class Note extends Component {
  constructor(props) {
    super(props);
    this.formData = {};
    this.state = { 
      formHeight: new Animated.Value(99999),
      noteHeight: new Animated.Value(99999),
      formOverflow: 'visible',
      onRemove: false
    };

    formOptions.fields.date.config.onToggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse (isCollapsed) {
    // console.log('toggleCollapse');
    const area = isCollapsed ? 200 : -200;
    this.props.onToggleNote(true, 0, 0, area);
    if(isCollapsed) this.props.onFocusNote(this.props.arrayID, 50);
  }

  componentWillMount() {
    this.formData = Object.assign({}, this.props, this.formData);
    this.setState({ editMode: false, saving: false });
  }

  componentDidMount () {
    this.formHeight = 0;
    this.noteHeight = 0;
    
    setTimeout(() => {
      if (!this.refs.formInside) return;
      this.refs.formInside.measure((fx, fy, width, height) => { 
        this.formHeight = height;
        this.state.formHeight.setValue(0);
        this.setState({formOverflow: 'hidden'});
      });
      if (!this.refs.noteInside) return;
      this.refs.noteInside.measure((fx, fy, width, height) => { 
        this.noteHeight = height; 
        this.state.noteHeight.setValue(this.noteHeight);
      });
    }, 0);
  }

  componentWillUpdate() {
    this.defaultValues = {
      note: (this.props.arrayID === -1) ? '' : this.props.note,
      date: new Date(this.props.date)
    }
  }

  componentDidUpdate () {
    if(this.state.saving) {
      this.setState({ editMode: false, saving: false });
      this.toggleNote(false);
      // this.props.onNoteUpdate(300);
    }

    if(this.state.onRemove === true) {
      this.props.actions.removeNote(this.props.treeID, this.props.noteID);
      this.setState({ onRemove: false });
      this.setState({ saving: true });
      this.toggleNote(false);
    }
  }

  toggleNote (showForm) {
    //this.setState({ editMode: !this.state.editMode });
    this.setState({ formOverflow: 'hidden' });
    // console.log(showForm ? this.formHeight : 0, showForm ? 0 : this.noteHeight);
    this.props.onToggleNote(showForm, this.formHeight, this.noteHeight);
    if(showForm) {
      this.refs.editNote.getComponent('note').refs.input.focus();
      this.props.onFocusNote(this.props.arrayID);
    }
    Animated.parallel([
    Animated.timing(this.state.formHeight, {
      toValue: showForm ? this.formHeight : 0,
      duration: 250,
      easing: Easing.inOut(Easing.exp)
    }),
    Animated.timing(this.state.noteHeight, {
      toValue: showForm ? 0 : this.noteHeight,
      duration: 250,
      easing: Easing.inOut(Easing.exp)
    })
    ]).start(() => {
      if(showForm) {
        this.setState({ formOverflow: 'visible' });
      }
    });
  }

  saveNote (eventID = '') {
    const validation = this.refs.editNote.validate();
    if(validation.errors.length > 0) {

    } else {
      this.formData = Object.assign({}, validation.value);
      this.props.actions.saveNote(this.props.treeID, this.props.noteID, this.formData.note, this.formData.date, eventID && eventID.length ? eventID : this.props.eventID);
      this.setState({ saving: true });
      this.toggleNote(false);
    }
  }

  cancelNote () {
    this.toggleNote(false);
  }

  removeNote () {
    // first remove all photos
    const photos = this.refs.slideShow.getWrappedInstance().getFilteredList();
    if(photos.length > 0) {
      const ids = photos.map(p => { return p.id });      
      this.props.actions.removePhoto(ids, this.props.treeID);

    }    
    this.setState({ onRemove: true });
  }

  savePhoto () {
    imgPickerResponse(this.props.noteID, (noteID, fileName = '') => {
      if(noteID === this.props.noteID) {
        this.props.actions.savePhoto(fileName, this.props.treeID, this.props.noteID);
        this.setState({ saving: true });
      }
    });
  }

  removeImage () {
    this.props.actions.removePhoto([this.refs.slideShow.getWrappedInstance().getCurrentIndex()], this.props.treeID);
    this.setState({ saving: true });
  }

  toggleInCalendar (toggle) {
    if(toggle) {
      const startDate = new Date(this.props.date);
      startDate.setHours(8);
      const endDate = new Date(this.props.date);
      endDate.setHours(20);
      //console.log('add event', startDate.toISOString(), endDate.toISOString(), this.props.note);
      addInCalendar(this.props.eventID, 'Bonsai Event', {
        notes: this.props.note,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }).then(eventID => {
        this.saveNote(eventID);
      });
    } else {
      if(this.props.eventID !== '-1') {
        removeInCalendar(this.props.eventID).then(success => {
          if(success) {
            this.saveNote('-1');
          }          
        });
      }
    }
    
  }

  render() {
    const { date, note } = this.props;
    const d = new Date(date);
    console.log(typeof this.props.eventID);
    return (
      <View style={{width: width - REG_PADDING * 2, marginBottom: 20}}> 
        <Animated.View ref="noteView" style={[styles.ctn, {height: this.state.noteHeight}]}>
          <View ref="noteInside" style={styles.insideCtn}>
            <View style={styles.textCtn}>
              <TouchableOpacity onPress={() => { this.toggleNote(true) }}>
                <Text style={styles.textText}>{note}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateCtn}>
              <TouchableOpacity onPress={() => { this.toggleNote(true) }}>
                <Text style={styles.textText}>{`${d.getFullYear()}`}</Text>
                <Text style={styles.textText}>{`${monthNames[d.getMonth()]} ${d.getDate()}`}</Text>
              </TouchableOpacity>
              {(this.props.arrayID === -1 ? null :
                <TouchableOpacity onPress={() => { this.removeNote() }} style={styles.button}>
                  <Text style={styles.textButton}>Remove</Text>
                </TouchableOpacity>)}
              
            </View>
          </View>
        </Animated.View>
        <Animated.View ref="formView" style={[{ 
          overflow: this.state.formOverflow }, 
          (this.state.formOverflow === 'hidden' ? {height: this.state.formHeight} : {})
          ]}> 
          <View ref="formInside" style={styles.ctn}>
            <View style={styles.textCtn}>
              <Form
                ref="editNote"
                type={NoteModel}
                options={formOptions}
                value={this.defaultValues}
              />
            </View>
            <View style={styles.dateCtn}>
              <TouchableOpacity onPress={() => { this.saveNote() }} style={styles.button}>
                <Text style={styles.textButton}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { this.cancelNote() }} style={styles.button}>
                <Text style={styles.textButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        {this.props.arrayID === -1 ? null :
          <FakeCheckbox text="Add this note to your calendar" onPress={(isChecked) => { this.toggleInCalendar(isChecked); }} checked={ this.props.eventID !== '-1' } />
        }
        {this.props.arrayID === -1 ? null :
        <View>
          <PhotoSlideShow 
            ref="slideShow"
            styles={{position:'relative', width: width - 40}}
            nextId={0}
            photos={this.props.photoList}
            y={0} 
            fromY={0}
            noteID={this.props.noteID}
            onAddImage={() => { this.savePhoto(); }}
            onRemImage={() => { this.removeImage(); }}
            onChangePicture={(index) => { this.currentPicture = index; }} 
            onPress={() => { NavActions.SlideShow({photos: this.props.photoList, noteID: this.props.noteID}) }}/>
        </View>}
      </View>);
  }
}



const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(null, dispatchToProps)(Note)