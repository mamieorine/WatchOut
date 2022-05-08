import { StyleSheet, SafeAreaView } from 'react-native';
import { Text, View } from '../components/Themed';
import GooglePlacesInput from '../components/DestinationSearch';
import { separateCrimeTypes, Crimes, Crime } from '../functions/helper';
import MapViewDirections, { MapViewDirectionsMode } from 'react-native-maps-directions';
import MapView, { Marker, EventUserLocation, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { BottomSheet, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai'
import { routesAtom } from '../functions/atom';

const baseUrl = 'https://data.police.uk/api';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

interface Coordinate {
  latitude: number,
  longitude: number
}

interface Routes {
  indexSelected: number,
  allRoutes: any[]
}

export default function MapHomeScreen({}) {
  const navigation = useNavigation();
  const h1Ref = useRef<MapView>(null);
  const [isFirstVisit, setFirstVisit] = useState(true);

  const [delta, onDeltaChange] = useState({
		latitudeDelta: 0,
		longitudeDelta: 0
	});

  const [geometry, onGeometryChange] = useState({
    place_id: '', name: '', address: '',
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

  const [routes, onRoutesUpdate] = useAtom(routesAtom)

  useLayoutEffect(() => {
    if (!h1Ref.current) return;

    h1Ref.current.animateToRegion({
      latitude: isFirstVisit ? currentGeometry.latitude : centerGeometry.latitude,
      longitude: isFirstVisit ? currentGeometry.longitude : centerGeometry.longitude,
      latitudeDelta: isFirstVisit ? 0.02 : delta.latitudeDelta,
      longitudeDelta: isFirstVisit ? 0.02 : delta.longitudeDelta,
    }, 2000)
  })

  const [crimes, initialCrimes] = useState<Crimes[]>([]);
  const [test, setRouteScreen] = useState(100);

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

    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=Mango+Thai+Tapas+Bar+%26+Restaurant+%E2%80%93+Portswood&destination=University+of+Southampton&key=AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo&alternatives=true&mode=bicycling')
        .then((response: any) => {
          console.log(response);
        });
    console.log(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`);
    axios.get(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`)
        .then(response => {
          const crimes: Crimes[] = separateCrimeTypes(response.data);
          initialCrimes(crimes);
        });
  }, [polyGeometry]);

  useFocusEffect(() => {
    setRouteScreen(routes.indexSelected);
  });

  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  function getMapDirection(strokeColor: string, mode: MapViewDirectionsMode, waypoints: any[]) {
    return <MapViewDirections
      origin={currentGeometry}
      destination={isFirstVisit ? currentGeometry : geometry}
      apikey={GOOGLE_MAPS_APIKEY}
      waypoints={waypoints}
      strokeWidth={4}
      strokeColor={strokeColor}
      lineDashPattern={[4,4]}
      lineCap="round"
      mode={mode}
      optimizeWaypoints={true}
      onReady={result => {
        if (isFirstVisit) return;

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
        if (test !== 100) {
          onPolyGeometryChange([
            {latitude: originCoord.latitude, longitude: originCoord.longitude + ratioDist/2},
            {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude + ratioDist/2},
            {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude + ratioDist/2},
            {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude - ratioDist/2},
            {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude - ratioDist/2},
            {latitude: originCoord.latitude, longitude: originCoord.longitude - ratioDist/2},
          ]);
        }

        const centerLatFocus = (currentGeometry.latitude + geometry.latitude) / 2;
        const centerLngFocus = (currentGeometry.longitude + geometry.longitude) / 2;
        onCenterGeometryChange({
          latitude: centerLatFocus,
          longitude: centerLngFocus
        })

        if (isBottomSheetVisible) {
          const updated = {
            indexSelected: 100,
            allRoutes: routes.allRoutes
          }
          updated.allRoutes.push({
            duration: result.duration,
            distance: result.distance,
            waypoints: result.coordinates,
            selected: false,
          });
          onRoutesUpdate(updated);
        }
      }}
      onError={(errorMessage) => {
        console.log(errorMessage);
      }}
    />
  }

  return (
    <View style={styles.container}>
      <GooglePlacesInput onDestinationChange={onGeometryChange} isDestinationChanged={setBottomSheetVisible} isFirstVisited={setFirstVisit}/>
      <BottomSheet
          isVisible={isBottomSheetVisible}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
          }} >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{geometry.name}</Text>
          <Text style={styles.modalSubTitle}>{geometry.address}</Text>
          <Button icon={{}}
            title="Direction"
            titleStyle= {{fontSize: 18}}
            buttonStyle={{paddingRight: 30, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 50}}
            onPress={() => {
              // setBottomSheetVisible(false);
              // navigation.navigate('RouteScreen', {
              //   routes: routes,
              //   origin: 'Current Location',
              //   destination: geometry.name,
              //   onSelect: onRoutesUpdate
              // });
            }} />
        </View>
      </BottomSheet>

      <BottomSheet
          isVisible={isBottomSheetVisible}
          containerStyle={{
            backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'
          }} >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>{geometry.name}</Text>
          <Text style={styles.modalSubTitle}>{geometry.address}</Text>
          <Button icon={{}}
            title="Direction"
            titleStyle= {{fontSize: 18}}
            buttonStyle={{paddingRight: 30, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, borderRadius: 50}}
            onPress={() => {
              setBottomSheetVisible(false);
            }} />
        </View>
      </BottomSheet>

      <MapView region={{... isFirstVisit ? currentGeometry : centerGeometry, latitudeDelta: delta.latitudeDelta, longitudeDelta: delta.longitudeDelta}}
        style={{margin: 0, height: '100%', width: '100%'}}
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
        <Marker key={2000} coordinate={isFirstVisit ? currentGeometry : geometry} />

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
              pinColor={crimeTypes.icon}
            />
          })
        ))}

        { test == 100 && getMapDirection("grey", 'BICYCLING', [])}
        { test == 100 && getMapDirection("grey", 'WALKING', []) }
        { test == 0 && getMapDirection("hotpink", 'WALKING', [])}
        { test == 1 && getMapDirection("hotpink", 'BICYCLING', [])}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modal: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16
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
