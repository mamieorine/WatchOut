import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Button, Chip } from 'react-native-elements';
import { Text, View } from '../components/Themed';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const DestinationPopup = (props: {
	isBottomSheetVisible: boolean;
	setBottomSheetVisible: any;
	navigation: any;
	origin: any;
	crimes: any;
	geometry: any; }) => {
	const [test, setTest] = useState<any>(['Violence Against The Person', 'Vehicle',
	'Theft', 'Drugs', 'Violent Crime', 'Robbery', 'Sexual Offense', 'Others'])
	// const [isSelectedTransit, setSelectedTransit] = useState(true)
	// const [isSelectedBicycle, setSelectedBicycle] = useState(true)
	// const [isSelectedWalking, setSelectedWalking] = useState(true)

	return (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{props.geometry.name}</Text>
          <Text style={styles.modalSubTitle}>{props.geometry.address}</Text>
		  <View style={{ flex: 0, flexWrap: 'wrap', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
			  {props.crimes.map((crime: any) => {
				  return <Chip containerStyle={styles.chip} title={crime.category}
					titleStyle={{ color: '#000' }}
					buttonStyle={{ backgroundColor: test.includes(crime.category) ? '#007AFF4D' : '#ccc' }}
					onPress={() => {
						let filtered = [...test];
						if (test.includes(crime.category)) {
							filtered = filtered.filter((cat) => {
								return cat !== crime.category;
							})
							setTest(filtered);
						} else {
							filtered.push(crime.category);
							setTest(filtered);
						}
					}}
					/>
			  })}
		  </View>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
			<Button icon={{}}
				title="Secure direction"
				titleStyle= {{fontSize: 18}}
				buttonStyle={{paddingRight: 20, paddingLeft: 10, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 10 }}
				onPress={() => {
				props.setBottomSheetVisible(false);
				props.navigation.replace('RouteScreen', {
					destination: props.geometry,
					origin: props.origin,
					crimes: props.crimes,
				});
			}} />
		  </View>
        </View>
  );
};

export default DestinationPopup;

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
	  color: '#ddd'
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
	},
	modalButton: {
	  fontSize: 14
	}
  });
