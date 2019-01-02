//import liraries
import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';
import { withNavigation } from 'react-navigation';

import LoginForm from './LoginForm';
import GlobalStyles from '../../constants/Style';

// create a component
class Login extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={GlobalStyles.container}>
    
        <View style={styles.imageContainer}>
          <Image resizeMode="contain" source={require('../../assets/images/watermelon.gif')} />
        </View>

        <View style={styles.loginContainer}>
          <LoginForm/>
        </View>

       </KeyboardAvoidingView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  loginContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
  },
  imageContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  },
});

//make this component available to the app
export default withNavigation(Login);
