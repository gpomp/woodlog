import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicatorIOS,
  TouchableOpacity,
  Animated
} from 'react-native';

class Icon extends Component {


	render() {
		return(
		<Animated.View style={[styles.container, this.props.styles, this.props.ctnStyles]}>
      <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={() => { this.props.onPress(); }}>
        <Image style={styles.img} source={this.props.src} />
      </TouchableOpacity>
    </Animated.View>)
	}
}

Icon.defaultProps = {
  styles: {},
  src: {}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius:20,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  img: {
    width: 20,
    height: 20
  }
  });

module.exports = Icon