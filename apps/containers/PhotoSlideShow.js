'use strict'
const ADD_IMAGE = require('../../assets/add.png');
const REM_IMAGE = require('../../assets/remove.png');
import Icon from '../components/Icon';
import React, {Component} from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Animated, Easing, Alert, TouchableHighlight
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';

import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import compareArrays from '../utils/utils';

import {textReg, width, height, BLANK_IMAGE, REG_PADDING, YELLOW_COLOR, TOP_IMAGE_SIZE} from '../utils/globalStyles';
const AnimatedTH = Animated.createAnimatedComponent(TouchableHighlight);


class PhotoSlideShow extends Component {

  constructor(props) {
    super(props);
    
    this.onRender = false;
    this.currentImage = -1;
    this.currentIndex = -1;
    this.imgList = [];
    this.state = {
      width: new Animated.Value(width),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      isLoading: false
    }
  }

  componentWillMount () {
    // this.setState({isLoading: true});
    // this.updatePhotosList();
    this.update();
  }

  componentDidMount () {
    this.currentIndex = this.getFilteredList().length > 0 ? this.getFilteredList()[0].id : 0;
    if(this.props.noteID !== -1) {
      this.state.opacity.setValue(1);
    }
  }

  componentWillUpdate (nextProps, nextState) {
     
  }

  componentDidUpdate (nextProps, nextState) {

  }

  update () {
  }

  getCurrentIndex () {
    return this.currentIndex;
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

  renderPhotoAlert () {
    Alert.alert(
      'Photo',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', onPress: () => {  }, style: 'cancel'},
        {text: 'Delete', onPress: () => { this.props.onRemImage(); }},
      ],
    );
  }

  animateOut (duration = 1000) {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: duration
    }).start();
  }

  getFilteredList () {
    return this.props.imgList.filter((p) => { return p.note === this.props.noteID });
  }

  getImageList () {
    return this.getFilteredList().map((p, i) => {
      const path = `${global.targetFilePath}/${p.src}`;
      const src = {uri: path};
      // console.log('slideshow path', path);
      return(
        <AnimatedTH key={`ss-${i}`} onPress={() => { this.props.onPress(); }} style={{ height: TOP_IMAGE_SIZE, width: this.state.width }}>
        <Animated.Image resizeMode="cover" source={src} style={{ height: TOP_IMAGE_SIZE, width: this.state.width }} />
        </AnimatedTH>
      );
    })
  }

  render () {
    return(<Animated.View 
      style={[{height: TOP_IMAGE_SIZE,position: 'absolute', top: 0, left: 0, overflow:'hidden', flex: 1, width, alignItems:'center'}, {transform: [{translateY: this.props.y}], opacity: this.state.opacity }, this.props.styles]}>
      <Animated.View style={{width: this.state.width, overflow:'hidden'}}>
        
        {(this.getFilteredList().length <= 0) ?
          <TouchableHighlight onPress={() => { this.props.onAddImage(); }}>
            <Image
              resizeMode="cover" 
              source={BLANK_IMAGE}
              style={styles.blankImage} >
                <Text style={styles.errorTree}>ADD AN IMAGE</Text>
            </Image>
          </TouchableHighlight> :
          <Swiper 
            style={styles.wrapper} 
            ref="swiper"
            showsButtons={false} 
            onMomentumScrollEnd={(e, state) => { 
              const a = this.getFilteredList();
              const curr = state.index;
              this.currentIndex = a[curr].id;
            }}>
            {this.getImageList()}
          </Swiper>
        }

      </Animated.View>
      {(this.getFilteredList().length > 0) ?
        <Icon src={ADD_IMAGE} onPress={() => { this.props.onAddImage(); }}
          ctnStyles={{ opacity: this.state.opacity }}
          styles={{top: REG_PADDING, right: REG_PADDING, borderColor: YELLOW_COLOR}}/> : null}
      {(this.getFilteredList().length > 0) ?
        <Icon src={REM_IMAGE} onPress={() => { this.renderPhotoAlert(); }} 
          ctnStyles={{ opacity: this.state.opacity }}
          styles={{top: REG_PADDING, left: REG_PADDING}}/> : null}
    </Animated.View>);    
  }

}

const styles =  StyleSheet.create({
  wrapper: {
    flex: 0,
    height: TOP_IMAGE_SIZE
  },
  slide: {
    height: TOP_IMAGE_SIZE
  },
  blankImage: {
    flexGrow: 1,
    width,
    height: TOP_IMAGE_SIZE,
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

PhotoSlideShow.defaultProps = {
  imgList: [],
  initialized: false,
  isPending: false,
  styles: {},
  noteID: -1
}

export default connect(stateToProps, dispatchToProps)(PhotoSlideShow)