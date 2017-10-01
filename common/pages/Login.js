/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

// @flow
import React from 'react';
import { View } from 'react-native';

import AWS from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  CognitoIdToken,
} from 'react-native-aws-cognito-js';

import StatusBar from '../components/Statusbar';
import Logo from '../components/login/Logo';
import Form from '../components/login/Form';
import Footer from '../components/login/Footer';

const userPool = new CognitoUserPool({
  UserPoolId: 'eu-central-1_ZZ7suYNpa',
  ClientId: '34akno94tavq3lo8ae3qt0501o'
});

export default class App extends React.Component {

  login(username, password) {
    username = "smayer";
    password = "test";
    const authenticationData = {
      Username: username,
      Password: password,
    };
    
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('result: ', result);
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        alert('Success');
      },
      onFailure: (err) => {
        console.error(err);
      },
      mfaRequired: (codeDeliveryDetails) => {
        console.error("mfaRequired");
      }
    });
  }

  render() {
    return (
        <View style={{flex: 1}}>
          <StatusBar style={{backgroundColor:'white'}}/>
          <Logo />
          <Form submit={this.login}/>
          <Footer />
        </View>
    );
  }
}
