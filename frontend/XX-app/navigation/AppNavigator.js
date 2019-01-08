import React from 'react';

import { createStackNavigator, createAppContainer } from "react-navigation";

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CollectScreen from '../screens/CollectScreen';
import JoinScreen from '../screens/JoinScreen';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Login: {
      screen: LoginScreen
    },
    Register: {
      screen: RegisterScreen
    },
    Collect: {
      screen: CollectScreen
    },
    Join: {
      screen: JoinScreen
    }
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(AppNavigator);
