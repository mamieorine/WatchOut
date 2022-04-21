import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/DestinationSearch';
import { separateCrimeTypes, Crimes, Crime } from '../functions/helper';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker, EventUserLocation, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import axios from 'axios';

const baseUrl = 'https://data.police.uk/api';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

interface Coordinate {
  latitude: number,
  longitude: number
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

  const [polyGeometry, onPolyGeometryChange] = useState([
		{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 },
  	{ latitude: 50.9044082, longitude: -1.405594 }
  ]);

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
    let polyStr = '';
    if (polyGeometry.length == 1) {
      polyStr = '50.904784,-1.408083:50.90271,-1.403046:50.912051,-1.4029:50.913540,-1.397047';
    }
    else {
      polyGeometry.forEach((coordinate: Coordinate, index: number) => {
        polyStr = `${polyStr}${coordinate.latitude},${coordinate.longitude}`;
        if (index != polyGeometry.length-1) {
          polyStr = `${polyStr}:`;
        }
      });
    }

    axios.get(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`)
        .then(response => {
          const crimes: Crimes[] = separateCrimeTypes(response.data);
          initialCrimes(crimes);
        });

    console.log("DirectionsService 1");

    // const options: any = {
    //   origin: `${currentGeometry.latitude},${currentGeometry.longitude}`,
    //   destination: `${geometry.latitude},${geometry.longitude}`,
    //   waypoints: [],
    //   optimizeWaypoints: true,
    //   travelMode: google.maps.TravelMode.WALKING,
    //   provideRouteAlternatives: true,
    // }
    // new DirectionsService(options, (result: any) => {
    //   console.log("DirectionsService 2");
    //   console.log(result);
    // });
  }, [geometry, polyGeometry]);


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

        {/* {<DirectionsService options={{
          origin: `${currentGeometry.latitude},${currentGeometry.longitude}`,
          destination: `${geometry.latitude},${geometry.longitude}`,
          waypoints: [],
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
        }} callback={(result: any) => console.log(result)} /> }; */}

        <Marker key={1000} coordinate={currentGeometry} />
        <Marker key={2000} coordinate={geometry} />

        <Marker key={1001} coordinate={polyGeometry[0]} pinColor={'red'} />
        <Marker key={1002} coordinate={polyGeometry[1]} pinColor={'pink'} />
        <Marker key={1003} coordinate={polyGeometry[2]} pinColor={'blue'} />
        <Marker key={1004} coordinate={polyGeometry[3]} pinColor={'yellow'} />
        <Marker key={1005} coordinate={polyGeometry[4]} pinColor={'purple'} />
        <Marker key={1006} coordinate={polyGeometry[5]} pinColor={'orange'} />

        {crimes.map((crimeTypes: Crimes, index) => (
          crimeTypes.crimes.map((crime: Crime, d) => {
            return <Marker
              key={index + d}
              coordinate={{
                latitude: parseFloat(crime.latitude),
                longitude: parseFloat(crime.longitude),
              }}
              title={crimeTypes.category}
              description={crime.latitude + crime.longitude}
              pinColor={'linen'}
            />
          })
        ))}

        <MapViewDirections
          origin={currentGeometry}
          destination={geometry}
          apikey={GOOGLE_MAPS_APIKEY}
          // waypoints={[{latitude: 50.9044082, longitude: -1.405694}, {latitude: 50.9134082, longitude: -1.415594}]}
          strokeWidth={5}
          strokeColor="hotpink"
          mode="WALKING"
          optimizeWaypoints={true}
          onStart={(params) => {}}
          onReady={result => {
            const deltaPerDist = 100;
            let ratioDist = result.distance/deltaPerDist;
            onDeltaChange({
              latitudeDelta: ratioDist,
              longitudeDelta: ratioDist
            })

            const centerIndex = Math.floor(result.coordinates.length/2);
            const centerCoordinates = result.coordinates[centerIndex];
            const originCoord = result.coordinates[0];
            const destinationCoord = result.coordinates[result.coordinates.length-1];

            ratioDist = Math.min(0.010, ratioDist);
            onPolyGeometryChange([
              {latitude: originCoord.latitude, longitude: originCoord.longitude + ratioDist/2},
              {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude + ratioDist/2},
              {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude + ratioDist/2},
              {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude - ratioDist/2},
              {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude - ratioDist/2},
              {latitude: originCoord.latitude, longitude: originCoord.longitude - ratioDist/2},
            ]);

            onCenterGeometryChange({
              latitude: (centerCoordinates.latitude),
              longitude: (centerCoordinates.longitude)
            })
          }}
          onError={(errorMessage) => {
            console.log(errorMessage);
          }}
        />

        <MapViewDirections
          origin={currentGeometry}
          destination={geometry}
          apikey={GOOGLE_MAPS_APIKEY}
          // waypoints={[{latitude: 50.9044082, longitude: -1.405694}, {latitude: 50.9134082, longitude: -1.415594}]}
          strokeWidth={5}
          strokeColor="blue"
          mode="BICYCLING"
          optimizeWaypoints={true}
          onStart={(params) => {}}
          onReady={result => {

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
