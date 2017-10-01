/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

// @flow
import React from 'react';
import { View, Text } from 'react-native';

export default class Footer extends React.Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'steelblue'}}>
        <Text>FOOTER</Text>
      </View>
    );
  }
}
