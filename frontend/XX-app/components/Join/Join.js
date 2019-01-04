import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';

class Join extends Component {

  _onButtonAcceptPress = (transaction) => {
      transaction.state = 'AC';

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

      }).catch(err => {
        console.log(err);
      });
  };

  render() {
    const { navigation } = this.props;
    const kittyInvitations = navigation.getParam("kittyInvitations");
    let actionButtonSize = Math.min((styles.ex.width - 4*styles.actionButton.margin) / 2, 170);

    return (
      <View style={GlobalStyles.container}>
        <FlatList
          data={kittyInvitations}
          renderItem={({item}) =>
            <View>
            <Text style={styles.item}>
              You owe {item.kitty_owner} {item.amount}zł
            </Text>
            <TouchableOpacity style={{...styles.actionButton}}
                onPress={this._onButtonAcceptPress(item)}>
                        <Text style={GlobalStyles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.actionButton}}
                onPress={null}>
                        <Text style={GlobalStyles.buttonText}>Reject</Text>
            </TouchableOpacity>
            </View>
          }
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ex: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
  },
  item: {
      ...GlobalStyles.commonText,
      padding: 10,
      fontSize: 18,
      height: 44,
  },
  actionButton: {
      ...GlobalStyles.buttonContainer,
      margin: 10,

      width: 125,
      height: 125,

      flex:1, justifyContent:'center'
  },
})

export default withNavigation(Join);
