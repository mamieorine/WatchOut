import { Image, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from 'react';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.3218456, longitude: -122.0256002};
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export default function TabThreeScreen() {
  const [region, onRegionChange] = useState({
    latitude: 37.3268056,
    longitude: -122.0290002,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0321,
  });

  const [markers] = useState([
    {
      latlng: {
        latitude: 37.3208456,
        longitude: -122.0290002
      },
      title: 'Test',
      description: 'test'
    },
    {
      latlng: {
        latitude: 37.3284456,
        longitude: -122.0270002
      },
      title: 'Test2',
      description: 'test2'
    },
    {
      latlng: {
        latitude: 37.3308456,
        longitude: -122.0326002
      },
      title: 'Test3',
      description: 'test3'
    }
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crimes nearest walking path</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <MapView style={{height: '50%', width: '100%'}}
        provider={PROVIDER_GOOGLE} initialRegion={region}>
        <Marker key={1} coordinate={origin} />
        <Marker key={2} coordinate={destination} />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description} >

            <Image source={require('../assets/images/crime.png')} style={{height: 30, width:30}} />
          </Marker>
        ))}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="hotpink"
          mode="DRIVING"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
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


