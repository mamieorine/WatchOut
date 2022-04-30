import { StyleSheet } from 'react-native';
import React from 'react';
import { Button, Chip } from 'react-native-elements';
import { Text, View } from '../components/Themed';

// import { useNavigation } from '@react-navigation/native';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const DestinationPopup = (props: {
	isBottomSheetVisible: boolean;
	setBottomSheetVisible: any;
	navigation: any;
	geometry: any; }) => {

	// const navigation = useNavigation();

	return (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{props.geometry.name}</Text>
          <Text style={styles.modalSubTitle}>{props.geometry.address}</Text>
		  <View style={{ flex: 0, flexWrap: 'wrap', flexDirection: 'row', marginTop: 5, backgroundColor: 'transparent' }}>
		  	  <Chip containerStyle={styles.chip} title="Solid"
				titleStyle={{ color: '#000' }}
				buttonStyle={{ backgroundColor: '#FF47734D'}}
				/>
			  <Chip containerStyle={styles.chip} disabled={true} title="Chip"
			  	buttonStyle={{ backgroundColor: '#FF47734D'}}
			  	/>
			  <Chip containerStyle={styles.chip} disabled={true} title="Solihip"
			  	buttonStyle={{ backgroundColor: 'r##FF47734D'}}
			  	/>
			  <Chip containerStyle={styles.chip} disabled={true} title="Solid Chip"
			  	buttonStyle={{ backgroundColor: '#FF47734D'}}
			  />
		  </View>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
			<Button icon={{}}
				title="Secure direction"
				titleStyle= {{fontSize: 18}}
				buttonStyle={{paddingRight: 20, paddingLeft: 10, paddingTop: 10, paddingBottom: 10, borderRadius: 50, marginTop: 15 }}
				onPress={() => {
				props.setBottomSheetVisible(false);
				props.navigation.navigate('Test', {
					destination: props.geometry.name,
					distance: props.geometry.distance
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
	  fontSize: 16
	}
  });
