import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';


class Join extends Component {

  componentDidMount(){
         // Start counting when the page is loaded
         this.timeoutHandle = setTimeout(()=>{
              // Add your logic for the transition
         }, 5000);
    }

    componentWillUnmount(){
         clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
    }


  _onButtonPress = (transaction, accepted) => {
      transaction.state = accepted ? 'AC': 'RJ';

      let requestUri = `http://${global.ipAddress}:8000/transactions/${transaction.id}/`;
      fetch(requestUri, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${global.token}`,
        },
        body: JSON.stringify(transaction),

      })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.refs.toast.show(`${accepted ? 'Accepted': 'Rejected'}`,  DURATION.LENGTH_LONG);

      }).catch(err => {
        console.log(err);
        this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
      });
  };

  render() {
    const { navigation } = this.props;
    const kittyInvitations = navigation.getParam("kittyInvitations");

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
        <FlatList
          data={kittyInvitations}
          renderItem={({item}) =>
            <View style={styles.invitationContainer}>
              <Text style={styles.item}>
                You owe {item.kitty_owner} {item.amount}zł
              </Text>
                <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={{...styles.actionButton, backgroundColor: '#006400'}}
                    onPress={() => this._onButtonPress(item, true)}>
                            <Text style={GlobalStyles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.actionButton, backgroundColor: '#FF0000'}}
                    onPress={() => this._onButtonPress(item, false)}>
                            <Text style={GlobalStyles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
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
  actionButton: {
      ...GlobalStyles.buttonContainer,
      margin: 10,

      width: 100,
      height: 50,

      flex:1, justifyContent:'center'
  },
  actionButtonsContainer: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  invitationContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8425a3',
    marginTop: 15,
    marginBottom: 15
  },
})

export default withNavigation(Join);
