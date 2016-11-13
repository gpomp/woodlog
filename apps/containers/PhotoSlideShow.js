'use strict'

import React, {Component} from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Animated, Easing
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Swiper from 'react-native-swiper';

import {textReg, width, height} from '../utils/globalStyles';


export default class PhotoSlideShow extends Component {

  componentWillMount () {
    console.log('slide IDS', this.props.photos);
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
      const path = `${global.targetFilePath}/${p.src}`;
      const src = {uri: path};
      console.log('slideshow path', path);
      return(
          <Image resizeMode="cover" key={`ss-${i}`} source={src} style={[styles.viewStyle, { height: 203 }]} />
      );
    });
  }

  render () {
    
    if(this.state.init !== true) {
      return null;
    }

    return(<Animated.View style={[{height: 203, width, position: 'absolute', top: 0, left: 0, overflow:'hidden'}, {transform: [{translateY: this.props.y}] }]}>
      <Swiper style={styles.wrapper} showsButtons={false} index={0}>
        {this.getImageList()}
      </Swiper>
      {/*<TouchableOpacity onPress={() => { NavActions.pop(); }} style={styles.button}>
              <Text style={styles.buttonText}>X</Text>
            </TouchableOpacity>*/}
    </Animated.View>);    
  }

}

const styles =  StyleSheet.create({
  wrapper: {
    flex: 0,
    height: 203
  },
  slide: {
    height: 203
  },
  viewStyle: {
    width
  }
});