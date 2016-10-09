import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated, Easing} from 'react-native';

import { width, REG_PADDING, textReg } from '../utils/globalStyles';

const styles = StyleSheet.create({
	container: {
		flex: 0, 
		width: width - REG_PADDING * 2,
		marginTop: 30
	},
	button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    backgroundColor: 'red'
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

  componentWillMount () {
  	const buttons = this.props.buttons;
    this.state = { opacity: buttons.map(v => {
    	return new Animated.Value(0);
    }), tx: buttons.map(v => {
    	return new Animated.Value(-20);
    }) };
  	
  }

  animateIn () {

  	this.state.opacity.map(anim => anim.setValue(0));
  	this.state.tx.map(anim => anim.setValue(-20));

  	Animated.parallel([
  		Animated.stagger(100, this.state.opacity.map(anim => {
  			return Animated.timing(anim, {
  				toValue: 1,
        	duration: 200
  			})
  		})),
  		Animated.stagger(500, this.state.tx.map(anim => {
  			return Animated.timing(anim, {
  				toValue: 0,
        	duration: 200
  			})
  		}))
  	]).start();
  }

  animateOut () {

  }

  getButtons () {
  	let btns = this.props.buttons.map((navItem, i) => {
    	return 
    		(<TouchableOpacity key={navItem.key} onPress={() => { this.props.onNavClick(navItem.key) }} style={styles.button}>
          <Animated.Text
	          style={[styles.textButton, { 
		    			opacity: this.state.opacity[i],
		    			transform: [{translateX: this.state.tx[i]}] 
  					}]}>
  						{navItem.label.toUpperCase()}
					</Animated.Text>
	      </TouchableOpacity>);
    });

    return btns;
  }

  render() {
  	console.log('RENDER BOTTOMNAV')
    return (
      <View style={styles.container}>
      	<Text>THIS IS BOTTOM NAV</Text>
      	{this.getButtons()}
      </View>
    );
  }
}