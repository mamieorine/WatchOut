import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/AddressSearch';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, EventUserLocation, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export default function TabTwoScreen() {
  const h1Ref = useRef<MapView>(null);

  const [delta, onDeltaChange] = useState({
		latitudeDelta: 0,
		longitudeDelta: 0
	});

  const [geometry, onGeometryChange] = useState({
		latitude: 51.2419894,
		longitude: -0.7035547
	});

  const [currentGeometry, onCurrentGeometryChange] = useState({
		latitude: 51.2419894,
		longitude: -0.7035547
	});

  useLayoutEffect(() => {
    if (!h1Ref.current) return;
    h1Ref.current.animateToRegion({
      latitude: (currentGeometry.latitude + geometry.latitude) / 2,
      longitude: (currentGeometry.longitude + geometry.longitude) / 2,
      latitudeDelta: delta.latitudeDelta,
      longitudeDelta: delta.longitudeDelta,
    }, 2000)
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <GooglePlacesInput geometry={geometry} onDestinationChange={onGeometryChange} />
      <MapView region={{... geometry, latitudeDelta: delta.latitudeDelta, longitudeDelta: delta.longitudeDelta}} style={{margin: 0, height: 400, width: '100%'}}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        ref={h1Ref}
        onUserLocationChange={(e: EventUserLocation) => {
          const lat = e.nativeEvent.coordinate.latitude;
          const lng = e.nativeEvent.coordinate.longitude;
          if (lat.toFixed(4) == currentGeometry.latitude.toFixed(4) && lng.toFixed(4) == currentGeometry.longitude.toFixed(4)) return;
          onCurrentGeometryChange({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude})
        }}
        >

        <Marker key={1} coordinate={currentGeometry} />
        <Marker key={2} coordinate={geometry} />

        <MapViewDirections
          origin={currentGeometry}
          destination={geometry}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="hotpink"
          mode="WALKING"
          optimizeWaypoints={true}
          onStart={(params) => {}}
          onReady={result => {
            const deltaPerDist = 100;
            const ratioDist = result.distance/deltaPerDist;
            onDeltaChange({
              latitudeDelta: ratioDist,
              longitudeDelta: ratioDist
            })
          }}
          onError={(errorMessage) => {
            console.log(errorMessage);
          }}
        />
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
