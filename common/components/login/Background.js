import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';

export default class Background extends Component {
	render() {
		return (
			<View style={styles.background}>
				{this.props.children}
			</View>
		);
	}
}

const styles = StyleSheet.create({
    background: {
		flex: 1,
		width: null,
		height: null,
        backgroundColor: 'grey'
    }
});