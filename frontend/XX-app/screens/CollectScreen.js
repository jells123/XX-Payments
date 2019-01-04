import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Collect from '../components/Collect/Collect'

export default class CollectScreen extends React.Component {
  static navigationOptions = {
    title: 'Collect',
    tabBarVisible: false,
    // header: null
  };

  render() {
    return <Collect/>;
  }
}
