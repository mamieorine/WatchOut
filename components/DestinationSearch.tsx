import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Image, Text } from 'react-native';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const GooglePlacesInput = (props: { onDestinationChange: any; isDestinationChanged: any; isFirstVisited: any; }) => {
	const [isFocus, setOnfocus] = useState(false);
	return (
		<GooglePlacesAutocomplete
			placeholder='Search your location'
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
			enablePoweredByContainer={false}
			renderRow={results => {
				console.log(results)
				return <>
				<Image source={{ uri: "https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/64/000000/external-pin-map-and-navigation-kmg-design-detailed-outline-kmg-design-2.png"}} style={{ width: 16, height: 16 }} />
				<Text style={{ marginLeft: 5 }} >{results.description}</Text>
			  </>
			  }}
			numberOfLines={10}
			textInputProps={{
				onFocus: () => setOnfocus(true),
				onBlur: () => setOnfocus(false),
			}}
			renderRightButton={() =>
				(!isFocus) ?
					<Image style={{
						width: 28, height: 28,
						position: 'absolute',
						right: 35,
						top: 20,
						tintColor: '#bbb'
					}} source={{
						uri: "https://img.icons8.com/ios-glyphs/60/000000/search--v1.png"}}
					/>
				: <></>
			}
			styles={{
				container: {
					zIndex: 10,
					paddingBottom: 0,
					flexGrow: 1,
				},
				textInputContainer: {
				  width: '100%',
				  padding: 10,
				  height: 70,
				},
				textInput: {
				  height: 50,
				  color: '#5d5d5d',
				  fontSize: 16,
				  borderWidth: 1,
				  borderColor: '#ddd',
				  borderRadius: 50,
				  shadowColor: "#000",
				  shadowOffset: {
					  width: 1,
					  height: 3,
				  },
				  shadowOpacity: 0.1,
				  shadowRadius: 2,
				  paddingLeft: 20
				},
				listView: {
					position: 'absolute',
					top: 65,
					left: 10,
					right: 10,
					backgroundColor: 'white',
					borderRadius: 10,
					flex: 1,
					zIndex: 10,
					padding: 5
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