import { StyleSheet } from 'react-native';
import React from 'react';
import { Button } from 'react-native-elements';
import { Text, View } from './Themed';
import { Box, Center } from 'native-base';

export type destination = {
	latitude: Number;
	longitude: Number
}

const SecureRoutePopup = (props: {
	isSecureRouteSheetVisible: boolean;
	setSecureRouteSheetVisible: any;
	setAlertSheetVisible: any;
	setReportModelVisible: any;
	setFriendModelVisible: any;
	filterFriends: any;
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
					{props.filterFriends.selected.includes('Pete') ? <Box style={[styles.name, { backgroundColor: '#6EB3FF' } ]} ><Center>P</Center></Box> : <></> }
					{props.filterFriends.selected.includes('Nick') ? <Box style={[styles.name, { backgroundColor: '#E95B77' } ]} ><Center>N</Center></Box> : <></> }
					{props.filterFriends.selected.includes('Maya') ? <Box style={[styles.name, { backgroundColor: '#FAD234' } ]} ><Center>M</Center></Box> : <></> }
					{props.filterFriends.selected.includes('Sawarin') ? <Box style={[styles.name, { backgroundColor: '#C4C4C4' } ]} ><Center>S</Center></Box> : <></> }
					<Button
						title="+"
						titleStyle= {{ fontSize: 30, color: '#787880' }}
						buttonStyle={{ width: 38, height: 38, paddingLeft: 8, paddingTop: 0, borderRadius: 50, backgroundColor: '#F2F2F7' }}
						onPress={() => {
							props.setFriendModelVisible(true)
					}} />
				</View>
				<Button icon={{}}
					title="Report Crime"
					titleStyle= {{ fontSize: 18 }}
					buttonStyle={{ width: 150, paddingRight: 15, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 10, backgroundColor: '#7A9495'  }}
					onPress={() => { props.setReportModelVisible(true) }} />
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
		maxWidth: 360,
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
		width: 38,
		height: 38,
		borderRadius: 50,
		textAlign: 'center',
		paddingTop: 10,
		marginRight: 4
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
