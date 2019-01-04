import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Join from '../components/Join/Join'

export default class JoinScreen extends React.Component {
  static navigationOptions = {
    title: 'Join',
    tabBarVisible: false,
    // header: null
  };

  render() {
    return <Join/>;
  }
}
