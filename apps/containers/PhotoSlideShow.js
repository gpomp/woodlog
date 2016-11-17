'use strict'
import React, {Component} from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Animated, Easing, TouchableHighlight
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import * as TreeActions from '../actions/treeActions';

import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import compareArrays from '../utils/utils';

import {textReg, width, height, BLANK_IMAGE, REG_PADDING} from '../utils/globalStyles';
const AnimatedTH = Animated.createAnimatedComponent(TouchableHighlight);


class PhotoSlideShow extends Component {

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
    // this.setState({isLoading: true});
    // this.updatePhotosList();
    this.update();
  }

  componentWillUpdate (nextProps, nextState) {
    // if(this.state.isLoading) {
      // this.updatePhotosList();
    // }
    // console.log('componentWillUpdate', this.props.actions)

    
     
  }

  componentDidUpdate (nextProps, nextState) {
    /*if(!compareArrays(nextProps.photos, this.props.photos)) {
      this.props.actions.showPhotos(nextProps.photos);
    }*/
  }

  update () {
    // this.props.actions.showPhotos(this.props.photos);
  }
 
  /*updatePhotosList () {
    console.log('updatePhotosList', this.props.photos);
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
  }*/

  animateIn () {
    this.state.opacity.setValue(1);
    this.state.width.setValue(width - 40);

    Animated.timing(this.state.width, {
      toValue: width,
      easing: Easing.inOut(Easing.exp),
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
        <AnimatedTH key={`ss-${i}`} onPress={() => { this.props.onPress(); }} style={{ height: 203, width: this.state.width }}>
        <Animated.Image resizeMode="cover" source={src} style={{ height: 203, width: this.state.width }} />
        </AnimatedTH>
      );
    })
  }

  render () {
    return(<Animated.View 
      style={[{height: 203,position: 'absolute', top: 0, left: 0, overflow:'hidden', flex: 1, width, alignItems:'center'}, {transform: [{translateY: this.props.y}], opacity: this.state.opacity }]}>
      <Animated.View style={{width: this.state.width, overflow:'hidden'}}>
        
        {(this.props.photos.length > 0) ?
          
            <Swiper style={styles.wrapper} showsButtons={false} onMomentumScrollEnd={(e, state) => { this.props.onChangePicture(state.index); }}>
              {this.getImageList()}
            </Swiper> :
          <TouchableHighlight onPress={() => { this.props.onAddImage(); }}>
            <Image
              resizeMode="cover" 
              source={BLANK_IMAGE}
              style={styles.blankImage} >
                <Text style={styles.errorTree}>ADD AN IMAGE</Text>
            </Image>
          </TouchableHighlight>
        }

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
  },
  blankImage: {
    flex: 1,
    width,
    height: 203,
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
  isPending: false
}

export default connect(stateToProps, dispatchToProps)(PhotoSlideShow)