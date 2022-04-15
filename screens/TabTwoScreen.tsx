import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'https://data.police.uk/api';
const getAllCrimesPoly = '/stops-street?poly=52.2,0.5:52.8,0.2:52.1,0.88';
const getAllCrimesLocation = '/crimes-street/all-crime?lat=51.2419894&lng=-0.7035547';

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

export default function TabTwoScreen() {
  const [region] = useState({
		latitude: 50.9351092,
		longitude: -1.3957594,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [crimes, initialCrimes] = useState<Crimes[]>([]);

  useEffect(() => {
    axios.get(`${baseUrl}/${getAllCrimesLocation}`)
        .then(response => {
          const crimes: Crimes[] = separateCrimeTypes(response.data);
          initialCrimes(crimes);
        });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview crimes occurs</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <MapView  style={{height: '50%', width: '100%'}} region={region} provider={PROVIDER_GOOGLE}>
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
            />
          })
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


