import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3
  },
  photo: {
    borderRadius: 75,
    width: 150,
    height: 150
  },
  photoView: {

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
    console.log('remove image photo');
    this.props.removeImage(this.props.id);
  }

  render() {
    if(!this.state.init) {
      return null;
    }

    const src = {uri: this.state.src, isStatic: true};

    return (<View style={styles.photoView}>
      <Image source={src}  style={styles.photo} />
      <TouchableOpacity onPress={() => { this.removeImage(); }} style={styles.button}>
        <Text>Remove</Text>
      </TouchableOpacity>
    </View>);
  }
}