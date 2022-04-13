import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState } from 'react';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const GooglePlacesInput = (props: { geometry: Geometry; onDestinationChange: any; }) => {
	const [geometry, onGeometryChange] = useState({
		latitude: 51.2419894,
		longitude: -0.7035547
	});

	props.onDestinationChange(geometry);

  return (
		<GooglePlacesAutocomplete
			placeholder='Search destination'
			minLength={2}
			onFail={error => console.log('error' + error)}
			fetchDetails={true}
			// currentLocation={true}
			onPress={(data, details = null) => {
				if (!details) return;
				onGeometryChange({
					latitude: details.geometry.location.lat,
					longitude: details.geometry.location.lng
				})
			}}
			styles={{
				container: {
					zIndex: 10,
					paddingBottom: 0,
					flexGrow: 1
				},
				textInputContainer: {
				  backgroundColor: 'grey',
				  width: '100%',
				  padding: 10,
				},
				textInput: {
				  height: 45,
				  color: '#5d5d5d',
				  fontSize: 16,
				},
				predefinedPlacesDescription: {
				  color: '#1faadb',
				},
				listView: {
					position: 'absolute',
					top: 60,
					left: 10,
					right: 10,
					backgroundColor: 'white',
					borderRadius: 5,
					flex: 1,
					elevation: 3,
					zIndex: 10
				},
			}}
			query={{
				key: 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo',
				language: 'en',
			}}
		/>
  );
};

export default GooglePlacesInput;