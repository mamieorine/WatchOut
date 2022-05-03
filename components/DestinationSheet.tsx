import { StyleSheet } from 'react-native';
import React from 'react';
import { Button, Chip } from 'react-native-elements';
import { Text, View } from './Themed';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const DestinationPopup = (props: {
	isDestSheetVisible: boolean;
	setDestSheetVisible: any;
	navigation: any;
	origin: any;
	crimes: any;
	filterCrimes: any[];
	onFilterCrimesChange: any;
	geometry: any; }) => {

	return (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{props.geometry.name}</Text>
          <Text style={styles.modalSubTitle}>{props.geometry.address}</Text>
		  <View style={{ flex: 0, flexWrap: 'wrap', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
			  {props.crimes.map((crime: any, index: number) => {
				  return <Chip containerStyle={styles.chip} title={crime.category}
					key={index}
					titleStyle={{ color: '#000' }}
					buttonStyle={{ backgroundColor: props.filterCrimes.includes(crime.category) ? '#FF47734D' : '#ccc' }}
					onPress={() => {
						let filtered = [...props.filterCrimes];
						if (props.filterCrimes.includes(crime.category)) {
							filtered = filtered.filter((cat) => {
								return cat !== crime.category;
							})
							props.onFilterCrimesChange(filtered);
						} else {
							filtered.push(crime.category);
							props.onFilterCrimesChange(filtered);
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
				props.setDestSheetVisible(false);
				props.navigation.replace('RouteScreen', {
					destination: props.geometry,
					origin: props.origin,
					crimes: props.crimes,
					filterCrimes: props.filterCrimes
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
