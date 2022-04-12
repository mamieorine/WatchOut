import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/AddressSearch';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect } from 'react';

const origin = {latitude: 51.2419894, longitude: -0.7035547};
const destination = {latitude: 51.2419894, longitude: -1.7135547};
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export default function TabTwoScreen() {
  const [geometry, onGeometryChange] = useState({
		latitude: 51.2419894,
		longitude: -0.7035547
	});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <GooglePlacesInput geometry={geometry} onDestinationChange={onGeometryChange} />
      <MapView region={{... geometry, latitudeDelta: 1, longitudeDelta: 2.5}} style={{margin: 0, height: 400, width: '100%'}}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE} >

        {/* <View>
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="hotpink"
            mode="DRIVING"
          />
        </View> */}
      </MapView>


      <Text style={styles.title}>{geometry.latitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
