import React, { Component } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class UserEntry extends Component {

    state = {
        checked : false
    }

    _handleChecked = () => {
        this.setState({
            checked: !this.state.checked
        }, () => {
            this.props.handleCheck(this.props.row);
        });
    }

    componentWillReceiveProps(props) {
        ;
    }

    render() {
        let user = this.props.user;

        let textInputValue = user.userAmount;
        let isEditable = !(user.userAmount == "");

        return (
        <View style={styles.userEntryContainer}>
            <CheckBox
                title={user.username}
                checked={this.state.checked}
                onPress={() => this._handleChecked()}
            />
            <TextInput
                underlineColorAndroid={ LIGHT_GRAY }
                style={{
                    flex: 1,
                    color: '#fff',
                }}
                value={textInputValue}
                editable={isEditable}
            />
        </View>
        );
    }
}

const styles = StyleSheet.create({
    userEntryContainer: {
        flex:1, 
        flexDirection: 'row'
    }
});

export default UserEntry;
