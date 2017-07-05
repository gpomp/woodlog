'use strict'

import { Actions as NavActions } from 'react-native-router-flux';

import React, {Component} from 'react';
import {
  ScrollView, View, StyleSheet, Text, TouchableHighlight, Image, Animated, Easing, StatusBar
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import TreeItem from '../components/TreeItem';

import * as TreeActions from '../actions/treeActions';

import {removeAllImages} from '../utils/debug';

import {
  LOGO_IMAGE, 
  BLANK_IMAGE, 
  container as ctnStyles, 
  textReg as textStyle,
  width, height,   
  REG_PADDING} from '../utils/globalStyles';


class List extends Component {

  constructor(props) {
    super(props);  
    this.state = { 
      opacity: new Animated.Value(0),
      addY: new Animated.Value(0),
      logoHeight: new Animated.Value(height),
      logoOpacity: new Animated.Value(1)
    };
  }

  componentWillMount () {
    this.scrollVal = 0;
    this.props.actions.reset();
    this.props.actions.getList();

    // removeAllImages();
  }

  componentDidMount () {
    this.state.addY.setValue(0);
    this.state.opacity.setValue(0);
    this.state.logoOpacity.setValue(1);
    this.state.logoHeight.setValue(height);

    this.animateIn();
  }

  componentDidUpdate() {

  }

  animateIn () {
    let delayLogo = 1000;
    let delayOpacity = 1250;
    let timing = 500;
    if(this.props.back) {
      this.state.logoHeight.setValue(65);
      delayLogo = 50;
      delayOpacity = 100;
      timing = 500;
    }

    Animated.parallel([
      Animated.timing(this.state.logoHeight, {
        toValue: 65,
        delay: delayLogo,
        duration: timing,
        easing: Easing.inOut(Easing.exp)
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: timing,
        delay: delayOpacity
      }),      
    ]).start(event => {
      if(event.finished) {
        let timing = 1000;
        let delay = 100;
        if(this.props.back) {
          timing = 500;
          delay = 10;
        }

        for (var i = 0; i < this.props.list.length; i++) {
          this.refs[`treeItem${i}`].animateIn(timing, delay);
        }

        Animated.timing(this.state.addY, {
          toValue: 203 * this.props.list.length,
          easing: Easing.inOut(Easing.exp),
          duration: timing,
          delay: 1 * delay
        }).start();
      }
    });
  }

  animateOut (key = 0, cb = null) {
    this.refs.mainView.scrollEnabled = false;

    for (var i = 0; i < this.props.list.length; i++) {
      if(key === i) continue;
      this.refs[`treeItem${i}`].animateOut();
    }

    Animated.parallel([
      Animated.timing(this.state.logoOpacity, {
        toValue: 0,
        duration: 300
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300
      })
    ]).start(event => {
      if(event.finished) {
        cb();
      }
    });
  }

  onNavClick (key) {
    this.animateOut(key, () => { NavActions.Tree({nextId: key, imgPos: (key) * 203 + 115 - this.scrollVal}); });
  }

  onAddClick () {
    this.animateOut(50, NavActions.Edit);
  }

  render () {
    let trees = [];
    if(this.props.initialized) {
      trees = this.props.list.map((t, i) => {
        const k = `tree-${i}`;
        return <TreeItem 
        ref={`treeItem${i}`} 
        length={this.props.list.length}
        fromY={0}
        toY={203 * (i)}
        label={ t.name } 
        photos={ t.photos } 
        key={k} ukey={ i } 
        onNavClick={ this.onNavClick.bind(this) }/>
      });
    }

    return(
    <ScrollView ref="mainView" style={styles.container}  onScroll={(event) => { this.scrollVal = event.nativeEvent.contentOffset.y; }}>
      <StatusBar hidden={true} />
      <Animated.View style={[styles.viewLogo, {height: this.state.logoHeight, opacity: this.state.logoOpacity}]}>
        <Image source={LOGO_IMAGE} style={styles.logoStyles} />
      </Animated.View>
      <View>
        <View style={{ height: (this.props.list.length + 1) * 203 }}>
          {trees}
          <Animated.View style={{opacity: this.state.opacity, transform: [{translateY: this.state.addY}]}}>
            <TouchableHighlight key="add-tree" onPress={() => { this.onAddClick() }} style={styles.button}>
              <Image resizeMode="cover" source={BLANK_IMAGE} style={styles.blankImage}>
                <Text style={styles.addTree}>ADD A NEW TREE</Text>
              </Image>
            </TouchableHighlight>        
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
    
    
    
  }

}

const styles =  StyleSheet.create({
  container: Object.assign({}, ctnStyles),

  viewLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20

  },
  button: {
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
    width: 65,
    height: 65,
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