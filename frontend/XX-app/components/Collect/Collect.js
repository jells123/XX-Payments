import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';

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

  render() {
    const { navigation } = this.props;
    const activeUsers = navigation.getParam("activeUsers");

    return (
      <View style={GlobalStyles.container}>
        <View style={styles.kittyAmountContainer}>
          <Text style={styles.amountText}>Amount:</Text>
          <KittyAmountInput/>
          <Text style={styles.plnText}>PLN</Text>
        </View>
        {/* <FlatList
          data={activeUsers}
          renderItem={({item}) => <Text style={styles.item}>{item.username}</Text>}
          keyExtractor={(item) => item.id.toString()}
        /> */}
      </View>
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
  },
  kittyInput: {
    height: 40,
    paddingLeft: 6,
    flex: 1,
    margin:20,
    color: '#fff',
  },
  amountText: {
    ...GlobalStyles.commonText,
    marginLeft: 30
  },
  plnText: {
    ...GlobalStyles.commonText,
    marginRight: 30
  }
})

export default withNavigation(Collect);
