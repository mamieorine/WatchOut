import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
		<GooglePlacesAutocomplete
			placeholder='Search destination'
			minLength={2}
			onFail={error => console.log('error' + error)}
			onPress={(data, details = null) => {
				// 'details' is provided when fetchDetails = true
				console.log(data, details);
			}}
			styles={{
				textInputContainer: {
				  backgroundColor: 'grey',
				},
				textInput: {
				  height: 38,
				  color: '#5d5d5d',
				  fontSize: 16,
				  width: 200
				},
				predefinedPlacesDescription: {
				  color: '#1faadb',
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