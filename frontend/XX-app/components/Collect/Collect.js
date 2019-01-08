import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { RadioGroup } from 'react-native-btr';

import Toast, {DURATION} from 'react-native-easy-toast';

import GlobalStyles from '../../constants/Style';

import KittyAmountInput from './KittyAmountInput';
import UserEntry from './UserEntry';

const DivideOptionEnum = {
  EVEN: 1,
  CUSTOM: 2
}

class Collect extends Component {

  constructor(props) {
    super(props);

    // generates dummy active users list...
    /*
    for (var i = 0; i < 10; i++) {
      activeUsers.push({
        username: "user"+(i).toString(),
        id: i,
        userAmount: ""
      })
    }
    */

    this.state =  {
      divideOptions: [
        {
          label: "Divide evenly", color: '#fff',
          size: 5, checked: true,
          type: DivideOptionEnum.EVEN
        },
        { 
          label: "Custom...", color: '#fff', 
          size: 5, checked: false,
          type: DivideOptionEnum.CUSTOM
        },
      ],
      kittyAmount: 0.0,
      activeUsers: [],
      refreshUsers: false,
    };
  }

  createKittyRequest = () => {
    
  // TODO:
  // disable 'CREATE' button when handling request/response
  
  if (this.state.kittyAmount == 0.0) {
    return;
  }

   let currentUsers = this.state.activeUsers;
   let requestUsersData = [];
    for (var i = 0; i < currentUsers.length; i++) {
      if (currentUsers[i].userAmount != "") {
        requestUsersData.push({
          username: currentUsers[i].username,
          amount: currentUsers[i].userAmount
        });
      }
    }

   let requestBody = JSON.stringify({
     amount: this.state.kittyAmount,
     participants: requestUsersData
   });

   let requestUri = `http://${global.ipAddress}:8000/kitties/`;

    fetch(requestUri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${global.token}`,
      },
      body: requestBody
    })
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      if (responseJson.error_message) {
        var obj = JSON.parse(repsonseJson);
        var values = Object.keys(obj).map(function (key) { return obj[key]; });
        console.log(values);
        this.refs.toast.show('Error occured',  DURATION.LENGTH_LONG);
      } else {
        this.refs.toast.show('Success! Kitty created',  DURATION.LENGTH_LONG);
        console.log(responseJson);

        var funny = this;
        setTimeout(function () {
          funny.props.navigation.navigate('Wait', {
            kittyData: responseJson,
            username: funny.props.navigation.getParam("username", "")
          });
        }, 1000);
      }
    }).catch(err => {
      console.log(err);
      this.refs.toast.show('Error occured when creating a kitty',  DURATION.LENGTH_LONG);
    }).finally(() => {
        ;
    });

  }

  getCurrentDivideOption = () => {
    let optionChosen = this.state.divideOptions.filter(
      function(item) {
        return item.checked == true;
      }
    )[0];
    return optionChosen.type;
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

  refreshUsersView = (updatedActiveUsers) => {
    var refresh = !this.state.refreshUsers;
    this.setState({
      activeUsers : updatedActiveUsers,
      refreshUsers: refresh
    });
  }

  updateEvenKittyParts = (kittyPart) => {
    let updatedActiveUsers = this.state.activeUsers;
    for (var i = 0; i < updatedActiveUsers.length; i++) {
      if (updatedActiveUsers[i].userAmount != "") {
        updatedActiveUsers[i].userAmount = kittyPart;
        updatedActiveUsers[i].isEditable = false;
      }
    }
    this.refreshUsersView(updatedActiveUsers);
  }

  setUsersEditable = () => {
    let updatedActiveUsers = this.state.activeUsers;
    for (var i = 0; i < updatedActiveUsers.length; i++) {
      if (updatedActiveUsers[i].userAmount != "") {
        updatedActiveUsers[i].isEditable = true;
      }
    }
    this.refreshUsersView(updatedActiveUsers);
  }

  _handleKittyAmount = (amount) => {
    this.setState(
      { 
        kittyAmount: amount 
      },
      () => {
        switch (this.getCurrentDivideOption()) {
          case DivideOptionEnum.EVEN:
            let kittyPart = this.countEvenKittyPart().toFixed(2);
            this.updateEvenKittyParts(kittyPart);
            break;
          case DivideOptionEnum.CUSTOM:
            // ... do nothing?
            break;
        }
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
    switch (this.getCurrentDivideOption()) {
      case DivideOptionEnum.EVEN:
        let kittyPart = this.countEvenKittyPart().toFixed(2);
        this.updateEvenKittyParts(kittyPart);
        break;
    }
  }

  onDivideOptionPress = (data) => {
    this.setState(
      { 
        divideOptions : data 
      },
      () => {
          switch (this.getCurrentDivideOption()) {
            case DivideOptionEnum.EVEN:
              let kittyPart = this.countEvenKittyPart().toFixed(2);
              this.updateEvenKittyParts(kittyPart);
              break;
            case DivideOptionEnum.CUSTOM:
              this.setUsersEditable();
              break;
          }
        }
      );
  };

  render() {
    
    // receive active users from navigation props
    // and add more properties
    // TODO: separate server response vs data stored about that response?

    const { navigation } = this.props;
    let activeUsers = navigation.getParam("activeUsers", "");
    let ownerUsername = navigation.getParam("username", "???");

    if (activeUsers != "") {

      let ownerUserItem = activeUsers.find(item => item.username === ownerUsername);
      activeUsers = activeUsers.filter(item => item.username !== ownerUsername);
      activeUsers.unshift(ownerUserItem);

      for (var i = 0; i < activeUsers.length; i++) {
        if (!("userAmount" in activeUsers[i])) {
          activeUsers[i].userAmount = "";
        }
        if (!("isEditable" in activeUsers[i])) {
          activeUsers[i].isEditable = false;
        }
        if (!("isOwner" in activeUsers[i])) {
          activeUsers[i].isOwner = false;
        }
      }

      ownerUserItem.isOwner = true;
      this.state.activeUsers = activeUsers;
    }

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
                    onPress={this.createKittyRequest}>
            <Text style={styles.createText}>CREATE</Text>
          </TouchableOpacity>
          <View style={styles.chooseTextContainer}>
            <Text style={GlobalStyles.commonText}>Choose participants:</Text>
          </View>
        </View>

      <ScrollView 
        style={styles.usersScrollView}
        contentContainerStyle={{flex: 1}}
      >
        <FlatList
          data={this.state.activeUsers}
          renderItem={
            ({item, index}) => {
              return (
                <UserEntry
                  user={item}
                  handleCheck={this._handleUserEntryCheck}
                  row={index}
                />
              );
            }
          }
          extraData={this.state.refreshUsers}
          keyExtractor={
            (item) => item.id.toString()
          }
        />
      </ScrollView>
      <Toast ref="toast"/>
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
    flex: 0.25,
    flexDirection: 'row',
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
    flex: 0.3,
    marginBottom: 10
  },
  chooseTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
    marginTop: 10,
  },
  createText: {
    ...GlobalStyles.buttonText,
    fontSize: 17
  },
  usersScrollView: {
    flex: 1, 
    marginTop: 20, marginBottom: 10, marginLeft: 5, marginRight: 5,
    backgroundColor: '#8425a3'
  }
})

export default withNavigation(Collect);
