import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from 'react';

export default function TabTwoScreen() {
  const [region, onRegionChange] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers] = useState([
    {
      latlng: {
        latitude: 37.78825,
        longitude: -122.4325
      },
      title: 'Test',
      description: 'test'
    },
    {
      latlng: {
        latitude: 37.7883,
        longitude: -122.4624
      },
      title: 'Test2',
      description: 'test2'
    },
    {
      latlng: {
        latitude: 37.7504,
        longitude: -122.4604
      },
      title: 'Test3',
      description: 'test3'
    }
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview crimes occurs</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <MapView  style={{height: '50%', width: '100%'}} region={region} provider={PROVIDER_GOOGLE}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
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


