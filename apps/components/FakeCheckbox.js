import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import {BORDER_COLOR, textReg, TRADE_GOTHIC} from '../utils/globalStyles';

class FakeCheckbox extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      checked: false
    };
  }

  componentDidMount () {
    this.setState({checked: this.props.checked});
  }

	render() {
		return(
      <TouchableOpacity onPress={() => { 
        this.setState({checked: !this.state.checked});
        this.props.onPress(!this.state.checked); 
      }} style={styles.button}>
        <Text style={styles.textButton}>{this.state.checked ? '✓' : ''} {this.props.text}</Text>
      </TouchableOpacity>
    )
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
  },
  button: {
    margin: 3,
    borderBottomColor: BORDER_COLOR,
    borderBottomWidth: 1,
  },
  textButton: Object.assign({}, textReg, {
    fontFamily: TRADE_GOTHIC,
    fontSize: 15,
    opacity: 1
  })
  });

module.exports = FakeCheckbox