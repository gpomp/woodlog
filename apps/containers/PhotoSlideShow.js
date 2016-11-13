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

import Icon from '../components/Icon';


export default class PhotoSlideShow extends Component {

  constructor(props) {
    super(props);
    
    this.onRender = false;
    this.imgList = [];
  }

  componentWillMount () {

    this.updatePhotosList();
  }

  componentWillUpdate (nextProps, nextState) {
    if(!this.onRender) {
      this.updatePhotosList();
    }     
  }
 
  updatePhotosList () {
    this.imgList = [];
    // this.setState({imageList: []});
    storage.getBatchDataWithIds({
      key: 'img', 
      ids: this.props.photos
    }).then(res => {
      this.imgList = res;
      this.onRender = true;
      this.forceUpdate();
      // this.setState({ready: true});
      // this.setState({imageList: res});
    });
  }

  componentDidUpdate() {
    this.onRender = false;
  }

  getImageList () {
    return this.imgList.map((p, i) => {
      const path = `${global.targetFilePath}/${p.src}`;
      const src = {uri: path};
      console.log('slideshow path', path);
      return(
          <Image resizeMode="cover" key={`ss-${i}`} source={src} style={[styles.viewStyle, { height: 203 }]} />
      );
    });
  }

  render () {
    console.log('render photos', this.imgList);
    return(<Animated.View style={[{height: 203, width, position: 'absolute', top: 0, left: 0, overflow:'hidden'}, {transform: [{translateY: this.props.y}] }]}>
      <Swiper style={styles.wrapper} showsButtons={false} onMomentumScrollEnd={(e, state) => { this.props.onChangePicture(state.index); }}>
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