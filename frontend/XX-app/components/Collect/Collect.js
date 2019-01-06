import React, { Component } from 'react';
import { AppRegistry, FlatList, TouchableOpacity, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import GlobalStyles from '../../constants/Style';

import { RadioGroup } from 'react-native-btr';

const BLUE = "#428AF8";
const LIGHT_GRAY = "#D3D3D3";

class KittyAmountInput extends Component {
  // https://gist.github.com/mmazzarolo/77407406eea9a574c060662ab1bcac1f
  state = {
    isFocused: false
  };

  handleFocus = event => {
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  onTextChanged(text) {
    this.setState({
      amount: text.replace(/[^0-9.]/g, '')
    })
  }

  render() {
    const { isFocused } = this.state;
    return (
      <TextInput style={styles.kittyInput}
        placeholder="0.00"
        keyboardType='numeric'
        underlineColorAndroid={
          isFocused ? BLUE : LIGHT_GRAY
        }
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChangeText = {(text) => this.onTextChanged(text)}
      />
    )
  }
}

class Collect extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      divideOptions:[
        {
          label: "Divide evenly",
          color: '#fff',
          size: 5
        },
        { 
          label: "Custom...",
          color: '#fff', 
          size: 5
        },
      ],
    };
  }

  onDivideOptionPress = data => this.setState({ data });

  render() {
    const { navigation } = this.props;
    // const activeUsers = navigation.getParam("activeUsers");
    const activeUsers = [
      {
        username: "user1",
        id: 1
      },
      {
        username: "user2",
        id: 2
      },
      {
        username: "user3",
        id: 3
      }
    ];

    return (
      <ScrollView style={GlobalStyles.container}>
        <View style={styles.kittyAmountContainer}>
          <Text style={styles.amountText}>Amount:</Text>
          <KittyAmountInput/>
          <Text style={styles.plnText}>PLN</Text>
        </View>
        <View style={styles.divideOptionsContainer}>
          <RadioGroup
            radioButtons={this.state.divideOptions}
            onPress={this.onDivideOptionPress}
            labelStyle={styles.divideOptionLabel}
            style={{flex: 1}}
            // https://github.com/ThakurBallary/react-native-btr/blob/master/docs/RADIO_GROUP.md
          />
        </View>
        <View>
        <TouchableOpacity style={styles.createButton}
                  onPress={null}>
          <Text style={styles.createText}>CREATE</Text>
        </TouchableOpacity>
        </View>

      <View>
        <Text style={GlobalStyles.commonText}>Choose participants:</Text>
      </View>
        <FlatList
          data={activeUsers}
          renderItem={({item}) => <Text style={styles.item}>{item.username}</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
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
    flex: 1,
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
    flex:1,
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
  createText: {
    ...GlobalStyles.buttonText,
    fontSize: 17
  }
})

export default withNavigation(Collect);
