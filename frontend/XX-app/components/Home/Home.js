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

// create a component
class Home extends Component {
  render() {

    let actionButtonSize = Math.min((styles.ex.width - 4*styles.actionButton.margin) / 2, 170);
    console.log(actionButtonSize);

    return (
        <View style={GlobalStyles.container}>
            <ScrollView style={GlobalStyles.container} 
                contentContainerStyle={styles.mainContainer}
            >

            <View style={styles.settingsContainer}> 
                <Image style={{width:50, height:50}} source={require('../../assets/images/settings.png')} />
            </View>

            <View style={styles.welcomeContainer}>
                <Text style={styles.helloText}>Hello, ...!</Text>
                <Text style={styles.whatToDoText}>What would you like to do?</Text>                
            </View>
        
            <View style={styles.actionsContainer}>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={{...styles.actionButton, width:actionButtonSize, height:actionButtonSize}} onPress={null}>
                                <Text style={GlobalStyles.buttonText}>$ Collect $</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.actionButton, width:actionButtonSize, height:actionButtonSize}} onPress={null}>
                                <Text style={GlobalStyles.buttonText}>$ Join $</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.descrContainer}>
                    <Text style={styles.descrText}>
                        I want to create new money collection for my friends.
                    </Text>
                    <Text style={styles.descrText}>
                        I want to join my friend's collection and send money.
                    </Text>
                </View>
            </View>

            <View style={styles.optionsContainer}>

            </View>

            {/* <View style={styles.welcomeContainer}>
                <Image
                source={
                    __DEV__
                    ? require('../../assets/images/robot-dev.png')
                    : require('../../assets/images/robot-prod.png')
                }
                style={styles.welcomeImage}
                />
            </View>

            <View style={styles.getStartedContainer}>
                {this._maybeRenderDevelopmentModeWarning()}

                <Text style={styles.getStartedText}>Get started by opening</Text>

                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
                </View>

                <Text style={styles.getStartedText}>
                Change this text and your app will automatically reload.
                </Text>
            </View>

            <View style={styles.helpContainer}>
                <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
                <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
                </TouchableOpacity>
            </View> */}

            </ScrollView>
        </View>
    );
  }

//   _maybeRenderDevelopmentModeWarning() {
//     if (__DEV__) {
//       const learnMoreButton = (
//         <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
//           Learn more
//         </Text>
//       );

//       return (
//         <Text style={styles.developmentModeText}>
//           Development mode is enabled, your app will be slower but you can use useful development
//           tools. {learnMoreButton}
//         </Text>
//       );
//     } else {
//       return (
//         <Text style={styles.developmentModeText}>
//           You are not in development mode, your app will run at full speed.
//         </Text>
//       );
//     }
//   }

//   _handleLearnMorePress = () => {
//     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
//   };

//   _handleHelpPress = () => {
//     WebBrowser.openBrowserAsync(
//       'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
//     );
//   };
}

export default withNavigation(Home);

const styles = StyleSheet.create({

    ex: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },

    mainContainer: {
        flex: 1
    },

    settingsContainer: {
        flex: 0.1,
        alignItems: 'flex-end',
        padding: 20,
    },

    welcomeContainer: {
        flex: 1,
        margin: 40
    },
    helloText: {
        ...GlobalStyles.commonText,
        fontSize: 30,
        margin: 40
    },
    whatToDoText: {
        ...GlobalStyles.commonText,
        fontSize: 15
    },

    actionsContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionButton: {
        backgroundColor: '#4d4dff',
        margin: 10,

        width: 125,
        height: 125,

        flex:1, justifyContent:'center'
    },
    descrContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    descrText: {
        flex:1,
        flexWrap:"wrap",
        margin: 10
    },

    optionsContainer: {
        flex: 1,
    }

    // container: {
    //   flex: 1,
    //   backgroundColor: '#fff',
    // },
    // developmentModeText: {
    //   marginBottom: 20,
    //   color: 'rgba(0,0,0,0.4)',
    //   fontSize: 14,
    //   lineHeight: 19,
    //   textAlign: 'center',
    // },
    // contentContainer: {
    //   paddingTop: 30,
    // },
    // welcomeContainer: {
    //   alignItems: 'center',
    //   marginTop: 10,
    //   marginBottom: 20,
    // },
    // welcomeImage: {
    //   width: 100,
    //   height: 80,
    //   resizeMode: 'contain',
    //   marginTop: 3,
    //   marginLeft: -10,
    // },
    // getStartedContainer: {
    //   alignItems: 'center',
    //   marginHorizontal: 50,
    // },
    // homeScreenFilename: {
    //   marginVertical: 7,
    // },
    // codeHighlightText: {
    //   color: 'rgba(96,100,109, 0.8)',
    // },
    // codeHighlightContainer: {
    //   backgroundColor: 'rgba(0,0,0,0.05)',
    //   borderRadius: 3,
    //   paddingHorizontal: 4,
    // },
    // getStartedText: {
    //   fontSize: 17,
    //   color: 'rgba(96,100,109, 1)',
    //   lineHeight: 24,
    //   textAlign: 'center',
    // },
    // tabBarInfoContainer: {
    //   position: 'absolute',
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    //   ...Platform.select({
    //     ios: {
    //       shadowColor: 'black',
    //       shadowOffset: { height: -3 },
    //       shadowOpacity: 0.1,
    //       shadowRadius: 3,
    //     },
    //     android: {
    //       elevation: 20,
    //     },
    //   }),
    //   alignItems: 'center',
    //   backgroundColor: '#fbfbfb',
    //   paddingVertical: 20,
    // },
    // tabBarInfoText: {
    //   fontSize: 17,
    //   color: 'rgba(96,100,109, 1)',
    //   textAlign: 'center',
    // },
    // navigationFilename: {
    //   marginTop: 5,
    // },
    // helpContainer: {
    //   marginTop: 15,
    //   alignItems: 'center',
    // },
    // helpLink: {
    //   paddingVertical: 15,
    // },
    // helpLinkText: {
    //   fontSize: 14,
    //   color: '#2e78b7',
    // },
  });
