import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';
import ProgressBar from 'react-native-progress/Bar';

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

      let requestUri = `http://${global.ipAddress}:8000/kitty-transactions/?kitty=${this.props.navigation.getParam("kittyId", "")}`;
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
   
         var countProgress = 0;
         var countGoal = 0;
         for (var i = 0; i < responseJson.length; i++) {
           if ("state" in responseJson[i] && responseJson[i].state !== "OP") {
             countProgress++;
           }
            countGoal += responseJson[i].amount;
         }

         var negState = !this.state.refresh;
         this.setState({
           isLoading: false,
           kittyTransactions: responseJson,
           refresh: negState,
           progress: countProgress / responseJson.length,

           goal: countGoal
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

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.welcome}>Goal: {this.state.goal.toFixed(2)}</Text>
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
              
              let itemText = `${item.participant}: ${item.amount.toFixed(2)}`;
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
                <Text style={{...GlobalStyles.buttonText, fontSize: 17}}>GO BACK</Text>
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
    marginBottom: 15
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
    flex: 1, 
    justifyContent: 'flex-end'
  }
});

export default withNavigation(Wait);
