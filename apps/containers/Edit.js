'use strict'
const ADD_IMAGE = require('../../assets/add_white.png');
const BACK_IMAGE = require('../../assets/back.png');

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  findNodeHandle,
  ScrollView,
  View,
  StyleSheet, 
  Animated, 
  Easing,
  TextInput,
  DeviceEventEmitter,
  Dimensions,
  StatusBar
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import t from 'tcomb-form-native';

import * as TreeActions from '../actions/treeActions';

import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';

import {
  container as ctnStyles, 
  contentContainer, 
  formStyleSheet, 
  bigFormStyleSheet,
  mediumFieldSS,
  dateFieldSS,
  autoFieldSS,
  nestedStructSS,
  formatDate,
  width,
  height,
  REG_PADDING
} from '../utils/globalStyles';

import {mergeDeep} from '../utils/utils';
import datepicker from '../components/DatePickerCustomTemplate';
import TextBoxCustomTemplate from '../components/TextBoxCustomTemplate';

const Form = t.form.Form;
t.form.Form.stylesheet = formStyleSheet;

const TreeStruct = {
  name: t.String,
  type: t.maybe(t.String),
  age: t.maybe(t.Number),
  potType: t.maybe(t.String),
  style: t.maybe(t.String),
  potSize: t.struct({
    width: t.maybe(t.Number),
    height: t.maybe(t.Number),
    depth: t.maybe(t.Number)
  }),
  height: t.maybe(t.Number), 
  trunkWidth: t.maybe(t.Number), 
  canopyWidth: t.maybe(t.Number), 
  date: t.maybe(t.Date),
  Source: t.maybe(t.String)
};

const Tree = t.struct(TreeStruct);

const field = {
  autoCapitalize: 'characters'
};

const isLabel = {
  name: false,
  type: false,
  age: false,
  potType: false,
  style: false,
  height: true,
  trunkWidth: true,
  canopyWidth: true,
  Source: true,
  date: true
}

const fieldList = ['name', 'type', 'age', 'potType', 'style', 'potSize.width', 'potSize.height', 'potSize.depth', 'height', 'trunkWidth', 'canopyWidth', 'Source', 'date'];

const ph = {
  name: 'BONSAI NAME',
  type: 'BONSAI TYPE',
  age: 'BONSAI AGE',
  potType: 'POT TYPE',
  style: 'BONSAI STYLE',
  height: 'HEIGHT',
  trunkWidth: 'TRUNK WIDTH',
  canopyWidth: 'CANOPY WIDTH',
  Source: 'PROVENANCE',
  date: 'COLLECTED ON'
};

const ss = {
  name: { s: bigFormStyleSheet, opts: {  }},
  potSize: { s: nestedStructSS },
  height: { s: mediumFieldSS, opts: {  }},
  trunkWidth: { s: mediumFieldSS, opts: {  }},
  canopyWidth: { s: mediumFieldSS, opts: {  }},
  date: { s: dateFieldSS, 
    opts: {
      template: datepicker,
      config: {
        format: formatDate
      }, multiline: true
    }
  },
  Source: {s: autoFieldSS, opts: {  }}
}

const formOptions = {
  auto: 'placeholders',
  autoCapitalize: 'characters',
  fields: {},
  stylesheet: formStyleSheet
};

for(var name in TreeStruct) {
  let copy = Object.assign({}, field);
  if(isLabel[name]) {
    copy.label = ph[name];
    copy.placeholder = '';
  } else {
    copy.placeholder = ph[name];
  }
  
  if(ss[name]) {
    copy.stylesheet = mergeDeep({}, formStyleSheet);
    copy.stylesheet = mergeDeep(copy.stylesheet, ss[name].s);
    copy = mergeDeep(copy, ss[name].opts);

  }

  formOptions.fields[name] = copy;
}

const potFO = {
  width: {
    autoCapitalize: 'characters',
    label: 'POT SIZE',
    placeholder: 'W\"',
    help: 'x'
  },
  height: {
    autoCapitalize: 'characters',
    placeholder: 'H\"',
    help: 'x'
  },
  depth: {
    autoCapitalize: 'characters',
    placeholder: 'D\"'
  }
}

const nestedst = mergeDeep({}, formStyleSheet);
nestedst = mergeDeep(nestedst, nestedStructSS);

formOptions.fields.potSize = {
  stylesheet: nestedst,
  fields: potFO
}

export const SAVE = "save";
export const CANCEL = "cancel";

class Edit extends Component {

  constructor(props) {
    super(props);

    let count = 0;

    for(let i = 0; i < fieldList.length; i++) {
      this.addNextField(fieldList[i], i + 1);
    }

    this.state = { scale: new Animated.Value(1.2), opacity: new Animated.Value(0) };

    this.formData = {};
  }

  addNextField(name, count) {
    let inputOpt;
    if(count < fieldList.length - 1) {
      if(name.indexOf('.') > -1) {
        const names = name.split('.');
        inputOpt = formOptions.fields[names[0]].fields[names[1]];
      } else {
        inputOpt = formOptions.fields[name];
      }

      inputOpt.onSubmitEditing = () => {
        this.refs.editTree.getComponent(fieldList[count]).refs.input.focus();
      };

      inputOpt.onFocus = () => {
        this.inputFocused(name);
      }

      // console.log('addNextField', name, fieldList[count]);
    }
  }

  componentWillMount() {
    this.formData = Object.assign({}, this.props.tree, this.formData);
    this.formData.date = new Date(this.formData.date);
  }

  componentDidMount () {
    this.animateIn();
  }

  inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(this.refs.editTree.getComponent(refName).refs.input),
        200, //additionalOffset
        true
      );
    }, 50);
  }

  componentWillUpdate(nextProps) {
    
  }

  componentDidUpdate(prevProps, prevState) { 
    // if(prevProps.id !== this.props.id) {
      
      if(this.props.id !== -1) {
        this.animateOut(() => { NavActions.Tree({nextId: this.props.id, imgPos: 0}); });
      } else {
        this.animateOut(NavActions.List({back: true}));
      }
      
    // }
  }

  animateIn () {
    Animated.parallel([
      Animated.timing(this.state.scale, {
        duration: 1000,
        toValue: 1,
        easing: Easing.out(Easing.exp)
      }),
      Animated.timing(this.state.opacity, {
        duration: 1000,
        toValue: 1,
        easing: Easing.out(Easing.exp)
      })
    ]).start(event => {
      if(event.finished) {
        // this.refs.bottomNav.animateIn();
      }
    });
  }

  animateOut (cb = null) {
    // this.refs.bottomNav.animateOut();
    Animated.parallel([
      Animated.timing(this.state.scale, {
        duration: 500,
        toValue: 1.2,
        easing: Easing.in(Easing.exp)
      }),
      Animated.timing(this.state.opacity, {
        duration: 500,
        toValue: 0,
        easing: Easing.in(Easing.exp)
      })
    ]).start(event => {
      if(event.finished) {
        if(cb !== null) {
          cb();
        }
      }
    });
  }

  onChange (value) {
  }

  onNavClick (key) {
    switch(key) {
      case CANCEL:
        if(this.props.id !== -1) {
          this.animateOut(NavActions.Tree({nextId: this.props.id, imgPos: 0 }));
        } else {
          this.animateOut(NavActions.List({back: true}));
        }
      break;
      case SAVE:
        const validation = this.refs.editTree.validate();
        if(validation.errors.length > 0) {

        } else {
          this.formData = Object.assign(this.formData, validation.value);

          for(const prop in this.formData) {
            if(this.formData[prop] === null) {
              this.formData[prop] = '';
            }
          }
          this.props.actions.change(this.formData, this.props.id);
        }
      break;
    }
  }

  cancelForm () {
    if(this.props.id !== -1) {
      this.animateOut(NavActions.Tree({nextId: this.props.id, imgPos: 0 }));
    } else {
      this.animateOut(NavActions.List({back: true}));
    }
  }

  validateForm () {
    const validation = this.refs.editTree.validate();
      if(validation.errors.length > 0) {

      } else {
        this.formData = Object.assign(this.formData, validation.value);

        for(const prop in this.formData) {
          if(this.formData[prop] === null) {
            this.formData[prop] = '';
          }
        }
        this.props.actions.change(this.formData, this.props.id);
      }
  }

  render () {
    //const { name, species, age, potType, style, height, trunkWidth, canopyWidth, Source, date } = this.props.tree;
    return(
      <ScrollView style={{ flex: 1 }}
        ref="scrollView"
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode='on-drag'>
          <StatusBar hidden={true} />
          <Animated.View style={{
            opacity: this.state.opacity, 
            transform: [{scale: this.state.scale}]
          }}
           onStartShouldSetResponderCapture={(e) => {
            const focusField = TextInput.State.currentlyFocusedField();
            if (focusField != null && e.nativeEvent.target != focusField){
               TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
            }
          }}>
            <Form
              ref="editTree"
              type={Tree}
              options={formOptions}
              value={this.formData}
              style={styles.formStyles}
              onChange={this.onChange.bind(this)}
            />
          </Animated.View>
          <View style={{marginTop:40}}>
            <Icon src={ADD_IMAGE} onPress={() => { this.validateForm(); }}
              ctnStyles={{ opacity: this.state.opacity }}
              styles={{top: 0, left: 40, backgroundColor: '#383735'}}/>
            <Icon src={BACK_IMAGE} onPress={() => { this.cancelForm(); }}
              ctnStyles={{ opacity: this.state.opacity }}
              styles={{top: 0, right: 40, backgroundColor: '#383735'}}/>
          </View>

            {/*<BottomNav 
                          ref="bottomNav"
                          buttons={ [ { label: 'Save', key: 'save' }, { label: 'Cancel', key: 'cancel' } ] } 
                          onNavClick = {this.validateForm();} />*/}
      </ScrollView>
    );
  }
}

const stateToProps = (state) => {
  return {
    id: state.tree.id,
    tree: state.tree.rawData
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

const styles =  StyleSheet.create({
  container: Object.assign({  }, ctnStyles, { padding: 0 }),
  formStyles: {
    flexDirection: 'row',
    height,
    width: width - REG_PADDING * 2
  },
  contentContainer: Object.assign({}, contentContainer, { width, padding: 0, margin: 0 })
});

export default connect(stateToProps, dispatchToProps)(Edit)