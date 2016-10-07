'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, View, Dimensions, StyleSheet, Text, TouchableOpacity, Image
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import TreeItem from '../components/TreeItem';

import * as TreeActions from '../actions/treeActions';
const { width, height } = Dimensions.get('window');

import {removeAllImages} from '../utils/debug';

import {
  LOGO_IMAGE, 
  BLANK_IMAGE, 
  container as ctnStyles, 
  textReg as textStyle, 
  REG_PADDING} from '../utils/globalStyles';


class List extends Component {

  componentWillMount () {
    this.props.actions.reset();
    this.props.actions.getList();

    // removeAllImages();
  }

  componentDidUpdate() {

  }

  onNavClick (key) {
    NavActions.Tree({nextId: key});
  }

  onAddClick () {
    NavActions.Edit();
  }

  render () {
    let trees = [];
    if(this.props.initialized) {
      trees = this.props.list.map((t, i) => {
        const k = `tree-${i}`;
        return <TreeItem label={ t.name } photos={ t.photos } key={k} ukey={ i } onNavClick={ this.onNavClick.bind(this) }/>
      });
    }
    return(
    <ScrollView style={styles.container}>
      <View style={styles.viewLogo}>
        <Image source={LOGO_IMAGE} style={styles.logoStyles} />
      </View>
      <TouchableOpacity key="add-tree" onPress={() => { this.onAddClick() }} style={styles.button}>
        <Image resizeMode="cover" source={BLANK_IMAGE} style={styles.blankImage}>
          <Text style={styles.addTree}>ADD A NEW TREE</Text>
        </Image>
      </TouchableOpacity>
      {trees}
    </ScrollView>
  );
    
    
    
  }

}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles),

  viewLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'

  },
  button: {
    marginBottom: 3
  },
  blankImage: {
    width: width - REG_PADDING * 2,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addTree: Object.assign({
    letterSpacing: 2,
    backgroundColor: 'rgba(0,0,0,0)'
  }, textStyle),

  logoStyles: {
    width: 90,
    height: 90,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Seattle Sans',
    color: 'black',
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const stateToProps = (state) => {
  return {
    list: state.list.data,
    initialized: state.list.initialized
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(TreeActions, dispatch)
  }
}

export default connect(stateToProps, dispatchToProps)(List)