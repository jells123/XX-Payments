import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MonoText } from '../../components/StyledText';
import GlobalStyles from '../../constants/Style';

class Collect extends Component {

  render() {
    const { navigation } = this.props;
    const activeUsers = navigation.getParam("activeUsers");

    return (
      <View style={GlobalStyles.container}>
        <FlatList
          data={activeUsers}
          renderItem={({item}) => <Text style={styles.item}>{item.username}</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
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
})

export default withNavigation(Collect);
