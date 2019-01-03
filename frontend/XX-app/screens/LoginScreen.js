import React, { Component } from 'react';
import { Text, View } from 'react-native';

import Login from '../components/Login/Login'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
    tabBarVisible: false,
    // header: null
  };

  render() {
    return <Login/>;
  }
}
