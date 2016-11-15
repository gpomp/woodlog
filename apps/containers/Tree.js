'use strict'
const ADD_IMAGE = require('../../assets/add.png');
const REM_IMAGE = require('../../assets/close.png');
const EDIT_IMAGE = require('../../assets/edit.png');
const BACK_IMAGE = require('../../assets/back.png');
import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, StyleSheet, Text, Platform, View, Animated, Easing, Alert, StatusBar, findNodeHandle
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

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

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      opacity: new Animated.Value(0),
      photoY: new Animated.Value(0),
      sliderHeight: new Animated.Value(9999)
    };

  }

  componentWillMount () {
    // console.log('componentWillMount!!!!!', this.props.nextId);
    this.scrollY = 0;
    this.initialized = false;
    this.props.actions.show(this.props.nextId);
  }

  componentDidMount () {
    this.currentPicture = 0;
    this.animateIn();
  }

  componentWillUnmount () {

  }

  componentDidUpdate (nextProps, nextState) {

    if(!this.props.isPending && this.props.initialized) {
      this.refs.slideShow.setState({ isLoading: true });
    }

    if(this.state.saving && !this.props.isPending && this.props.initialized) {
      this.setState({ saving: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.isPending;
  }

  animateIn () {
    this.state.opacity.setValue(0); 
    this.refs.slideShow.animateIn();
    this.state.photoY.setValue(this.props.imgPos);
    
    Animated.timing(this.state.photoY, {
      toValue: 0,
      easing: Easing.inOut(Easing.exp),
      duration: 1000
    }).start(event => {
      if(event.finished) {
        this.resizeSwiper(0, true);

        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500
        }).start();

        // this.refs.scrollView.scrollEnabled = true;

      }
    });
    this.initialized = true;
  }

  animateOut (cb = null) {
    this.refs.slideShow.animateOut(500);
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 500
    }).start(event => {
      if(event.finished) {
        if(cb !== null) {
          cb();
        }
      }
    });
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

  resizeSwiper (index = 0, noAnim = false) {
    const currView = index === 0 ? this.refs.bonsaiView : this.refs.notesView;
    currView.measure((fx, fy, width, height) => {
      if(noAnim) {
        this.state.sliderHeight.setValue(height);
        return;
      }

      Animated.timing(this.state.sliderHeight, {
        toValue: height,
        easing: Easing.inOut(Easing.exp),
        duration: 300
      }).start();
    });
  }

  toggleNote (showForm, formHeight, noteHeight, dateField = 0) {
    // console.log('toggleNote', showForm, formHeight, noteHeight);

    let heightChange = -noteHeight + formHeight;
    if(!showForm) {
      heightChange = -formHeight + noteHeight;
    }

    if(showForm && dateField !== 0) {
      heightChange = dateField;
    }

    console.log('heightChange', heightChange);

    this.refs.notesView.measure((fx, fy, width, height) => { 
      // this.state.sliderHeight.setValue(height);
      Animated.timing(this.state.sliderHeight, {
        toValue: height + heightChange,
        easing: Easing.inOut(Easing.exp),
        duration: 250
      }).start();
    });
  }

  inputFocused (note) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(note),
        200, //additionalOffset
        true
      );
    }, 50);
  }

  render () {

    const { tree } = this.props;

    const list = [];

    console.log('RENDER TREE', tree.photos);

    return(
      <View style={{backgroundColor: BG_COLOR}}>
        <StatusBar hidden={true} />
        <ScrollView 
        ref="scrollView" 
        style={styles.container} 
        scrollEventThrottle={1} 
        onScroll={this.onScroll.bind(this)}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode='on-drag'>
          <PhotoSlideShow 
            ref="slideShow" 
            nextId={this.props.id} 
            photos={tree.photos} 
            y={this.state.photoY} 
            fromY={this.props.imgPos}
            onAddImage={() => { this.showImagePicker(); }}
            onChangePicture={(index) => { this.currentPicture = index; }} />
          <Animated.View style={[styles.textView, {opacity: this.state.opacity}]}>
            <AnimatedSwiper 
              keyboardShouldPersistTaps={true}
              keyboardDismissMode='on-drag'
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

                <Icon src={EDIT_IMAGE} onPress={() => { this.animateOut(() => { NavActions.Edit({id: this.props.nextId}); }); }} 
                  styles={{top: 10, right: 40, backgroundColor: '#383735'}}/>

                <Icon src={BACK_IMAGE} onPress={() => { this.animateOut(() => { NavActions.List({back: true})}); }} 
                  styles={{top: 10, right: 100, backgroundColor: '#383735'}}/>
              </View>
              <View ref="notesView">
                <Notes 
                  onNoteUpdate={() => { this.resizeSwiper(1); }} 
                  onToggleNote={(showForm, formHeight, noteHeight, dateField = 0) => { this.toggleNote(showForm, formHeight, noteHeight, dateField); }} 
                  onFocusNote={(note) => { this.inputFocused(note); }}/>
              </View>
              </AnimatedSwiper>
          </Animated.View>
        </ScrollView>
        {(tree.photos.length > 0) ? 
          <Icon src={ADD_IMAGE} onPress={() => { this.showImagePicker(); }}
            ctnStyles={{ opacity: this.state.opacity }}
            styles={{top: 20, right: 20}}/> : null}
        {(tree.photos.length > 0) ? 
          <Icon src={REM_IMAGE} onPress={() => { this.renderPhotoAlert(); }} 
            ctnStyles={{ opacity: this.state.opacity }}
            styles={{top: 70, right: 20}}/> : null}
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