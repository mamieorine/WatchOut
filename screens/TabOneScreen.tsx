import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/AddressSearch';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, EventUserLocation, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'https://data.police.uk/api';
const getAllCrimesPoly = '/stops-street?poly=52.2,0.5:52.8,0.2:52.1,0.88';
const getAllCrimesLocation = '/crimes-street/all-crime?lat=50.9351092&lng=-1.3957594';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export interface Crimes {
  category: string;
  crimes: Crime[];
}

export interface Crime {
  id: number,
  latitude: string,
  longitude: string,
  dateTime: string,
  location: string,
}

function separateCrimeTypes(crimes: any[]): Crimes[] {
  const allCrimes: any[] = [];

  crimes.forEach((crime: any) => {
    allCrimes.push({
      category: crime.category,
      crime: {
        id: crime.id,
        dateTime: crime.month,
        location: crime.location.streetName,
        latitude: crime.location.latitude,
        longitude: crime.location.longitude,
      }
    })
  })

  const result = allCrimes.reduce((acc, d) => {
    const found = acc.find((a: Crimes) => a.category === d.category);
    const value = d.crime;

    if (!found) {
      acc.push({ category: d.category, crimes: [value]});
    }
    else {
      found.crimes.push(value)
    }
    return acc;
  }, []);

  return result;
}

export default function TabOneScreen() {
  const h1Ref = useRef<MapView>(null);

  const [delta, onDeltaChange] = useState({
		latitudeDelta: 0,
		longitudeDelta: 0
	});

  const [geometry, onGeometryChange] = useState({
		latitude: 50.9044082,
		longitude: -1.405594
	});

  const [centerGeometry, onCenterGeometryChange] = useState({
		latitude: 50.9044082,
		longitude: -1.405594
	});

  const [currentGeometry, onCurrentGeometryChange] = useState({
		latitude: 50.9044082,
		longitude: -1.405594
	});

  useLayoutEffect(() => {
    if (!h1Ref.current) return;

    h1Ref.current.animateToRegion({
      latitude: centerGeometry.latitude,
      longitude: centerGeometry.longitude,
      latitudeDelta: delta.latitudeDelta,
      longitudeDelta: delta.longitudeDelta,
    }, 2000)
  })

  const [crimes, initialCrimes] = useState<Crimes[]>([]);
  useEffect(() => {
    axios.get(`${baseUrl}/crimes-street/all-crime?lat=${centerGeometry.latitude}&lng=${centerGeometry.longitude}`)
        .then(response => {
          const crimes: Crimes[] = separateCrimeTypes(response.data);
          initialCrimes(crimes);
        });
  }, [geometry]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Location</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <GooglePlacesInput geometry={geometry} onDestinationChange={onGeometryChange} />
      <MapView region={{... centerGeometry, latitudeDelta: delta.latitudeDelta, longitudeDelta: delta.longitudeDelta}}
        style={{margin: 0, height: 500, width: '100%'}}
        showsUserLocation={true}
        provider={PROVIDER_GOOGLE}
        ref={h1Ref}
        onUserLocationChange={(e: EventUserLocation) => {
          const lat = e.nativeEvent.coordinate.latitude;
          const lng = e.nativeEvent.coordinate.longitude;

          if (lat.toFixed(3) == currentGeometry.latitude.toFixed(3) ||
          lng.toFixed(3) == currentGeometry.longitude.toFixed(3)) return;

          onCurrentGeometryChange({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude
          })
        }}
        >

        <Marker key={1000} coordinate={currentGeometry} />
        <Marker key={2000} coordinate={geometry} />

        {crimes.map((crimeTypes: Crimes, index) => (
          crimeTypes.crimes.map((crime: Crime, d) => {
            console.log(crime, crimeTypes.category, index);
            return <Marker
              key={index + d}
              coordinate={{
                latitude: parseFloat(crime.latitude),
                longitude: parseFloat(crime.longitude),
              }}
              title={crimeTypes.category}
              description={crime.dateTime}
              pinColor={'linen'}
            />
          })
        ))}

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

            onCenterGeometryChange({
              latitude: (currentGeometry.latitude + geometry.latitude) / 2,
              longitude: (currentGeometry.longitude + geometry.longitude) / 2
            })
          }}
          onError={(errorMessage) => {
            console.log(errorMessage);
          }}
        />
      </MapView>

      <Text style={styles.title}>{geometry.latitude} {geometry.longitude}</Text>
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
    marginTop: 10,
    fontWeight: 'bold',
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
