import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/AddressSearch';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [region, onRegionChange] = useState({
    latitude: 51.2419894,
    longitude: -0.7035547,
    latitudeDelta: 1,
    longitudeDelta: 2.5,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>
      <Text style={styles.getStartedText}>Still not working</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* <GooglePlacesInput /> */}
      <MapView region={region} style={{height: '50%', width: '100%'}}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
      />
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
