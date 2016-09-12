import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    padding: 10,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  }
});

export default class BottomNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items } = this.props;

    const navItems = items.map((navItem) => {
    	return <TouchableOpacity key={navItem.key} onPress={() => { this.props.onNavClick(navItem.key) }} style={styles.button}>
          <Text>{navItem.label}</Text>
        </TouchableOpacity>
    });

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      	{navItems}
      </View>
    );
  }
}