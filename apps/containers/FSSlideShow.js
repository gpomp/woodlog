'use strict'
const BACK_IMAGE = require('../../assets/back_grey.png');
import React, {Component} from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Animated, Easing, TouchableHighlight
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import Icon from '../components/Icon';

import {textReg, width, height, BLANK_IMAGE, REG_PADDING} from '../utils/globalStyles';


class FSSlideShow extends Component {

  constructor(props) {
    super(props);
    
    this.onRender = false;
    this.imgList = [];
    this.state = {
      opacity: new Animated.Value(0),
      isLoading: false
    }
  }

  componentWillMount () {
    // this.updatePhotosList();
    this.props.actions.showPhotos(this.props.photos);
  }

  componentWillUpdate (nextProps, nextState) {
    
    // if(!this.onRender && this.props.photos.length !== 0) {
    //   
    // }     
  }

  componentDidMount () {
    this.animateIn();
  }

  animateIn () {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 1000
    }).start();
  }

  animateOut (duration = 1000) {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: duration
    }).start();
  }

  getImageList () {
    return this.props.imgList.map((p, i) => {
      const path = `${global.targetFilePath}/${p.src}`;
      const src = {uri: path};
      // console.log('slideshow path', path);
      return(
          <PhotoView 
            resizeMode="contain" 
            key={`ss-${i}`} 
            source={src} 
            style={{ height, width }}
            resizeMode='contain'
            minimumZoomScale={1}
            maximumZoomScale={2} />
      );
    })
  }

  render () {
    return(<Animated.View 
      style={{height, width, flex: 1, alignItems:'center', opacity: this.state.opacity }}>
      <View style={{width, overflow:'hidden'}}>        
          <Swiper style={styles.wrapper} showsButtons={false}>
            {this.getImageList()}
          </Swiper>
      </View>
      <Icon src={BACK_IMAGE} onPress={() => { NavActions.pop(); }} 
                  styles={{ top: 20, left: 20 }}/>
    </Animated.View>);    
  }

}

const styles =  StyleSheet.create({
  wrapper: {
    flex: 0,
    height,
    backgroundColor: '#383735'
  },
  slide: {
    height
  },
  blankImage: {
    flex: 1,
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorTree: Object.assign({
    letterSpacing: 2,
    backgroundColor: 'rgba(0,0,0,0)'
  }, textReg)
});

const stateToProps = (state) => {
  return {
    imgList: state.photos.list,
    initialized: state.photos.initialized,
    isPending: state.photos.isPending
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

FSSlideShow.defaultProps = {
  imgList: [],
  initialized: false,
  isPending: false
}

export default connect(stateToProps, dispatchToProps)(FSSlideShow)