import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Button, Chip } from 'react-native-elements';
import { Text, View } from './Themed';
import { getDirection } from '../screens/TabTwoScreen';
import { Box, Row } from 'native-base';

export type destination = {
	latitude: Number;
	longitude: Number
}

const AlertPopup = (props: {
	isAlertSheetVisible: boolean;
	setAlertSheetVisible: any;
	routeDetail: any;
	}) => {

	return (
		<View style={styles.modal}>
			<Button icon={{}}
				title="SOS"
				titleStyle= {{ fontSize: 34 }}
				buttonStyle={styles.alertButton}
				onPress={() => {}} />

			<Text style={styles.title}>Current location </Text>
			<Row style={{ flex: 0, justifyContent: 'space-between', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
				<Text style={styles.subTitle}>Latitude: 4.2304934</Text>
				<Text style={styles.subTitle}>Longitude: -1.343490</Text>
			</Row>
		</View>
	);
};

export default AlertPopup;

const styles = StyleSheet.create({
	modal: {
		backgroundColor: 'transparent',
		maxWidth: 370,
		width: '100%',
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
	  fontSize: 20,
	  marginTop: 10,
	  marginBottom: 10,
	  fontWeight: 'bold',
	  color: '#111'
	},
	subTitle: {
	  fontSize: 16,
	  marginBottom: 10,
	  color: '#111'
	},
	alertButton: {
		width: 100,
		height: 100,
		margin: 6,
		marginTop: 10,
		paddingLeft: 0,
		borderRadius: 50,
		backgroundColor: '#F64E4E',
		shadowColor: '#666',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		zIndex: 1000,
		position: 'absolute',
		top: -40,
	}
  });
