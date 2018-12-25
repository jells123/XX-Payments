//import liraries
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast, {DURATION} from 'react-native-easy-toast';

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
    _onButtonPress = () => {
      var data = this.refs.form.getValue();

      if(data) {
        fetch('http://192.168.1.5:8000/users/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            first_name: data.firstName,
            password: data.password
          }),
        }).then(response => {
          this.refs.toast.show('Success!');
        }).catch(err => {
          this.refs.toast.show('Error :(');
        });
      }

    };

    render() {
        return (
            <KeyboardAwareScrollView style={styles.container}>
               <Form
                ref={"form"}
                type={User}
                options={options} // pass the options via props
               />

                <TouchableOpacity style={GlobalStyles.buttonContainer}
                            onPress={this._onButtonPress}>
                    <Text  style={GlobalStyles.buttonText}>REGISTER :)</Text>
                </TouchableOpacity>
                <Toast ref="toast"/>
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
