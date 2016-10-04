'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View,
  StyleSheet
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, InputField,
        Separator, SwitchField, LinkField ,
        PickerField, DatePickerField
      } from 'react-native-form-generator';
import * as TreeActions from '../actions/treeActions';

import BottomNav from '../components/BottomNav';

export const SAVE = "save";
export const CANCEL = "cancel";

class Edit extends Component {

  constructor(props) {
    super(props);
    this.formData = {};
  }

  handleFormFocus (formData) {
  }

  handleFormChange (formData) {
    this.formData = Object.assign({}, this.formData, formData);
  }

  componentWillMount() {
    this.formData = Object.assign({}, this.props.tree, this.formData);
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
        this.props.actions.change(this.formData, this.props.id);
      break;
    }
  }

  render () {
    const { name, species, age, potType, style, height, trunkWidth, canopyWidth, Source, date } = this.props.tree;
    return(
      <View style={styles.container}>
        <Form
          ref='editTree'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          label="Bonsai info">
            <InputField ref='name' placeholder='Bonsai Name' value={name}/>
            <InputField ref='species' placeholder='Bonsai Type' value={species}/>
            <InputField 
              ref='age' placeholder='Age'
              value={age}
              validationFunction = {(value) => { return !isNaN(value); }}
            />
            <InputField ref='potType' placeholder='pot Type' value={potType}/>
            <InputField ref='style' placeholder='style' value={style}/>
            <InputField ref='height' placeholder='Height' value={height}/>
            <InputField ref='trunkWidth' placeholder='Trunk Width' value={trunkWidth}/>
            <InputField ref='canopyWidth' placeholder='Canopy Width' value={canopyWidth}/>
            <InputField ref='Source' placeholder='Source' value={Source}/>
            <DatePickerField ref='date'
             value={date}
              minimumDate={new Date('1/1/1900')}
              maximumDate={new Date()} mode='date' placeholder='Date Acquired'/>
          </Form>
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