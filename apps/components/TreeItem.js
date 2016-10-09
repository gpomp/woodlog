import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Image, Animated, Easing} from 'react-native';

import {REG_PADDING, BLANK_IMAGE, textReg as textStyle, width, height} from '../utils/globalStyles';

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  button: {
    
  },
  image: {
    height: 200,
    width: width - REG_PADDING * 2
  },
  blankImage: {
    width: width - REG_PADDING * 2,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorTree: Object.assign({
    letterSpacing: 2,
    backgroundColor: 'rgba(0,0,0,0)'
  }, textStyle)
});

export default class TreeItem extends Component {
  constructor(props) {
    super(props);

    this.state = { y: new Animated.Value(this.props.fromY), opacity: new Animated.Value(this.props.fromOpacity) };
  }

  componentWillMount () {
    this.setState({ init: false, error: false });
    this.imgSRC = {};
    if(this.props.photos.length > 0) {
      const pID = this.props.photos[0];
      global.storage.load({
        key: 'img',
        id: pID
      }).then(res => {
        this.imgSRC = {uri: res.src, isStatic: true, width, height};
        this.setState({ init: true });
      }).catch(err => {
        // console.warn('image error', err);
        this.setState({ init: true, error: true })
      });
    } else {
      this.setState({ init: true, error: true })
    }
  }

  componentDidMount () {
  }

  animateIn () {
    this.state.opacity.setValue(this.props.fromOpacity);
    this.state.y.setValue(this.props.fromY);
    const id = this.props.ukey;

    Animated.parallel([
      Animated.timing(this.state.y, {
        toValue: this.props.toY,
        easing: Easing.inOut(Easing.exp),
        duration: 1000,
        delay: id * 100
      }),
      Animated.timing(this.state.opacity, {
        toValue: this.props.toOpacity,
        duration: 1000,
        delay: id * 100
      })
    ]).start();
  }

  animateOut () {
    Animated.parallel([
      Animated.timing(this.state.y, { 
        toValue: this.state.y + 20,
        easing: Easing.out(Easing.exp),
        duration: 300
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300
      })
    ]).start();
  }

  renderImage (label) {
    const childrens = (
      <Image
        resizeMode="cover" 
        source={BLANK_IMAGE}
        style={styles.blankImage} >
          <Text style={styles.errorTree}>{label.toUpperCase()}</Text>
      </Image>
      );


    return (this.props.photos.length > 0 && this.state.error !== true) ?
      <Image 
        onError={() => { this.setState({error: true}); }}
        resizeMode="cover" 
        source={this.imgSRC}
        style={styles.image} />
      : childrens;
  }

  render() {
    const { ukey, label } = this.props;
    if(!this.state.init) {
      return null;
    }

    return (
      <Animated.View style={[this.props.styles, styles.view, { 
        opacity: this.state.opacity, 
        transform: [{translateY: this.state.y}] 
      }]}>
        <TouchableHighlight key={ukey} onPress={() => { this.props.onNavClick(ukey) }} style={styles.button}>
          {this.renderImage(label === null ? '' : label)}
        </TouchableHighlight>
      </Animated.View>
      );
    
  }
}

TreeItem.defaultProps = {
  fromOpacity: 0,
  toOpacity: 1,  
  fromY: 0,
  toY: 0,
  styles: {}
};