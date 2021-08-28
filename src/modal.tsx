import React, { Component } from 'react';
import {
	// StyleSheet,
	View,
	Button,
	Text,
	Alert
} from 'react-native';
import Modal from "react-native-modal";


interface IProps {
	modalVisible: any,
	setModalVisible: any,
}

export const SelectModal = (props: IProps): React.ReactElement => {
	const closeModal = () => {
		props.setModalVisible(false);
	}
	return (
		<Modal
			isVisible={props.modalVisible}
		>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
				<Button
					title="猫"
					onPress={() => { closeModal() }}
				/>
				<Button
					title="犬"
					onPress={() => { closeModal() }}
				/>
				<Button
					title="Close modal"
					onPress={closeModal}
				/>
			</View>
		</Modal>
	)
}
