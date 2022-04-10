import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
		<GooglePlacesAutocomplete
			placeholder='Search destination'
			minLength={2}
			onPress={(data, details = null) => {
				// 'details' is provided when fetchDetails = true
				console.log(data, details);
			}}
			query={{
				key: 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo',
				language: 'en',
			}}
		/>
  );
};

export default GooglePlacesInput;