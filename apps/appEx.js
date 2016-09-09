'use strict'
import React, {Component} from 'react';
import {
  View,
  Text,
  Navigator,
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import { bindActionCreators } from 'redux'
import * as Actions from './actions/exActions'
import { connect } from 'react-redux'
import MainComponent from './components/MainComponent'

class AppEx extends Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton () {
    this.props.actions.def_action('Hello world!');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.button} onPress={this._onPressButton}>
          <Text>Word appear</Text>
        </TouchableHighlight>
        <MainComponent
          words={this.props.words} count={this.props.count} />
      </View>
    )
  }
}

const stateToProps = (state) => {
  return {
    words: state.ex.words,
    count: state.ex.counter
  }
}

const dispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  scene: {
    flex: 1,
    paddingTop: 63,
  }
})

export default connect(stateToProps, dispatchToProps)(App)