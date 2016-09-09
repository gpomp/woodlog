'use strict'

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

class Edit extends Component {

  constructor(props) {
    super(props);
  }

  handleFormFocus (formData) {

  }

  handleFormChange (formData) {
    console.log(formData);
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
              <InputField ref='type' placeholder='Bonsai Type'/>
              <InputField 
                ref='age' placeholder='Age'
                validationFunction = {(value) => { return !isNaN(value); }}
                />
            </Form>
      </View>
    );
  }
}

const stateToProps = (state) => {
  return {}
}

const dispatchToProps = (dispatch) => {
  return {}
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
      justifyContent: 'center'
  }
});

export default connect(stateToProps, dispatchToProps)(Edit)