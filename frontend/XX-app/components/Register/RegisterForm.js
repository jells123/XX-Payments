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

const Email = t.refinement(t.String, email => {
  const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/; //or any other regexp
  return reg.test(email);
});

const User = t.struct({
    username: t.String,
    password: t.String,

    firstName: t.maybe(t.String),
    lastName: t.maybe(t.String),
    phoneNumber: t.maybe(t.Number),

    email: Email,
    terms: t.Boolean,
});

const options = {
    fields: {
      terms: {
        label: 'I Agree to all Terms, I never read them anyway.',
      },
      password: {
        password: true,
        secureTextEntry: true
      }
    },
    stylesheet: bootstrap
  };

// create a component
class RegisterForm extends Component {
    constructor(props){
      super(props);

      this.state = {
        value: null
      }
    }

    _onChange = (value) => {
      this.setState({ value });
    };

    _clearForm = () => {
      // clear content from all textbox
      this.setState({ value: null });
    };

    _onButtonPress = () => {
      var data = this.refs.form.getValue();

      if(data) {
        if(!data.terms) {
          this.refs.toast.show('You have to accept terms first');
          return;
        }

        fetch('http://192.168.1.5:8000/users/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password
          }),

        }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.id);
          //this.props.navigation.navigate('Login');
          this.refs.toast.show('Success! You can now log in', DURATION.LENGTH_LONG);
          this._clearForm();

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
                value={this.state.value}
                onChange={this._onChange.bind(this)}
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
