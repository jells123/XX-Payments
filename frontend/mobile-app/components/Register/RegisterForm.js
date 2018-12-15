//import liraries
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import GlobalStyles from '../../constants/Style';

/*
TODO:
Make RegisterForm Keyboard-Aware! 
tcomb-form-native is not best for it
(unless you want lots of code as a work-around)
*/

import t from 'tcomb-form-native';
import bootstrap from 'tcomb-form-native/lib/stylesheets/bootstrap.js';
const Form = t.form.Form;

const User = t.struct({
    username: t.String,
    password: t.String,

    firstName: t.String,
    lastName: t.String,
    phoneNumber: t.Number,

    email: t.String,
    terms: t.Boolean,
});

const options = {
    fields: {
      terms: {
        label: 'I Agree to all Terms, I never read them anyway.',
      },
    },
    stylesheet: bootstrap
  };

// create a component
class RegisterForm extends Component {
    render() {
        return (
            <KeyboardAwareScrollView style={styles.container}>
               <Form 
                ref={c => this._form = c}
                type={User} 
                options={options} // pass the options via props
               />

                <TouchableOpacity style={GlobalStyles.buttonContainer} 
                            // onPress={onButtonPress}
                    >
                    <Text  style={GlobalStyles.buttonText}>REGISTER :)</Text>
                </TouchableOpacity> 
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1, 
        marginBottom: 20
       },
});

// https://github.com/gcanti/tcomb-form-native/blob/master/lib/stylesheets/bootstrap.js
options.stylesheet.textbox.normal = {
    ...GlobalStyles.input
};

options.stylesheet.controlLabel.normal = {
    color: 'white',
    marginBottom: 8,
    opacity: 0.8
}

//make this component available to the app
export default withNavigation(RegisterForm);
