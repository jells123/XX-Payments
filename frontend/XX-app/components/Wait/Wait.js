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
     refresh: false

   };
 }

 async componentDidMount() {
  try {
    setInterval(this._loadData, 1000);
  } 
  catch (e) {
    console.log(e);
  }
 }

 _loadData = async () => {
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

      var negState = !this.state.refresh;
      this.setState({
        isLoading: false,
        kittyTransactions: responseJson,
        refresh: negState
      }, () => {
        ; // hehe
      });

       for (var i = 0; i < responseJson.length; i++) {
         if ("state" in responseJson[i] && responseJson[i].state !== "OP") {
           var currentProgress = this.state.progress;
           this.setState({
             progress: currentProgress + (1 / (responseJson.length - 1))
           });
         }
       }
     }
   }).catch(err => {
     console.log(err);
     this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
   });
 }

  render() {
    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.container}>
          <Text style={styles.welcome}>Your kitty status</Text>
          <ProgressBar
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
            />
          </View>
          <FlatList
            data={this.state.kittyTransactions}
            renderItem={({item}) => {
              let itemStyle = item.state === "RJ" ? styles.red : item.state === "AC" ? styles.green : styles.neutral;
              return (
                <View style={itemStyle}>
                  <Text style={styles.item}>
                    {item.participant} : {item.state}
                  </Text>
                </View>
              );
              }
            }
            keyExtractor={(item) => item.id.toString()}
            extraData={this.state.refresh}
          />
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
  container: {
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
  red: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA7777',
    marginTop: 15,
    marginBottom: 15
  },
  green: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#60d260',
    marginTop: 15,
    marginBottom: 15
  },
  neutral: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8425a3',
    marginTop: 15,
    marginBottom: 15
  },
});

export default withNavigation(Wait);
//#98FB98 #EA7777
//{/*<View style={(item.state === "OP") ? (styles.neutral) : ((item.state === 'AC') ? (styles.green) : (styles.red))}>*/}
// owes you {item.amount}zł
