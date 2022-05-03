import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Button, Chip } from 'react-native-elements';
import { Text, View } from './Themed';
import { getDirection } from '../screens/TabTwoScreen';

export type destination = {
	latitude: Number;
	longitude: Number
}

const RoutePopup = (props: {
	isRouteSheetVisible: boolean;
	setRouteSheetVisible: any;
	navigation: any;
	setSecureRouteStart: any;
	routeDetail: any; }) => {

	return (
        <View style={styles.modal}>
			<View style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
				<Text style={styles.modalTitle}>{props.routeDetail.destination.name} </Text>
				<Text style={styles.modalTitle}> {props.routeDetail.distance } </Text>
			</View>

			<Text style={styles.modalSubTitle}>{props.routeDetail.destination.address}</Text>
			{ getDirection(props.routeDetail) }
			<Text style={{ marginTop: 10, marginBottom: 10, fontSize: 15 }} > {props.routeDetail.crimes.name } : {props.routeDetail.crimes.value } times occurred in this route </Text>

			<View style={{ flex: 0, flexDirection: 'row', backgroundColor: 'transparent', marginTop:5, marginBottom: 5 }}>
				<Chip containerStyle={styles.chipMode} title="Bus"
				titleStyle={{ color: '#000' }}
				buttonStyle={{ backgroundColor: true ? '#007AFF4D' : '#ccc'}}
				onPress={() => {
					// setSelectedTransit(!isSelectedTransit);
				}} />
				<Chip containerStyle={styles.chipMode} title="Walk"
				titleStyle={{ color: '#000' }}
				buttonStyle={{ backgroundColor: true ? '#007AFF4D' : '#ccc'}}
				onPress={() => {
					// setSelectedWalking(!isSelectedWalking);
				}} />
			</View>

			<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' }}>
				<Button icon={{}}
					title="Back"
					titleStyle= {{ fontSize: 18, color: '#111' }}
					buttonStyle={{ paddingRight: 35, paddingLeft: 25, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 10, backgroundColor: '#F2F2F7' }}
					onPress={() => {
					props.setRouteSheetVisible(false);
					props.navigation.goBack();
				}} />
				<Button icon={{}}
					title="Start"
					titleStyle= {{ fontSize: 18 }}
					buttonStyle={{ paddingRight: 35, paddingLeft: 25, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 10, backgroundColor: '#7A9495'  }}
					onPress={() => { props.setRouteSheetVisible(false), props.setSecureRouteStart(true) }} />
		  </View>
        </View>
  );
};

export default RoutePopup;

const styles = StyleSheet.create({
	modal: {
		backgroundColor: 'transparent'
	},
	chip: {
		marginRight: 5,
		marginBottom: 5,
		color: '#000'
	},
	title: {
	  fontSize: 20,
	  marginTop: 10,
	  fontWeight: 'bold',
	  color: '#111'
	},
	modalTitle: {
	  fontSize: 20,
	  marginBottom: 10,
	  fontWeight: 'bold',
	  color: '#111'
	},
	modalSubTitle: {
	  fontSize: 16,
	  marginBottom: 10,
	  color: "#787880"
	},
	modalButton: {
	  fontSize: 14
	},
	chipMode: {
		marginRight: 5,
		marginBottom: 5,
		color: '#000',
		width: 75,
	},
  });
