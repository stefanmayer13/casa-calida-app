import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

class StatusBar extends Component{
  render(){
    return(
      <View style={[styles.statusBarBackground, this.props.style || {}]} />
    );
  }
}

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 20 : 0,
    backgroundColor: "white",
  }

})

module.exports= StatusBar