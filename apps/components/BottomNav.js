import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import { width, REG_PADDING, textReg } from '../utils/globalStyles';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'space-around', 
		flex: 1, 
		width: width - REG_PADDING * 2,
		marginTop: 30
	},
	button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3
  },
  textButton: Object.assign({}, textReg, {
  	fontSize: 20,
  	opacity: 1
  })
});

export default class BottomNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items } = this.props;

    const navItems = items.map((navItem) => {
    	return <TouchableOpacity key={navItem.key} onPress={() => { this.props.onNavClick(navItem.key) }} style={styles.button}>
          <Text style={styles.textButton}>{navItem.label.toUpperCase()}</Text>
        </TouchableOpacity>
    });

    return (
      <View style={styles.container}>
      	{navItems}
      </View>
    );
  }
}