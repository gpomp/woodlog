import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableHighlight, Image, Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3
  },
  image: {
    flex: 1,
    width,
    height: 200,    
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class TreeItem extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount () {
    this.setState({ init: false });
    this.imgSRC = {};
    if(this.props.photos.length > 0) {
      const pID = this.props.photos[0];
      global.storage.load({
        key: 'img',
        id: pID
      }).then(res => {
        this.imgSRC = {uri: res.src, isStatic: true};
        this.setState({ init: true });
      });
    } else {
      this.setState({ init: true })
    }
  }

  render() {
    const { ukey, label } = this.props;
    console.log('tree item state!', this.state.init);
    if(!this.state.init) {
      return null;
    }

    const childrens = <Text>{label}</Text>;

    return (<TouchableHighlight key={ukey} onPress={() => { this.props.onNavClick(ukey) }} style={styles.button}>
              <View>
                {(this.props.photos.length > 0) ?
                  <Image resizeMode="cover" source={this.imgSRC} style={styles.image} />
                  : childrens}
                
              </View>
            </TouchableHighlight>);
  }
}