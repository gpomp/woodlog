'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View,
  StyleSheet
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import t from 'tcomb-form-native';

import * as TreeActions from '../actions/treeActions';

import BottomNav from '../components/BottomNav';

const Form = t.form.Form;

const Tree = t.struct({
  name: t.String,
  type: t.maybe(t.String),
  age: t.maybe(t.Number),
  potType: t.maybe(t.String),
  style: t.maybe(t.String),
  height: t.maybe(t.Number), 
  trunkWidth: t.maybe(t.Number), 
  canopyWidth: t.maybe(t.Number), 
  Source: t.maybe(t.String), 
  date: t.maybe(t.Date)
});

const formOptions = {
  auto: 'placeholders'
};

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
    const { name, species, age, potType, style, height, trunkWidth, canopyWidth, Source, date } = this.props.tree;
    return(
      <View style={styles.container}>
          <Form
            ref="editTree"
            type={Tree}
            options={formOptions}
            value={this.formData}
          />
          <BottomNav 
            items={ [ { label: 'Save', key: 'save' }, { label: 'Cancel', key: 'cancel' } ] } 
            onNavClick = {this.onNavClick.bind(this)} />
      </View>
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
  container: {
    marginTop: 70,
    flex: 1,
      justifyContent: 'center'
  }
});

export default connect(stateToProps, dispatchToProps)(Edit)