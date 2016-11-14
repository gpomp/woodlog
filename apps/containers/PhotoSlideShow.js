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
    this.state = {
      width: new Animated.Value(width),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      isLoading: false
    }
  }

  componentWillMount () {
    this.setState({isLoading: true});
    // this.updatePhotosList();
  }

  componentWillUpdate (nextProps, nextState) {
    if(this.state.isLoading) {
      this.updatePhotosList();
    }
    // if(!this.onRender && this.props.photos.length !== 0) {
    //   
    // }     
  }
 
  updatePhotosList () {
    console.log('updatePhotosList');
    this.imgList = [];
    // this.setState({imageList: []});
    storage.getBatchDataWithIds({
      key: 'img', 
      ids: this.props.photos
    }).then(res => {
      this.imgList = res;
      this.setState({isLoading: false});
      // this.setState({ready: true});
      // this.setState({imageList: res});
    });
  }

  componentDidUpdate() {
    // this.onRender = false;
  }

  getImageList () {
    return this.imgList.map((p, i) => {
      const path = `${global.targetFilePath}/${p.src}`;
      const src = {uri: path};
      // console.log('slideshow path', path);
      return(
          <Animated.Image resizeMode="cover" key={`ss-${i}`} source={src} style={{ height: 203, width: this.state.width }} />
      );
    })
  }

  animateIn () {
    this.state.opacity.setValue(1);
    this.state.width.setValue(width - 40);

    Animated.timing(this.state.width, {
      toValue: width,
      easing: Easing.inOut(Easing.exp),
      duration: 1000
    }).start();
  }

  animateOut (cb = null) {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 250
    }).start((event) => {
      if(event.finished) {
        if(cb !== null) {
          cb();
        }        
      }
    });
  }
  // , opacity: this.state.opacity
  render () {
    return(<Animated.View 
      style={[{height: 203,position: 'absolute', top: 0, left: 0, overflow:'hidden', flex: 1, width, alignItems:'center'}, {transform: [{translateY: this.props.y}], opacity: this.state.opacity }]}>
      <Animated.View style={{width: this.state.width, overflow:'hidden'}}>
        <Swiper style={styles.wrapper} showsButtons={false} onMomentumScrollEnd={(e, state) => { this.props.onChangePicture(state.index); }}>
          {this.getImageList()}
        </Swiper>
      </Animated.View>
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
  }
});