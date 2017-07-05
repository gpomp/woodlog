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
    width: 33,
    height: 33,
    borderRadius:16.5,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'white'
  },
  img: {
    width: 8,
    height: 8
  }
  });

module.exports = Icon