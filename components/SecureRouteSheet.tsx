import { StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'react-native-elements';
import { Text, View } from './Themed';
import { Box } from 'native-base';

export type destination = {
	latitude: Number;
	longitude: Number
}

const SecureRoutePopup = (props: {
	isSecureRouteSheetVisible: boolean;
	setSecureRouteSheetVisible: any;
	setAlertSheetVisible: any;
	routeDetail: any;
	}) => {

	return (
        <View style={styles.modal}>
			<View style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
				<Text style={styles.modalTitle}>{props.routeDetail.destination.name} </Text>
				<Text style={styles.modalTitle}> {props.routeDetail.distance } </Text>
			</View>

			<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent', alignItems: 'center' }}>
				<View style={{ backgroundColor: 'transparent' }}>
				<Text style={styles.modalSubTitle}> Tell Friends</Text>
				<View style={{ flex: 0, flexWrap: 'nowrap', justifyContent: 'flex-start', flexDirection: 'row', marginTop: 5, marginBottom: 10, backgroundColor: 'transparent' }}>
					<Box style={[styles.name, { backgroundColor: '#FFC700' } ]} >T</Box>
					<Box style={[styles.name, { backgroundColor: '#C4C4C4' } ]} >S</Box>
					<Box style={[styles.name, { backgroundColor: '#007AFF5D' } ]} >M</Box>
					<Box style={[styles.name, { backgroundColor: '#CC52709D' } ]} >W</Box>
					<Button icon={{}}
						title="+"
						titleStyle= {{ fontSize: 30, color: '#787880' }}
						buttonStyle={{ width: 40, height: 40, paddingLeft: 0, paddingTop: 0, borderRadius: 50, backgroundColor: '#F2F2F7' }}
						onPress={() => {
					}} />
				</View>
				<Button icon={{}}
					title="Report Crime"
					titleStyle= {{ fontSize: 18 }}
					buttonStyle={{ width: 150, paddingRight: 15, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 10, backgroundColor: '#7A9495'  }}
					onPress={() => { }} />
			</View>

			<Button icon={{}}
				title="SOS"
				titleStyle= {{ fontSize: 34 }}
				buttonStyle={styles.alertButton}
				onPress={() => {
					props.setSecureRouteSheetVisible(false);
					props.setAlertSheetVisible(true);
				}} />
		  </View>
        </View>
  );
};

export default SecureRoutePopup;

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
	  color: "#111"
	},
	name: {
		width: 40,
		height: 40,
		borderRadius: 50,
		padding: 10,
		paddingLeft: 14,
		marginRight: 5
	},
	modalButton: {
	  fontSize: 14
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
	}
  });
