import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, TouchableHighlight, Alert} from 'react-native';

import {BLANK_IMAGE, textReg} from '../utils/globalStyles';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'black',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: Object.assign({}, textReg, {
    color: 'white',
    opacity: 1,
    fontSize: 10
  }),
  photo: {
    width: 90,
    height: 90
  },
  photoView: {
    width: 90,
    height: 90,
    position: 'relative'
  }
});

export default class Photo extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount () {

    this.setState({ src: {}, init: false, error: false });
    global.storage.load({
      key: 'img',
      id: this.props.id
    }).then(res => {
      console.log('load photo', res.src);
      this.setState({ src: res.src, init: true });
    }).catch(err => {
      // console.warn('image error', err);
      this.setState({ init: true, error: true })
    });
  }

  removeImage () {
    this.renderAlert();
  }

  renderAlert () {
    Alert.alert(
      'Photo',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', onPress: () => {  }, style: 'cancel'},
        {text: 'Delete', onPress: () => { this.props.removeImage(this.props.id); }},
      ],
    );
  }

  renderImage (src) {
    return (this.state.error === true
      ? <Image source={BLANK_IMAGE}  style={styles.photo} />
      : <Image
          onError={() => { this.setState({error: true}); }}
          source={src}
          style={styles.photo} />);

  }

  render() {
    if(!this.state.init) {
      return null;
    }

    const src = {uri: this.state.src, isStatic: true};

    return (<View style={styles.photoView}>
      <TouchableHighlight onPress={() => {this.props.onPhotoClick(this.props.arrayID);}}>
        {this.renderImage(src)}
      </TouchableHighlight>
      <TouchableOpacity onPress={() => { this.removeImage(); }} style={styles.button}>
        <Text style={styles.buttonText}>X</Text>
      </TouchableOpacity>
    </View>);
  }
}