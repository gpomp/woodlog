'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Form, InputField,
        Separator, SwitchField, LinkField ,
        PickerField, DatePickerField
      } from 'react-native-form-generator';
import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

import BottomNav from '../components/BottomNav';

export const SAVE = "save";
export const CANCEL = "cancel";
export const ADDPHOTO = "addPhoto";

const IPOptions = {
  title: 'Add photo to album...',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'woodlog'
  }
};

class Edit extends Component {

  constructor(props) {
    super(props);
    this.formData = {};
  }

  handleFormFocus (formData) {

  }

  handleFormChange (formData) {
    this.formData = formData;
  }

  componentDidUpdate(prevProps, prevState) { 
    if(prevProps.id !== this.props.id) {
      if(this.props.id !== -1) {
        NavActions.Tree({id: this.props.id});
      } else {
        NavActions.List();
      }
    }
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
        this.props.actions.change(this.formData);
      break;
      case ADDPHOTO:
        this.showImagePicker();
      break;
    }

    
  }

  showImagePicker () {
    ImagePicker.showImagePicker(IPOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        
      }
    });
  }

  render () {
    return(
      <View style={styles.container}>
        <Form
          ref='editTree'
          onFocus={this.handleFormFocus.bind(this)}
          onChange={this.handleFormChange.bind(this)}
          label="Bonsai info">
            <InputField ref='name' placeholder='Bonsai Name'/>
            <InputField ref='species' placeholder='Bonsai Type'/>
            <InputField 
              ref='age' placeholder='Age'
              validationFunction = {(value) => { return !isNaN(value); }}
            />
            <InputField ref='potType' placeholder='pot Type'/>
            <InputField ref='style' placeholder='pot Type'/>
            <InputField ref='height' placeholder='Height'/>
            <InputField ref='trunkWidth' placeholder='Trunk Width'/>
            <InputField ref='canopyWidth' placeholder='Canopy Width'/>
            <InputField ref='Source' placeholder='Source'/>
            <DatePickerField ref='date'
              minimumDate={new Date('1/1/1900')}
              maximumDate={new Date()} mode='date' placeholder='Date Acquired'/>
          </Form>
          <BottomNav 
            items={ [ { label: 'Add Photo', key: 'addPhoto' }, { label: 'Save', key: 'save' }, { label: 'Cancel', key: 'cancel' } ] } 
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