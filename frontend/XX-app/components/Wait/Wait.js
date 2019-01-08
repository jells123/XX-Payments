import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';

import GlobalStyles from '../../constants/Style';
import Toast, {DURATION} from 'react-native-easy-toast';
import ProgressBar from 'react-native-progress/Bar';

class Wait extends Component {

  constructor(props) {
   super(props);

   this.state = {
     progress: 0,
     indeterminate: true,
   };
 }

 componentDidMount() {
   this.animate();
 }

 animate() {
   let progress = 0;
   this.setState({ progress });
   setTimeout(() => {
     this.setState({ indeterminate: false });
     setInterval(() => {
       progress += Math.random() / 5;
       if (progress > 1) {
         progress = 1;
       }
       this.setState({ progress });
     }, 500);
   }, 1500);
}

  render() {

    return (
      <ScrollView style={GlobalStyles.container}
          contentContainerStyle={styles.mainContainer}
      >
      <View style={styles.container}>
      <Text style={styles.welcome}>Your kitty status</Text>
      <ProgressBar
        style={styles.progress}
        progress={this.state.progress}
        indeterminate={this.state.indeterminate}
        />
        </View>
        <Toast ref="toast" position={'top'}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  progress: {
    margin: 10,
  },
  welcome: {
    ...GlobalStyles.commonText,
   fontSize: 20,
   textAlign: 'center',
   margin: 10,
  },
});

export default withNavigation(Wait);
