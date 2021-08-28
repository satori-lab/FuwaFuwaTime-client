import React from 'react';
import { animals } from './const';
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
	setAnimalType: any,
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
					onPress={() => {
						props.setAnimalType(animals.cat)
						closeModal()
					}}
				/>
				<Button
					title="犬"
					onPress={() => {
						Alert.alert("dog")
						props.setAnimalType(animals.dog)
						closeModal()
					}}
				/>
				<Button
					title="Close modal"
					onPress={closeModal}
				/>
			</View>
		</Modal>
	)
}
