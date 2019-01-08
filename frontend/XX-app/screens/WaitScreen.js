import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Wait from '../components/Wait/Wait'

export default class WaitScreen extends React.Component {
  static navigationOptions = {
    title: 'Wait',
    tabBarVisible: false,
  };

  render() {
    return <Wait/>;
  }
}
