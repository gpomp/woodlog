import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3
  }
});

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { ukey, label } = this.props;
    return (<TouchableOpacity key={ukey} onPress={() => { this.props.onNavClick(ukey) }} style={styles.button}>
              <Text>{label}</Text>
            </TouchableOpacity>);
  }
}