import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  
});

export default class Note extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { date, text } = this.props;
    return (
      <Text>{date} {text}</Text>
    );
  }
}