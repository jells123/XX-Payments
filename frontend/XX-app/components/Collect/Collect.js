import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { RadioGroup } from 'react-native-btr';

import GlobalStyles from '../../constants/Style';
import { update } from 'tcomb';

import KittyAmountInput from './KittyAmountInput';
import UserEntry from './UserEntry';

class Collect extends Component {

  constructor(props) {
    super(props);

    var activeUsers = []
    for (var i = 0; i < 10; i++) {
      activeUsers.push({
        username: "user"+(i).toString(),
        id: i,
        userAmount: ""
      })
    }

    this.state =  {
      divideOptions: [
        {
          label: "Divide evenly",
          color: '#fff',
          size: 5,
          checked: true
        },
        { 
          label: "Custom...",
          color: '#fff', 
          size: 5, 
          checked: false
        },
      ],
      kittyAmount: 0.0,
      activeUsers: activeUsers,
      refreshUsers: false
    };
  }

  countActiveUsers = () => {
    let counter = 0;
    for (var i = 0; i < this.state.activeUsers.length; i++) {
      if (this.state.activeUsers[i].userAmount != "")
        counter++;
    }

    return counter;
  }

  countEvenKittyPart = () => {
    let count = this.countActiveUsers();
    let kitty = this.state.kittyAmount;
    return (kitty / parseFloat(count));
  }

  updateEvenKittyParts = (kittyPart) => {
    let updatedActiveUsers = this.state.activeUsers;
    for (var i = 0; i < updatedActiveUsers.length; i++) {
      if (updatedActiveUsers[i].userAmount != "") {
        updatedActiveUsers[i].userAmount = kittyPart;
      }
    }

    var refresh = !this.state.refreshUsers;
    this.setState({
      activeUsers : updatedActiveUsers,
      refreshUsers: refresh
    });
  }

  _handleKittyAmount = (amount) => {
    this.setState(
      { 
        kittyAmount: amount 
      },
      () => {
        let kittyPart = this.countEvenKittyPart().toFixed(2);
        this.updateEvenKittyParts(kittyPart);
      }
    );
  }

  _handleUserEntryCheck = (entryId) => {
    
    let updatedActiveUsers = this.state.activeUsers;

    if (updatedActiveUsers[entryId].userAmount == "") {
      // add new user to the kitty (checked)
      updatedActiveUsers[entryId].userAmount = "!";
    }
    else {
      // user removed from kitty (unchecked)
      updatedActiveUsers[entryId].userAmount = "";
    }
    let kittyPart = this.countEvenKittyPart().toFixed(2);
    this.updateEvenKittyParts(kittyPart);
  }

  onDivideOptionPress = data => this.setState({ data });

  render() {
    const { navigation } = this.props;
    // const activeUsers = navigation.getParam("activeUsers");

    return (
      <ScrollView 
        style={GlobalStyles.container}
        contentContainerStyle={{flex: 1}}
      >
        <View style={styles.kittyAmountContainer}>
          <Text style={styles.amountText}>Amount:</Text>
          <KittyAmountInput
            handleKittyAmount={this._handleKittyAmount}
          />
          <Text style={styles.plnText}>PLN</Text>
        </View>
        <View style={styles.divideOptionsContainer}>
          <RadioGroup
            radioButtons={this.state.divideOptions}
            onPress={this.onDivideOptionPress}
            labelStyle={styles.divideOptionLabel}
            // https://github.com/ThakurBallary/react-native-btr/blob/master/docs/RADIO_GROUP.md
          />
        </View>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity style={styles.createButton}
                    onPress={null}>
            <Text style={styles.createText}>CREATE</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.commonText}>Choose participants:</Text>
        </View>

      <ScrollView 
        style={{flex: 1, marginTop: 20, marginBottom: 10, marginLeft: 5, marginRight: 5}}
        contentContainerStyle={{flex: 1}}
      >
        <FlatList
          data={this.state.activeUsers}
          renderItem={
            ({item}) => 
            <UserEntry
              user={item}
              handleCheck={this._handleUserEntryCheck}
            />
          }
          extraData={this.state.refreshUsers}
          keyExtractor={
            (item) => item.id.toString()
          }
        />
      </ScrollView>
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
  kittyAmountContainer: {
    flex: 0.3,
    flexDirection: 'row',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#8425a3',
    marginTop: 15,
    marginBottom: 15
  },
  kittyInput: {
    height: 40,
    paddingLeft: 6,
    flex: 1,
    margin: 20,
    color: '#fff',
    fontSize: 18
  },
  amountText: {
    ...GlobalStyles.commonText,
    marginLeft: 30,
    fontSize: 18
  },
  plnText: {
    ...GlobalStyles.commonText,
    marginRight: 30,
    fontSize: 18
  },
  divideOptionsContainer: {
    flex:0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divideOptionLabel: {
    color: '#fff'
  },
  createButton: {
    ...GlobalStyles.buttonContainer,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 60,
    marginRight: 60,
    paddingTop: 10,
    paddingBottom: 10
  },
  createButtonContainer: {
    flex:0.3,
  },
  createText: {
    ...GlobalStyles.buttonText,
    fontSize: 17
  },
})

export default withNavigation(Collect);
