'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View, Image, StyleSheet,Dimensions, Text
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Swiper from 'react-native-swiper';
const { width, height } = Dimensions.get('window');


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
  }
});


const stateToProps = (state) => {
  return {
    photos: state.tree.rawData.photos
  }
}

export default connect(stateToProps)(PhotoSlideShow)