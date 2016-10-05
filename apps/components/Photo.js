import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, TouchableHighlight} from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 5,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3
  },
  photo: {
    width: 100,
    height: 100
  },
  photoView: {
    width: 100
  }
});

export default class Photo extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount () {

    this.setState({ src: {}, init: false });
    global.storage.load({
      key: 'img',
      id: this.props.id
    }).then(res => {
      this.setState({ src: res.src, init: true });
    });
  }

  removeImage () {
    this.props.removeImage(this.props.id);
  }

  render() {
    if(!this.state.init) {
      return null;
    }

    const src = {uri: this.state.src, isStatic: true};

    return (<View style={styles.photoView}>
      <TouchableHighlight onPress={() => {this.props.onPhotoClick(this.props.arrayID);}}>
        <Image source={src}  style={styles.photo} />
      </TouchableHighlight>

      <TouchableOpacity onPress={() => { this.removeImage(); }} style={styles.button}>
        <Text>X</Text>
      </TouchableOpacity>
    </View>);
  }
}