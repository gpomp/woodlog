import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated, Easing} from 'react-native';

import { width, REG_PADDING, textReg } from '../utils/globalStyles';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row', 
		alignItems: 'flex-start', 
		justifyContent: 'space-around', 
		flex: 0, 
		width: width
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

  componentWillMount () {
    this.state = { opacity: this.props.buttons.map(v => {
    	return new Animated.Value(0);
    }), tx: this.props.buttons.map(v => {
    	return new Animated.Value(40);
    }) };
  	
  }

  animateIn () {
  	this.state.opacity.map(anim => anim.setValue(0));
  	this.state.tx.map(anim => anim.setValue(40));

  	Animated.parallel([
  		Animated.stagger(100, this.state.opacity.map(anim => {
  			return Animated.timing(anim, {
  				toValue: 1,
        	duration: 300
  			})
  		})),
  		Animated.stagger(100, this.state.tx.map(anim => {
  			return Animated.timing(anim, {
  				toValue: 0,
        	duration: 300,
        	easing: Easing.inOut(Easing.exp)
  			})
  		}))
  	]).start();
  }

  animateOut (cb = null) {
  	Animated.parallel([
  		Animated.stagger(50, this.state.opacity.map(anim => {
  			return Animated.timing(anim, {
  				toValue: 0,
        	duration: 100
  			})
  		}))
  	]).start(event => {
  		if(event.finished) {
  			if(cb !== null) {
  				cb();
  			}        
      }
  	});
  }

  getButtons () {
  	let btns = this.props.buttons.map((navItem, i) => {
    	const btn = (<TouchableOpacity key={navItem.key} onPress={() => { this.props.onNavClick(navItem.key) }} style={styles.button}>
          <Animated.Text
	          style={[styles.textButton, { 
		    			opacity: this.state.opacity[i],
		    			transform: [{translateY: this.state.tx[i]}] 
  					}]}>
  						{navItem.label.toUpperCase()}
					</Animated.Text>
	      </TouchableOpacity>);

    	return btn;
    });

    return btns;
  }

  render() {
    return (
      <View style={styles.container}>
      	{this.getButtons()}
      </View>
    );
  }
}