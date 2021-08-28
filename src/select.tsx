import React, { Component, ReactElement } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
// import { Constants } from 'expo';

// You can import from local files
// import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
// import { Card } from 'react-native-elements'; // 0.18.5


interface IProps {
	setModalVisible: any,
}
export default class Select extends Component<IProps> {
	constructor(props: any) {
		super(props);
	}
	_handleButtonPress = () => {
		this.props.setModalVisible(true)
	};

	render() {
		return (
			// <View style={styles.container}>
			<View >
				<Button
					title="Press me"
					color="#f194ff"
					onPress={this._handleButtonPress}
				/>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// paddingTop: Constants.statusBarHeight,
		backgroundColor: '#ecf0f1',
	},
	button: {
		textAlign: 'right',
	},
	paragraph: {
		margin: 24,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#34495e',
	},
});
