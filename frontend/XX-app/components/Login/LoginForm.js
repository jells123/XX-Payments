//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';

// create a component
class LoginForm extends Component {
    render() {
        return (
            <View style={styles.container}>

               <TextInput style = {GlobalStyles.input}
                    autoCapitalize="none"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    autoCorrect={false}
                    keyboardType='email-address'
                    returnKeyType="next"
                    placeholder='User email' 
                    placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {GlobalStyles.input}
                    returnKeyType="go"
                    ref={(input)=> this.passwordInput = input}
                    placeholder='Password'
                    placeholderTextColor='rgba(225,225,225,0.7)'
                    secureTextEntry/>

                <Text style={styles.registerText}
                    onPress={() => this.props.navigation.navigate('Register')}>
                    Create new account
                </Text>

                <TouchableOpacity style={GlobalStyles.buttonContainer}
                                    // onPress={onButtonPress}
                                    >
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
