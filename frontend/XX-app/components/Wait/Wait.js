import React, { Component } from 'react';
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';
import ProgressBar from 'react-native-progress/Bar';

function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

class Wait extends Component {

  constructor(props) {
   super(props);
   this.state = {

     isLoading: true,
     progress: 0,
     kittyTransactions: "",
     refresh: false,

     goal: 0,
     currentAmount: 0

   };
 }

 async componentDidMount() {
  try {
    let intervalId = setInterval(() => {
      this.state.isLoading = true;

      let requestUri = `http://${global.ipAddress}:8000/kitties/${this.props.navigation.getParam("kittyId", "")}/`;
      fetch(requestUri, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${global.token}`,
        },
      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.detail) {
          this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
        } else {

         console.log(responseJson);
         let participants = responseJson.participants;
         partcipants = sortByKey(participants, 'id');

         var countProgress = 0;
         var countCurrentAmount = 0;
         for (var i = 0; i < participants.length; i++) {
           if ("state" in participants[i] && participants[i].state !== "OP") {
             countProgress++;
             if (participants[i].state === "AC") {
               countCurrentAmount += participants[i].amount;
             }
           }
         }

         var negState = !this.state.refresh;
         this.setState({
           isLoading: false,
           kittyTransactions: participants,
           refresh: negState,
           progress: countProgress / participants.length,

           goal: responseJson.amount,
           currentAmount: countCurrentAmount
         }, () => {
           if (this.state.progress === 1) {
             clearInterval(intervalId);
             this.refs.toast.show('Kitty finished!',  DURATION.LENGTH_LONG);
           }
         });

        }
      }).catch(err => {
        console.log(err);
        this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
      });
    }, 1000);
  }
  catch (e) {
    console.log(e);
  }
 }

  _onGoBackButtonPress = () => {
    this.props.navigation.navigate('Home');
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20, backgroundColor: '#8425a3'}}>
          <ActivityIndicator size="large" color="#ffffff"/>
        </View>
      )
    }

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.welcome}>Goal: {this.state.currentAmount.toFixed(2)} / {this.state.goal.toFixed(2)}</Text>
          <ProgressBar
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            />
        </View>
        <View style={styles.usersContainer}>
          <FlatList
            data={this.state.kittyTransactions}
            renderItem={({item}) => {
              let itemStyle = item.state === "RJ" ? styles.red : item.state === "AC" ? styles.green : styles.neutral;
              
              let itemText = `${item.username}: ${item.amount.toFixed(2)}`;
              if (item.state === "OP") {
                let itemStyle = styles.neutral;
                itemText += " - waiting...";
              }
              else if (item.state === "AC") {
                let itemStyle = styles.green;
                itemText += " - accept!";
              }
              else if (item.state === "RJ") {
                let itemStyle = styles.red;
                itemText += " - reject";
              }

              return (
                <View style={StyleSheet.flatten([styles.user, itemStyle])}>
                  <Text style={styles.item}>
                    {itemText}
                  </Text>
                </View>
              );
              }
            }
            keyExtractor={(item) => item.id.toString()}
            extraData={this.state.refresh}
          />
        </View>
        {this.state.progress === 1 &&
          <View style={styles.goBackButtonContainer}>
            <TouchableOpacity style={{...GlobalStyles.buttonContainer, alignItems: 'center'}}
                onPress={this._onGoBackButtonPress}>
                <Text style={{...GlobalStyles.buttonText, fontSize: 14}}>GO BACK</Text>
            </TouchableOpacity>
          </View>
        }
        <Toast ref="toast" position={'top'}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
      ...GlobalStyles.commonText,
      padding: 10,
      fontSize: 18,
      height: 44,
  },
  mainContainer: {
    flex: 1
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  progress: {
    margin: 10,
  },
  welcome: {
    ...GlobalStyles.commonText,
   fontSize: 20,
   textAlign: 'center',
   margin: 10,
  },
  usersContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: 20,
  },
  user: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
    opacity: 0.8
  },
  red: {
    backgroundColor: '#FF0000',
  },
  green: {
    backgroundColor: '#006400',
  },
  neutral: {
    backgroundColor: '#8425a3',
  },
  goBackButtonContainer: {
    flex: 0,
    justifyContent: 'flex-end',
    marginLeft: 60,
    marginRight: 60
  }
});

export default withNavigation(Wait);
