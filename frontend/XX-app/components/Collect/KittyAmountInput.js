import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class KittyAmountInput extends Component {

    state = {
        isFocused: false,
        amount: "0.00"
    };

    _handleFocus = event => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
        this.props.onFocus(event);
        }
    };

    _handleBlur = event => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) {
        this.props.onBlur(event);
        }
    };

    _handleTextChanged = (text) => {
        // TODO: parseFloat returns NaN if failed!
        // - handle this

        text = text.replace(/[^0-9.]/g, '');
        let value = parseFloat(text);
        // if value is NaN...

        this.setState({
            amount: value.toFixed(2)
        }, () => {
        if (this.state.amount != "")
            this.props.handleKittyAmount(parseFloat(this.state.amount));
        else
            this.props.handleKittyAmount(0.0);
        })
    }

    render() {
        const { isFocused } = this.state;
        return (
        <TextInput style={styles.kittyInput}
            keyboardType='numeric'
            underlineColorAndroid={
            isFocused ? BLUE : LIGHT_GRAY
            }
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            value={this.state.amount}
            onChangeText = {(text) => this._handleTextChanged(text)}
        />
        )
    }
}

const styles = StyleSheet.create({
kittyInput: {
    height: 40,
    paddingLeft: 6,
    flex: 1,
    margin: 20,
    color: '#fff',
    fontSize: 18
},
})

export default KittyAmountInput;
