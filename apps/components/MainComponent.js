import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicatorIOS,
  TouchableOpacity
} from 'react-native';
import { def_action } from '../actions/exActions';

class MainComponent extends Component {


	render() {
		return(
		<View style={styles.container}>
			<Text>1. {this.props.words} / {this.props.count}</Text>
		</View>)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F1F1F1',
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  }
  });

module.exports = MainComponent