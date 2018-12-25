//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';

// create a component
class LoginForm extends Component {
    constructor(props){
      super(props);

      this.state = {
        usernameInput: '',
        passwordInput: '',
        userData: ''
      }
    }

    _onButtonPress = () => {
      var userIn = this.state.usernameInput;
      var passIn = this.state.passwordInput;

      if(userIn && passIn) {
        fetch('http://192.168.1.5:8000/login/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userIn,
            password: passIn
          }),

        }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({userData: responseJson});

          // toast sie za nic nie chce pokazac
          this.refs.toast.showCenter('Logged in!');

        }).catch(err => {
          this.refs.toast.showCenter('Error :(');
        });
      }
    };

    render() {
        return (
            <View style={styles.container}>

                <Toast ref="toast"/>

               <TextInput style = {GlobalStyles.input}
                    autoCapitalize="none"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    autoCorrect={false}
                    ref={(input)=> this.usernameInput = input}
                    onChangeText={(usernameInput) => this.setState({usernameInput})}
                    value={this.state.usernameInput}
                    //keyboardType='email-address'
                    returnKeyType="next"
                    placeholder='Username'
                    placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {GlobalStyles.input}
                    returnKeyType="go"
                    ref={(input)=> this.passwordInput = input}
                    onChangeText={(passwordInput) => this.setState({passwordInput})}
                    value={this.state.passwordInput}
                    placeholder='Password'
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

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        // ...GlobalStyles.container,
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
