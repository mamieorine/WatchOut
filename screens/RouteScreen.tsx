import React from 'react';
import { StyleSheet } from 'react-native';

const containerStyle = {
	width: '400px',
	height: '400px'
};

const center = {
	lat: -3.745,
	lng: -38.523
};

export default function RouteScreen(props: {destination: any}) {
	window.google = window.google || {};
	google.maps = google.maps || {};
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
