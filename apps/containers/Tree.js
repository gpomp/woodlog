'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, StyleSheet, Text, Platform, View, Animated, Easing
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

import BottomNav from '../components/BottomNav';

import Photo from '../components/Photo';
import TreeItem from '../components/TreeItem';

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

const IPOptions = {
  title: 'Add a picture to this Bonsai...',
  allowsEditing: true,
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'woodlog'
  }
};


export const SEENOTES = 'see_notes';
export const EDIT = 'edit';
export const BACK = 'back';
export const ADDPHOTO = 'add_Photo';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = { opacity: new Animated.Value(0) };
  }

  componentWillMount () {

    this.setState({saving: false});
    this.props.actions.show(this.props.nextId);

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
    this.animateIn();
  }

  componentDidUpdate () {    
    if(this.state.saving && !this.props.isPending) {
      this.setState({ saving: false });
      this.forceUpdate();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.id !== this.props.id || (nextState.saving && !nextProps.isPending));
  }

  animateIn () {
    this.state.opacity.setValue(0); 
    this.refs.treeItem.animateIn();
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      delay: 1000
    }).start(event => {
      if(event.finished) {

        this.refs.scrollView.scrollEnabled = true;
        this.refs.bottomNav.animateIn();
      }
    });
  }

  animateOut (cb = null) {
    this.refs.bottomNav.animateOut(() => { this.finishAnimateOut(cb); });
  }

  finishAnimateOut (cb = null) {
    this.refs.treeItem.animateOut();
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
        this.props.actions.savePhoto(source.uri);
        this.setState({ saving: true });
      }
    });
  }

  removeImage (id) {
    this.props.actions.removePhoto(id);
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

  render () {

    console.log('RENDER TREE');

    const { tree } = this.props;

    const list = [];

    return(
      <View style={{backgroundColor: BG_COLOR}}>

        <TreeItem
            ref="treeItem"
            label={ tree.name } 
            photos={ tree.photos } 
            key={0} ukey={0}
            fromY={this.props.imgPos}
            toY={0}
            fromOpacity={1}
            onNavClick={ () => {} }
            styles={{ paddingLeft: REG_PADDING, paddingRight: REG_PADDING, paddingTop: REG_PADDING }} />

        <ScrollView ref="scrollView" style={styles.container}>

          <Animated.View style={[styles.textView, {opacity: this.state.opacity}]}>

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
            <View style={styles.photoContainer}>
              {this.getPhotoList()}
            </View>

          </Animated.View>
          <BottomNav 
            ref="bottomNav"
            buttons={ [ { label: 'See Notes', key: SEENOTES }, { label: 'Add Photo', key: ADDPHOTO }, { label: 'Edit', key: EDIT }, { label: 'Back', key: BACK } ] } 
            onNavClick = {this.onNavClick.bind(this)} />
        </ScrollView>
      </View>
    );
  }
}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles, {
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)' 
  }),
  textView: {
    backgroundColor:BG_COLOR,
    marginTop: 220,
    padding: REG_PADDING
  },

  title: Object.assign({}, textReg, {
    fontSize: 35,
    opacity: 1,
    paddingLeft: TEXT_PADDING,
    paddingRight: TEXT_PADDING,
    textAlign: 'left',
    width: width - REG_PADDING * 2 - TEXT_PADDING * 2
  }),
  text: Object.assign({}, textReg, {
    fontSize: 15,
    opacity: 1,
    paddingLeft: TEXT_PADDING,
    paddingRight: TEXT_PADDING,
    textAlign: 'left',
    width: width - REG_PADDING * 2 - TEXT_PADDING * 2
  }),
  photoContainer: {
    flex: 0 ,
    width: width - REG_PADDING * 2 - TEXT_PADDING * 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: TEXT_PADDING,
    paddingRight: TEXT_PADDING,
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