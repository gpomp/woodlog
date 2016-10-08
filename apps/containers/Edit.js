'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import t from 'tcomb-form-native';

import * as TreeActions from '../actions/treeActions';

import BottomNav from '../components/BottomNav';

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
  height: { s: mediumFieldSS, opts: { template: TextBoxCustomTemplate }},
  trunkWidth: { s: mediumFieldSS, opts: { template: TextBoxCustomTemplate }},
  canopyWidth: { s: mediumFieldSS, opts: { template: TextBoxCustomTemplate }},
  date: { s: dateFieldSS, 
    opts: {
      template: datepicker,
      config: {
        format: formatDate
      }, multiline: true
    }
  },
  Source: {s: autoFieldSS, opts: { template: TextBoxCustomTemplate }}
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
    template: TextBoxCustomTemplate,
    autoCapitalize: 'characters',
    label: 'POT SIZE',
    placeholder: 'W\"',
    help: 'x'
  },
  height: {
    template: TextBoxCustomTemplate,
    autoCapitalize: 'characters',
    placeholder: 'H\"',
    help: 'x'
  },
  depth: {
    template: TextBoxCustomTemplate,
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
    this.formData = {};
  }

  componentWillMount() {
    this.formData = Object.assign({}, this.props.tree, this.formData);
    this.formData.date = new Date(this.formData.date);
  }

  componentWillUpdate(nextProps) {
    
  }

  componentDidUpdate(prevProps, prevState) { 
    // if(prevProps.id !== this.props.id) {
      if(this.props.id !== -1) {
        NavActions.Tree({nextId: this.props.id});
      } else {
        NavActions.List();
      }
    // }
  }

  onChange (value) {
    console.log('value', value);
  }

  onNavClick (key) {
    switch(key) {
      case CANCEL:
        if(this.props.id !== -1) {
          NavActions.Tree({id: this.props.id});
        } else {
          NavActions.List();
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

  render () {
    //const { name, species, age, potType, style, height, trunkWidth, canopyWidth, Source, date } = this.props.tree;
    return(
      <ScrollView style={styles.container} style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Form
              ref="editTree"
              type={Tree}
              options={formOptions}
              value={this.formData}
              style={styles.formStyles}
              onChange={this.onChange.bind(this)}
            />
            <BottomNav 
              items={ [ { label: 'Save', key: 'save' }, { label: 'Cancel', key: 'cancel' } ] } 
              onNavClick = {this.onNavClick.bind(this)} />
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
  container: Object.assign({  }, ctnStyles),
  formStyles: {
    flexDirection: 'row',
    height,
    width: width - REG_PADDING * 2
  },
  contentContainer: Object.assign({}, contentContainer)
});

export default connect(stateToProps, dispatchToProps)(Edit)