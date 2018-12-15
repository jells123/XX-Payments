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

        <View style={styles.loginContainer}>
            <Image resizeMode="contain" style={styles.logo} source={require('../../assets/images/watermelon.gif')} />
        </View>

        <View style={styles.formContainer}>
          <LoginForm/>
        </View>

       </KeyboardAvoidingView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  loginContainer:{
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
  },
  logo: {
      position: 'absolute',
      // width: 300,
      // height: 100,
      flex :1
  }
});

//make this component available to the app
export default withNavigation(Login);
