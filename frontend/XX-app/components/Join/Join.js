import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';


class Join extends Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true }
  }

  componentDidMount(){
    this._loadData();
  }

  _loadData = () => {
    let requestUri = `http://${global.ipAddress}:8000/transactions/`;
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
      console.log(responseJson);
      if (responseJson.detail) {
        this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
      } else {
        this.setState({
          isLoading: false,
          kittyInvitations: responseJson,
        });

        if (responseJson.length == 0) {
          this.refs.toast.show("You don't have any invitations yet :(",  DURATION.LENGTH_LONG);
        }
      }
    }).catch(err => {
      console.log(err);
      this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
    });
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
        this._loadData();
        this.forceUpdate();

      }).catch(err => {
        console.log(err);
        this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
      });
  };

  render() {
    {/*const { navigation } = this.props;
    this.setState({
      isLoading: false,
      dataSource: navigation.getParam("kittyInvitations"),
    }*/}

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
        <FlatList
          data={this.state.kittyInvitations}
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
