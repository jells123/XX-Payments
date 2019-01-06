//import liraries
import React, { Component } from 'react';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';

import RegisterForm from './RegisterForm';
import GlobalStyles from '../../constants/Style';

// create a component
class Register extends Component {
    render() {
        return (
            <View behavior="padding" style={GlobalStyles.container}>
                <RegisterForm/>
            </View>
        );
    }
}

//make this component available to the app
export default Register;
