//import liraries
import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';
import axios from 'axios';

// create a component
class LoginForm extends Component {
    constructor(props){
      super(props);

      this.state = {
        usernameInput: 'simpleuser',
        passwordInput: 'simpleuser',
        userData: ''
      }
    }

    _onButtonPress = () => {
      var userIn = this.state.usernameInput;
      var passIn = this.state.passwordInput;

      if (userIn && passIn) {

        let requestUri = `http://${global.ipAddress}:8000/login/`;
        fetch(requestUri, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userIn,
            password: passIn
          }),

        })
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          if (responseJson.user && responseJson.token)
          {
            this.refs.toast.show('You have logged in!', DURATION.LENGTH_LONG);

            // We set the returned token as the default authorization header
            //axios.defaults.headers.common.Authorization = `Token ${responseJson.token}`;
            global.token = responseJson.token;      // niestety to axios nie dziala, nie wiem czemu, poki co tak dziala

            if (responseJson.user.username && responseJson.user.id) {
              this.props.navigation.navigate('Home', {
                username: responseJson.user.username,
                userId: responseJson.user.id
              });
            }
          }
          else if (responseJson.non_field_errors)
          {
            this.refs.toast.show(responseJson.non_field_errors, DURATION.LENGTH_LONG);
          }
        }).catch(err => {
          console.log(err);
          this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
        });
      }
    };

    render() {
      return (
        <KeyboardAvoidingView style={styles.container}>

               <TextInput style = {GlobalStyles.input}
                    autoCapitalize="none"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    autoCorrect={false}
                    ref={(input)=> this.usernameInput = input}
                    onChangeText={(usernameInput) => this.setState({usernameInput})}
                    value={this.state.usernameInput}
                    defaultValue="simpleuser"
                    returnKeyType="next"
                    placeholder='Username'
                    placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {GlobalStyles.input}
                    returnKeyType="go"
                    ref={(input)=> this.passwordInput = input}
                    onChangeText={(passwordInput) => this.setState({passwordInput})}
                    value={this.state.passwordInput}
                    placeholder='Password'
                    defaultValue="simpleuser"
                    placeholderTextColor='rgba(225,225,225,0.7)'
                    secureTextEntry/>

                <Text style={styles.registerText}
                    onPress={() => this.props.navigation.navigate('Register')}>
                    Create new account
                </Text>

                <TouchableOpacity style={GlobalStyles.buttonContainer}
                                    onPress={this._onButtonPress}>
                            <Text  style={GlobalStyles.buttonText}>LOGIN</Text>
               </TouchableOpacity>
              <Toast ref="toast" position={'top'}/>
            </KeyboardAvoidingView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
       },
       registerText:{
           textAlign: 'center',
           padding: 10,
           marginBottom: 10,
           color: '#fff',
           opacity: 0.8,
           textDecorationLine: 'underline'
       }
});

//make this component available to the app
export default withNavigation(LoginForm);
