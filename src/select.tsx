import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Icon } from "react-native-elements"

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
				<Icon
					name='user'
					type='evilicon'
					color='#517fa4'
					// reverse
					// raised
					size={50}
					// background="#ffffff"
					// title="Press me"
					// color="#f194ff"
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
