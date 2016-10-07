'use strict'

import React, {Component} from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Swiper from 'react-native-swiper';

import {textReg, width, height} from '../utils/globalStyles';


class PhotoSlideShow extends Component {

  componentWillMount () {
    this.setState({init: false, imageList: []});
    storage.getBatchDataWithIds({
      key: 'img', 
      ids: this.props.photos
    }).then(res => {
      this.setState({init: true, imageList: res});
    });
  }

  componentDidUpdate() {

  }

  getImageList () {
    return this.state.imageList.map((p, i) => {
      const src = {uri: p.src};

      return(
          <Image resizeMode="contain" key={`ss-${i}`} source={src} style={styles.viewStyle} />
      );
    });
  }

  render () {
    
    if(this.state.init !== true) {
      return null;
    }

    return(<View>
      <Swiper style={styles.wrapper} showsButtons={false} index={this.props.nextId}>
        {this.getImageList()}
      </Swiper>
      <TouchableOpacity onPress={() => { NavActions.pop(); }} style={styles.button}>
        <Text style={styles.buttonText}>X</Text>
      </TouchableOpacity>
    </View>);    
  }

}

const styles =  StyleSheet.create({
  wrapper: {
    
  },
  slide: {
    flex: 1
  },
  viewStyle: {
        width,
    height
  },
  button: {
    position: 'absolute',
    top: 25,
    right: 15,
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
  })
});


const stateToProps = (state) => {
  return {
    photos: state.tree.rawData.photos
  }
}

export default connect(stateToProps)(PhotoSlideShow)