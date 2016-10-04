'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  View, StyleSheet, Text, Platform
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TreeActions from '../actions/treeActions';

import ImagePicker from 'react-native-image-picker';

import BottomNav from '../components/BottomNav';

import Photo from '../components/Photo';

const IPOptions = {
  title: 'Add photo to album...',
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
    this.props.actions.show(this.props.nextId);
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
      console.log('Response = ', response);

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
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        this.props.actions.savePhoto(source.uri);
        
      }
    });
  }

  removeImage (id) {
    console.log('remove image', id);
    this.props.actions.removePhoto(id);
  }

  getPhotoList () {
    let photos = [];
    photos = this.props.tree.photos.map((p, i) => {
    console.log('GET PHOTOS', p, i);
      const k = `photos-${i}`;
      return <Photo key={k} id={p} removeImage={this.removeImage.bind(this)}/>
    });

    return photos;
  }

  render () {

    if(!this.props.initialized) return (<View style={styles.container}></View>);

    const { tree } = this.props;

    const list = [];

    for(const name in this.props.tree) {
      if(this.props.tree[name].constructor === Array) continue;
      list.push(<Text key={`prop-${name}`}>{name} {this.props.tree[name]}</Text>);
    }

    return(
      <View style={styles.container}> 
        {list}
        {this.getPhotoList()}
        <BottomNav 
          items={ [ { label: 'See Notes', key: SEENOTES }, { label: 'Add Photo', key: ADDPHOTO }, { label: 'Edit', key: EDIT }, { label: 'Back', key: BACK } ] } 
          onNavClick = {this.onNavClick.bind(this)} />
      </View>
    );
  }
}

const styles =  StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
      justifyContent: 'center'
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