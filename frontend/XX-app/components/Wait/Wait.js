import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';
import ProgressBar from 'react-native-progress/Bar';

class Wait extends Component {

  constructor(props) {
   super(props);
   this.state ={ isLoading: true };
   this.state = {
     progress: 0,
   };
 }

 componentDidMount() {
   //this.animate();
   this._loadData();
 }

 _loadData = async () => {
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
       this.setState({
         isLoading: false,
         kittyTransactions: responseJson,
       });
     }
   }).catch(err => {
     console.log(err);
     this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
   });
 }

 animate() {
   let progress = 0;
   this.setState({ progress });
   setTimeout(() => {
     this.setState({ indeterminate: false });
     setInterval(() => {
       progress += Math.random() / 5;
       if (progress > 1) {
         progress = 1;
       }
       this.setState({ progress });
     }, 500);
   }, 1500);
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
          renderItem={({item}) =>
            <View style={styles.transactionContainer}>
              <Text style={styles.item}>
                {item.participant} owes you {item.amount}zł
              </Text>
            </View>
          }
          keyExtractor={(item) => item.id.toString()}
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
  transactionContainer: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA7777',
    marginTop: 15,
    marginBottom: 15
  },
});

export default withNavigation(Wait);
//#98FB98 #EA7777
