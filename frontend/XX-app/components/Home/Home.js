import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform
} from 'react-native';

import { StatusBar } from 'react-native';


// create a component
class Home extends Component {

  _onButtonCollectPress = () => {
      let requestUri = `http://${global.ipAddress}:8000/users-active/`;
      fetch(requestUri, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },

      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.props.navigation.navigate('Collect', {
          activeUsers: responseJson
        });
      }).catch(err => {
        console.log(err);
      });
  };

  render() {

    let actionButtonSize = Math.min((styles.ex.width - 4*styles.actionButton.margin) / 2, 170);

    const { navigation } = this.props;
    const username = navigation.getParam("username", "...");
    const userId = navigation.getParam("userId", -1);

    return (
        <ScrollView style={GlobalStyles.container}
            contentContainerStyle={styles.mainContainer}
        >
            <StatusBar hidden />
            {/* <ScrollView style={GlobalStyles.container}
                contentContainerStyle={styles.mainContainer}
            > */}

            <View style={styles.settingsContainer}>
                <Image style={{width:50, height:50}} source={require('../../assets/images/settings.png')} />
            </View>

            <View style={styles.welcomeContainer}>
                <Text style={styles.helloText}>Hello, {username}!</Text>
                <Text style={styles.whatToDoText}>What would you like to do?</Text>
            </View>

            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={{...styles.actionButton, width:actionButtonSize, height:actionButtonSize}}
                    onPress={this._onButtonCollectPress}>
                            <Text style={GlobalStyles.buttonText}>$ Collect $</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.actionButton, width:actionButtonSize, height:actionButtonSize}}
                    onPress={null}>
                            <Text style={GlobalStyles.buttonText}>$ Join $</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.descrContainer}>
                <Text style={styles.descrText}>
                    I want to create new money collection for my friends.
                </Text>
                <Text style={{...styles.descrText, textAlign: 'right'}}>
                    I want to join my friend's collection and send money.
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton}
                            onPress={null}>
                    <Text  style={GlobalStyles.commonText}>My Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}
                            onPress={this._onButtonPress}>
                    <Text  style={GlobalStyles.commonText}>History</Text>
                </TouchableOpacity>
            </View>

            {/* </ScrollView> */}
        </ScrollView>
    );
  }
}

export default withNavigation(Home);

const styles = StyleSheet.create({

    ex: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

    mainContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },

    settingsContainer: {
        flex: 0,
        alignItems: 'flex-end',
        padding: 10,
    },

    welcomeContainer: {
        flex: 1,
    },
    helloText: {
        ...GlobalStyles.commonText,
        fontSize: 30,
        marginBottom: 40
    },
    whatToDoText: {
        ...GlobalStyles.commonText,
        fontSize: 15
    },

    actionButtonsContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionButton: {
        ...GlobalStyles.buttonContainer,
        margin: 10,

        width: 125,
        height: 125,

        flex:1, justifyContent:'center'
    },
    descrContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    descrText: {
        flex:1,
        flexWrap:"wrap",
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        color: 'white'
    },

    optionsContainer: {
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 30
    },
    optionButton: {
        ...GlobalStyles.buttonContainer,
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 10,
        paddingBottom: 10,

        opacity: 0.8
    }

  });
