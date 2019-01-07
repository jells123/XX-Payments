import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { RadioGroup } from 'react-native-btr';

import { CheckBox } from 'react-native-elements';
import GlobalStyles from '../../constants/Style';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class KittyAmountInput extends Component {
  // https://gist.github.com/mmazzarolo/77407406eea9a574c060662ab1bcac1f
  state = {
    isFocused: false,
    amount: "0"
  };

  _handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  _handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  _handleTextChanged = (text) => {
    this.setState({
      amount: text.replace(/[^0-9.]/g, '')
    }, () => {
      this.props.handleKittyAmount(this.state.amount);
    })
  }

  render() {
    const { isFocused } = this.state;
    return (
      <TextInput style={styles.kittyInput}
        keyboardType='numeric'
        underlineColorAndroid={
          isFocused ? BLUE : LIGHT_GRAY
        }
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        value={this.state.amount}
        onChangeText = {(text) => this._handleTextChanged(text)}
      />
    )
  }
}

class UserEntry extends Component {
  
/*
to implement: componentWillReceiveProps...
*/

  state = {
    checked : false
  }

  _handleChecked = () => {
    this.setState({
      checked: !this.state.checked
    }, () => {
      this.props.handleCheck(this.props.title);
    });
  }

  render() {
    return (
      <View style={styles.userEntryContainer}>
        <CheckBox
          title={this.props.title}
          checked={this.state.checked}
          onPress={() => this._handleChecked()}
        />
        <TextInput
          underlineColorAndroid={ LIGHT_GRAY }
          style={{
            flex: 1
          }}
          value={this.props.userAmount}
        />
      </View>
    );
  }
}

class Collect extends Component {

  constructor(props) {
    super(props);

    var activeUsers = []
    for (var i = 0; i < 10; i++) {
      activeUsers.push({
        username: "user"+(i).toString(),
        id: i,
        userAmount: "-"
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
      kittyAmount: 0,
      activeUsers: activeUsers
    };
  }

  _handleKittyAmount = (amount) => {
    this.setState(
      { 
        kittyAmount: amount 
      },
      () => {
        // console.log(this.state.kittyAmount);
      }
    );
  }

  _handleUserEntryCheck = (entryName) => {
    console.log(entryName);
    console.log(this.state.activeUsers[parseInt(entryName[entryName.length - 1])]);
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
              title={item.username}
              handleCheck={this._handleUserEntryCheck}
              userAmount={item.userAmount}
            />
          }
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
  userEntryContainer: {
    flex:1, 
    flexDirection: 'row'
  }
})

export default withNavigation(Collect);
