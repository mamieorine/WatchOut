import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState } from 'react';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const GooglePlacesInput = (props: { onDestinationChange: any; isDestinationChanged: any; isFirstVisited: any; }) => {
  return (
		<GooglePlacesAutocomplete
			placeholder='Search destination'
			minLength={1}
			fetchDetails={true}
			onPress={(data, details = null) => {
				if (!details) return;

				const destinationData: any = {
					place_id: details.place_id,
					name: details.name,
					address: details.formatted_address,
					latitude: details.geometry.location.lat,
					longitude: details.geometry.location.lng,
				}

				props.isFirstVisited(false);
				props.isDestinationChanged(true);
				props.onDestinationChange(destinationData);
			}}
			numberOfLines={10}
			listViewDisplayed={true}
			styles={{
				container: {
					zIndex: 10,
					paddingBottom: 0,
					flexGrow: 1,
				},
				textInputContainer: {
				  width: '100%',
				  padding: 10,
				},
				textInput: {
				  height: 50,
				  color: '#5d5d5d',
				  fontSize: 16,
				  borderWidth: 1,
				  borderColor: '#ddd'
				},
				predefinedPlacesDescription: {
				  color: '#1faadb',
				},
				listView: {
					position: 'absolute',
					top: 65,
					left: 10,
					right: 10,
					backgroundColor: 'white',
					borderRadius: 5,
					flex: 1,
					elevation: 3,
					zIndex: 10,
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