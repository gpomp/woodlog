'use strict'
const ADD_IMAGE = require('../../assets/add.png');
const REM_IMAGE = require('../../assets/close.png');
import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, StyleSheet, Text, Platform, View, Animated, Easing, Alert
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

import BottomNav from '../components/BottomNav';

import Photo from '../components/Photo';
import TreeItem from '../components/TreeItem';

import PhotoSlideShow from './PhotoSlideShow';
import Notes from './Notes';

import Swiper from 'react-native-swiper';
import Icon from '../components/Icon';

const timer = require('react-native-timer');
const AnimatedSwiper = Animated.createAnimatedComponent(Swiper);

import { width, 
        height, 
        REG_PADDING, 
        container as ctnStyles, 
        contentContainer, 
        textReg, 
        TEXT_PADDING, 
        BIG_FONT_SIZE, 
        BG_COLOR,
        monthNames 
      } from '../utils/globalStyles';

const ctnWidth = width - REG_PADDING * 2;

const IPOptions = {
  title: 'Add a picture to this Bonsai...',
  allowsEditing: true,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'woodlog',
    cameraRoll: 'false'
  }
};


export const SEENOTES = 'see_notes';
export const EDIT = 'edit';
export const BACK = 'back';
export const ADDPHOTO = 'add_Photo';

class Tree extends Component {
  constructor(props) {
    super(props);
    global.raf = -1;
    this.state = { 
      opacity: new Animated.Value(0),
      photoY: new Animated.Value(0),
      sliderHeight: new Animated.Value(9999)
    };

  }

  componentWillMount () {
    // this.setState({saving: false});
    this.scrollY = 0;
    this.initialized = false;
    this.props.actions.show(this.props.nextId);
    // this.state.sliderHeight.setValue(9999);

    /*global.storage.load({
      key: 'tree',
      id: this.props.nextId
    }).then((res) => {
      const resCopy = Object.assign({}, res);
      resCopy.type = '';
      global.storage.save({
        key: 'tree',
        id: this.props.nextId,
        rawData: resCopy,
        expires: null
      })
    });*/
  }

  componentDidMount () {
    this.currentPicture = 0;
    this.animateIn();
    // this.ticker();
  }

  componentWillUnmount () {
    // if(global.raf !== -1) cancelAnimationFrame(global.raf);
    // global.raf = -1;
  }

  componentDidUpdate (nextProps, nextState) {

    if(this.state.saving) {
      this.refs.slideShow.setState({ isLoading: true });
    }

    if(this.state.saving && !this.props.isPending && this.props.initialized) {
      this.setState({ saving: false });
    }

    console.log('init', nextProps.initialized, this.props.initialized);
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    return !this.props.isPending || 
          (nextState.saving);
  }*/

  animateIn () {
    this.state.opacity.setValue(0); 
    this.refs.slideShow.animateIn();
    this.state.photoY.setValue(this.props.imgPos);
    
    Animated.timing(this.state.photoY, {
      toValue: 0,
      easing: Easing.inOut(Easing.exp),
      duration: 1000
    }).start();
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      delay: 1000
    }).start(event => {
      if(event.finished) {

        this.refs.scrollView.scrollEnabled = true;
        this.refs.bottomNav.animateIn();

        this.resizeSwiper(0);
      }
    });
    this.initialized = true;
  }

  animateOut (cb = null) {
    this.refs.bottomNav.animateOut(() => { this.finishAnimateOut(cb); });
  }

  finishAnimateOut (cb = null) {
    this.refs.slideShow.animateOut();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 250
    }).start(event => {
      if(event.finished) {
        if(cb !== null) {
          cb();
        }
      }
    });
  }

  onNavClick (key) {
    switch(key) {
      case SEENOTES:
        NavActions.Notes();
      break;
      case EDIT:
        this.animateOut(() => { NavActions.Edit({id: this.props.nextId}); });
        // NavActions.Edit({id: this.props.nextId});
      break;
      case BACK:
        this.animateOut(NavActions.List);
        // NavActions.List();
      break;
      case ADDPHOTO:
        this.showImagePicker();
      break;
    }
  }

  showImagePicker () {
    ImagePicker.showImagePicker(IPOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        let source; // = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true, isURL: false};

        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }
        const uriSplit = response.uri.split('/');
        const fileName = uriSplit[uriSplit.length - 1];
        console.log('photo uri', fileName);
        this.props.actions.savePhoto(fileName);
        this.setState({ saving: true });
      }
    });
  }

  renderPhotoAlert () {
    Alert.alert(
      'Photo',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', onPress: () => {  }, style: 'cancel'},
        {text: 'Delete', onPress: () => { this.removeImage(); }},
      ],
    );
  }

   removeImage () {
    console.log('removeImage', this.currentPicture);
    this.props.actions.removePhoto(this.props.tree.photos[this.currentPicture]);
    this.setState({ saving: true });
  }

  getPhotoList () {
    let photos = [];
    photos = this.props.tree.photos.map((p, i) => {
      const k = `photos-${i}`;
      return <Photo key={k} id={p} arrayID={i} removeImage={this.removeImage.bind(this)} onPhotoClick={(id) => {NavActions.SlideShow({nextId: id})}}/>
    });

    return photos;
  }

  getFormatedDate (d) {
    const date = new Date(d);
    const day = date.getDate() + 1;
    let dim = 'th';
    if(day === 1 || day === 11 || day === 21) dim = 'st';
    if(day === 2 || day === 12 || day === 22) dim = 'nd';
    if(day === 3 || day === 13 || day === 23) dim = 'rd';
    return `${monthNames[date.getMonth()]} ${day}${dim} ${date.getFullYear()}`;
  }

  getProp (p) {
    return p === null || p === undefined || p === 'undefined' ? '' : p.toString().toUpperCase();
  }

  onScroll (event) {
    this.scrollY = event.nativeEvent.contentOffset.y;
    this.state.photoY.setValue(this.scrollY); 
  }

  resizeSwiper (index = 0) {
    const currView = index === 0 ? this.refs.bonsaiView : this.refs.notesView;
    currView.measure((fx, fy, width, height) => { 
      // this.state.sliderHeight.setValue(height);
      Animated.timing(this.state.sliderHeight, {
        toValue: height,
        easing: Easing.inOut(Easing.exp),
        duration: 300
      }).start();
      // console.log(this.state.sliderHeight);
      // this.forceUpdate();
    });
  }

  /*ticker () {
    this.state.photoY.setValue(this.scrollY); 

    global.raf = requestAnimationFrame(this.ticker.bind(this));
  }*/

  render () {

    /*if (this.props.id === -1) {
      return <View />;
    }*/

    const { tree } = this.props;

    const list = [];

    console.log('RENDER TREE', this.props.id);

    return(
      <View style={{backgroundColor: BG_COLOR}}>        
        <ScrollView 
        ref="scrollView" 
        style={styles.container} 
        scrollEventThrottle={1} 
        onScroll={this.onScroll.bind(this)}>
          <PhotoSlideShow 
            ref="slideShow" 
            nextId={this.props.id} 
            photos={tree.photos} 
            y={this.state.photoY} 
            fromY={this.props.imgPos}
            onChangePicture={(index) => { this.currentPicture = index; }} />
          <Animated.View style={[styles.textView, {opacity: this.state.opacity}]}>
            <AnimatedSwiper 
              ref="swiper" 
              showsButtons={false} 
              height={this.state.sliderHeight}
              style={{flex: 0}} 
              onScrollBeginDrag={(e, state) => { this.resizeSwiper(Math.abs(state.index - 1)); }}
              onMomentumScrollEnd={(e, state) => { this.resizeSwiper(state.index); }}
              showsPagination={false}>
              <View ref="bonsaiView">
                <Text style={styles.title}>{this.getProp(tree.name)}</Text>
                <Text style={styles.text}>{this.getProp(tree.species)}</Text>
                <Text style={styles.text}>{this.getProp(tree.age)}</Text>
                <Text style={styles.text}>{this.getProp(tree.potType)}</Text>
                <Text style={styles.text}>{this.getProp(tree.style)}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.text}>{this.getProp(tree.height)}"</Text>
                <Text style={styles.text}>{this.getProp(tree.trunkWidth)}"</Text>
                <Text style={styles.text}>{this.getProp(tree.canopyWidth)}"</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.text}>{this.getProp(tree.Source)}</Text>
                <Text style={styles.text}>{this.getProp(tree.potSize.width)}" x {this.getProp(tree.potSize.height)}" x {this.getProp(tree.potSize.depth)}"</Text>
                <Text style={styles.text}>DATE ACQUIRED {this.getFormatedDate(tree.date).toUpperCase()}</Text>
                {/*<View style={styles.photoContainer}>
                              {this.getPhotoList()}
                            </View>*/}
              </View>
              <View ref="notesView">
                <Notes />
              </View>
            </AnimatedSwiper>
          </Animated.View>
          <BottomNav 
            ref="bottomNav"
            buttons={ [ { label: 'Edit', key: EDIT }, { label: 'Back', key: BACK } ] } 
            onNavClick = {this.onNavClick.bind(this)} />
        </ScrollView>
        <Icon src={ADD_IMAGE} onPress={() => { this.showImagePicker(); }} 
          styles={{top: 20, left: 20}}/>
        <Icon src={REM_IMAGE} onPress={() => { this.renderPhotoAlert(); }} 
          styles={{top: 20, right: 20}}/>
      </View>
    );
  }
}

Tree.defaultProps = {
  initialized: false,
  isPending: true
}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles, {
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }),
  textView: {
    marginTop: 220,
    backgroundColor:BG_COLOR,
    
    padding: REG_PADDING
  },

  title: Object.assign({}, textReg, {
    fontSize: 35,
    opacity: 1,
    textAlign: 'left',
    width: width - REG_PADDING * 2
  }),
  text: Object.assign({}, textReg, {
    fontSize: 15,
    opacity: 1,
    textAlign: 'left',
    width: width - REG_PADDING * 2
  }),
  photoContainer: {
    flex: 0 ,
    width: width - REG_PADDING * 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10
  }
});

const stateToProps = (state) => {
  return {
    id: state.tree.id,  
    initialized: state.tree.initialized,  
    tree: state.tree.rawData,
    isPending: state.tree.isPending
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Tree)