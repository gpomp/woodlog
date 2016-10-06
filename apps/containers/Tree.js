'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, Dimensions, StyleSheet, Text, Platform, View
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

import BottomNav from '../components/BottomNav';

import Photo from '../components/Photo';
const { width, height } = Dimensions.get('window');

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

  componentDidUpdate () {
    if(this.state.saving) {
      this.setState({ saving: false });
      this.forceUpdate();
    }    
  }

  onNavClick (key) {
    switch(key) {
      case SEENOTES:
        NavActions.Notes();
      break;
      case EDIT:
        NavActions.Edit({id: this.props.nextId});
      break;
      case BACK:
        NavActions.List();
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
        console.log(source);
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

  render () {

    if(!this.props.initialized) {
      return null;
    }

    const { tree } = this.props;

    const list = [];

    for(const name in this.props.tree) {
      if(this.props.tree[name] === null ||
        this.props.tree[name].constructor === Array) continue;
      if(this.props.tree[name].constructor === Date) {
        list.push(<Text key={`prop-${name}`}>{name} {this.props.tree[name].toString()}</Text>);
        continue;
      }
      list.push(<Text key={`prop-${name}`}>{name} {this.props.tree[name]}</Text>);
    }

    return(
      <ScrollView style={styles.container}> 
        {list}
        <View style={styles.photoContainer}>
          {this.getPhotoList()}
        </View>
        <BottomNav 
          items={ [ { label: 'See Notes', key: SEENOTES }, { label: 'Add Photo', key: ADDPHOTO }, { label: 'Edit', key: EDIT }, { label: 'Back', key: BACK } ] } 
          onNavClick = {this.onNavClick.bind(this)} />
      </ScrollView>
    );
  }
}

const styles =  StyleSheet.create({
  container: {
    width, height,
    padding: 20,
    paddingTop: 68
  },
  photoContainer: {
    flex: 1, 
    flexDirection: 'row'
  }
});

const stateToProps = (state) => {
  return {
    id: state.tree.id,  
    initialized: state.tree.initialized,  
    tree: state.tree.rawData
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(Tree)