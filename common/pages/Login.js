/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

// @flow
import React from 'react';
import Logo from '../components/login/Logo';
import Form from '../components/login/Form';
import Background from '../components/login/Background';
import ButtonSubmit from '../components/login/ButtonSubmit';

export default class App extends React.Component {
  render() {
    return (
        <Background>
            <Logo />
            <Form />
            <ButtonSubmit/>
        </Background>
    );
  }
}
