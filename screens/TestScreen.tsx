import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';

const containerStyle = {
	width: '400px',
	height: '400px'
};

const center = {
	lat: -3.745,
	lng: -38.523
};

// https://maps.googleapis.com/maps/api/directions/json?origin=Mango+Thai+Tapas+Bar+%26+Restaurant+%E2%80%93+Portswood&destination=University+of+Southampton&key=AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo&alternatives=true&mode=bicycling
export default function TestScreen(props: {destination: any}) {
	// const { isLoaded } = useLoadScript({
	// 	googleMapsApiKey: "AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo"
	// })

	// console.log(window.google.maps);

	window.google = window.google || {};
	google.maps = google.maps || {};
	console.log(google.maps);
	return (
		<></>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	input: {
		height: 45,
		width: 355,
		margin: 5,
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 10,
		padding: 10,
	},
});
