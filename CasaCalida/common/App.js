/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

import React, {Component} from 'react';
import {
	AppRegistry,
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	TouchableHighlight,
	AlertIOS,
} from 'react-native';
import t from 'tcomb-form-native';

import config from '../config';

var styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		marginTop: 50,
		padding: 20,
		backgroundColor: '#ffffff',
	},
	title: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 30
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
});

const JWT_KEY = 'jwt';

const Form = t.form.Form;

const Person = t.struct({
	username: t.String,
	password: t.String
});

const options = {
	fields: {
		password: {
			secureTextEntry: true
		}
	}
};

export default class CasaCalida extends Component {
	async _getCsrf() {
		const response = await fetch(config.baseUrl + "v1/csrf/", {
			method: "GET",
		});

		const cookies = response.headers.map['set-cookie'][0]; //workaround as fetch doesn't allow set-cookie on get
		const cookie = cookies.split('; ').filter(cookie => cookie.indexOf('csrftoken') !== -1);
		if (cookie.length > 0) {
			const csrftoken = cookie[0].split('=')['1'];
			return csrftoken;
		}
		// No csrf token could be found
		return '';
	}

	async _onValueChange(item, selectedValue) {
		try {
			await AsyncStorage.setItem(item, selectedValue);
		} catch (error) {
			console.log('AsyncStorage error: ' + error.message);
		}
	}

	async _getProtectedData() {
		var jwt = await AsyncStorage.getItem(JWT_KEY);
		console.log(jwt); //TODO remove
		fetch(config.baseUrl + "v1/devices/", {
			credentials: 'include',
			method: "GET",
			headers: {
				'AUTHORIZATION': 'token=' + jwt,
			},
		})
			.then((response) => response.text())
			.then((data) => {
				const devices = JSON.parse(data);
				const deviceString = devices.devices.map(device => {
					const sensors = device.sensors.reduce((prev, sensor) => {
						let str = prev + '\r' + sensor.title;
						if (sensor.lastValue) {
							str += ': ' + sensor.lastValue.value + sensor.scale;
						}
						return str;
					}, '');
					return device.deviceType + sensors;
				}).reduce((prev, device) => prev + '\r\r' + device);
				AlertIOS.alert(
					"data:", deviceString);
			})
			.done();
	}

	async _userLogin() {
		var value = this.refs.form.getValue();
		if (value) { // if validation fails, value will be null
			csrf = await this._getCsrf();
			const formdata = new FormData();

			formdata.append("username", value.username);
			formdata.append("password", value.password);
			fetch(config.baseUrl + "v1/login/", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
					'X-CSRFToken': csrf,
				},
				body: formdata
			})
				.then((response) => response.json())
				.then((responseData) => {
					if (responseData.error) {
						AlertIOS.alert(
							"Login Error!",
							responseData.error,
						);
					} else {
						AlertIOS.alert(
							"Login Success!",
							"YAY!"
						);
						this._onValueChange(JWT_KEY, responseData.token);
					}
				})
				.done();
		}
	}

	async _userLogout() {
		try {
			await AsyncStorage.removeItem(JWT_KEY);
			AlertIOS.alert("Logout Success!");
		} catch (error) {
			console.log('AsyncStorage error: ' + error.message);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.row}>
					<Text style={styles.title}>Login below for CasaCalida</Text>
				</View>
				<View style={styles.row}>
					<Form
						ref="form"
						type={Person}
						options={options}
					/>
				</View>
				<View style={styles.row}>
					<TouchableHighlight style={styles.button} onPress={this._userLogin.bind(this)} underlayColor='#99d9f4'>
						<Text style={styles.buttonText}>Login</Text>
					</TouchableHighlight>
				</View>
				<View style={styles.row}>
					<TouchableHighlight onPress={this._getProtectedData.bind(this)} style={styles.button}>
						<Text style={styles.buttonText}>Get Data</Text>
					</TouchableHighlight>
				</View>
                <View style={styles.row}>
                    <TouchableHighlight style={styles.button} onPress={this._userLogout.bind(this)} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableHighlight>
                </View>
			</View>
		);
	}
};
