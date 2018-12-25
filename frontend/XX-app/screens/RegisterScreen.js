import React, { Component }from 'react';
import { Text, View } from 'react-native';

import Register from '../components/Register/Register'

export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
    tabBarVisible: false,
    // header: null
  };

  render() {
    return <Register />;
  }
}
