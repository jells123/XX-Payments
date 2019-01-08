import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';

class Wait extends Component {

  render() {

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >

        <Toast ref="toast" position={'top'}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    
})

export default withNavigation(Wait);
