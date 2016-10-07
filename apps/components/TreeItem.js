import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Image, Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');

import {REG_PADDING, BLANK_IMAGE, textReg as textStyle} from '../utils/globalStyles';

const styles = StyleSheet.create({
  button: {
    marginBottom: 3
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

    return (<TouchableHighlight key={ukey} onPress={() => { this.props.onNavClick(ukey) }} style={styles.button}>
                {this.renderImage(label === null ? '' : label)}
            </TouchableHighlight>);
    
  }
}