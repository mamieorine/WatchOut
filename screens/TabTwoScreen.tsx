import { StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

import { Text, View,  } from '../components/Themed';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Card, Chip } from 'react-native-elements';
import { Box, Flex, HStack, Row, ScrollView, Spinner } from 'native-base';
import axios from 'axios';
import { Crimes, separateCrimeTypes } from '../functions/helper';
import { useNavigation, useRoute } from '@react-navigation/native';

const baseUrl = 'https://data.police.uk/api';
const GOOGLE_MAPS_APIKEY = 'AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo';

export default function TabTwoScreen(props: { destination: string }) {
  const navigation = useNavigation();
  const location = useRoute();
  const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string; }) => {
    return <FontAwesome size={24} style={{ marginTop: 20, marginLeft: 10 }} {...props} />;
  }

  const params: any = location.params;
  const destination = params?.destination ?? 'Solent+University';

  const [highestCrimeList, onHighestCrimesChange] = useState<any>([]);
  const [routeData, onRouteDataChange] = useState<any>([]);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [transit, setTransit] = useState(false)
  const [bicycling, setBicycling] = useState(false)
  const [walking, setWalking] = useState(false)

  function getDirection(data: any) {
    const busIcon = <FontAwesome size={18} style={{ marginRight: 5, marginTop: 5 }} name="bus" />
    const bicyclingIcon = <FontAwesome size={18} style={{ marginRight: 5, marginTop: 5 }} name="bus" />
    const walkIcon = <FontAwesome size={18} style={{ marginRight: 5, marginTop: 5 }} name="bus" />
    const rightArrow = <FontAwesome size={10} style={{ color: '#aaa', marginRight: 5, marginTop: 5 }} name="chevron-right" />

    if (data.directions.length === 1) {
      if (data.directions[0].mode === 'WALKING') {
        return <Flex style={styles.flex}>
          {walkIcon}
          <Text>Walk {data.duration}</Text>
        </Flex>
      }
      if (data.directions[0].mode === 'BICYCLING') {
        return <Flex style={styles.flex}>
          {bicyclingIcon}
          <Text>Bicycle {data.duration}</Text>
        </Flex>
      }
    }

    return <Flex style={styles.flex}>
      {data.directions.map((step: any, index: number) => {
        return [<Flex style={styles.flex}>{step.mode === 'TRANSIT' ? busIcon : walkIcon}
            <Text> { step.mode === 'TRANSIT' ? 'bus' : 'walk' } {step.dist} </Text>
          </Flex>,
        ,
        index === data.directions.length-1 ? '' : rightArrow ]
      })}
    </Flex>
  }

  const Loading = () => {
    return <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading posts" />
      </HStack>;
  };

  async function getCrimes(waypoints: any, distance: number) {
    const originCoord = waypoints[0];
    const destinationCoord = waypoints[waypoints.length-1];
    const centerIndex = Math.floor(waypoints.length/2);
    const centerCoordinates = waypoints[centerIndex];
    const deltaPerDist = 100;
    const ratioDist = Math.min(0.010, distance/deltaPerDist);

    const polyGeometry = [
      {latitude: originCoord.latitude, longitude: originCoord.longitude + ratioDist/2},
      {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude + ratioDist/2},
      {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude + ratioDist/2},
      {latitude: destinationCoord.latitude, longitude: destinationCoord.longitude - ratioDist/2},
      {latitude: centerCoordinates.latitude, longitude: centerCoordinates.longitude - ratioDist/2},
      {latitude: originCoord.latitude, longitude: originCoord.longitude - ratioDist/2},
    ];

    let polyStr = '';
    polyGeometry.forEach((coordinate: any, index: number) => {
      polyStr = `${polyStr}${coordinate.latitude},${coordinate.longitude}`;
      if (index != polyGeometry.length-1) {
        polyStr = `${polyStr}:`;
      }
    });

    return axios.get(`${baseUrl}/crimes-street/all-crime?poly=${polyStr}`)
    .then(response => {
      const crimes: Crimes[] = separateCrimeTypes(response.data);
      const highestCrime = {name: '', value: 0};
      crimes.forEach((crime: any) => {
        if (!highestCrime.name || highestCrime.value < crime.crimes.length) {
          highestCrime.name = crime.category;
          highestCrime.value = crime.crimes.length;
        }
      })

      highestCrimeList.push(highestCrime)
      onHighestCrimesChange(crimes)

      return highestCrime;
    })
    .catch(function (error) {
      return Promise.reject(error)
   });
  }

  function crimesOrdering() {
    const routes = [...routeData];

    if (routes.length > 1) {
      routes.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
    };

    onRouteDataChange(routes);
  }

  // useEffect(() => {
  //   crimesOrdering();
  // }, [walking])

  useEffect(() => {
    axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=Mango+Thai+Tapas+Bar+%26+Restaurant+%E2%80%93+Portswood&destination=University+of+Southampton&key=AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo&alternatives=true&mode=walking`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any): any => {
            return {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            };
          })

          const direction: any[] = [];

          direction.push({
            mode: 'WALKING',
            dist: route.legs[0].distance.text
          });

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                waypoints: waypoint,
                directions: direction,
                crimes: result
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist;
              });

              console.log(isDuplicated.length)
              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        setWalking(true);
        // crimesOrdering();
      });
  }, [walking]);

  useEffect(() => {
      axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=Mango+Thai+Tapas+Bar+%26+Restaurant+%E2%80%93+Portswood&destination=University+of+Southampton&key=AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo&alternatives=true&mode=bicycling`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any): any => {
            return {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            };
          })

          const direction: any[] = [];
          direction.push({
            mode: 'BICYCLING',
            dist: route.legs[0].distance.text
          });

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                waypoints: waypoint,
                directions: direction,
                crimes: result
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameDuration = route.duration == response.duration;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist && isSameDuration;
              });
              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        setBicycling(true)
        // crimesOrdering();
      });
  }, [bicycling]);

  useEffect(() => {
      axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=Mango+Thai+Tapas+Bar+%26+Restaurant+%E2%80%93+Portswood&destination=University+of+Southampton&key=AIzaSyDyqPFPoJGT53p6-QosVbvV16MUwIL38Uo&alternatives=true&mode=transit`)
      .then((response: any) => {
        response.data.routes.forEach((route: any, index: number) => {
          const waypoint = route.legs[0].steps.map((step: any): any => {
            return {
              latitude: step.end_location.lat,
              longitude: step.end_location.lng
            };
          })

          const direction: any[] = [];

          route.legs[0].steps.forEach((step: any, index: number): any => {
            direction.push({
              mode: step.travel_mode,
              dist: step.duration.text
            });
          })

          const getHighestCrimes = async() => {
            await getCrimes(waypoint, route.legs[0].distance.value)
            .then((result) => {
              const response = {
                distance: route.legs[0].distance.text,
                duration: route.legs[0].duration.text,
                road: route.summary,
                waypoints: waypoint,
                directions: direction,
                crimes: result
              }

              const isDuplicated = routeData.filter((route: any) =>  {
                const isSameRoad = route.road == response.road;
                const isSameDist = route.distance == response.distance;
                const isSameCrimes =  route.duration == response.duration;
                return isSameRoad && isSameCrimes && isSameDist;
              });
              if (isDuplicated.length === 0) {
                routeData.push(response);
                routeData.sort((a: any, b: any) => a.crimes.value - b.crimes.value);
              }
            });
          }

          getHighestCrimes();
        })
        setTransit(true)
      });
  }, [transit]);

  return (
    <View style={{ height: '100%', backgroundColor: '#fff', paddingTop: 5 }}>
      <View style={{ padding: 10 }}>
        <Flex style={styles.flex}>
          <Image style={{
						width: 22, height: 22,
						tintColor: '#aaa',
            marginRight: 8
					}} source={{
						uri: "https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/64/000000/external-pin-map-and-navigation-kmg-design-detailed-outline-kmg-design-2.png"}}
					/>
          <TextInput
            style={styles.input}
            editable={false}
            value='Current Location'
          />
        </Flex>
        <Flex style={styles.flex}>
          <Image style={{
						width: 22, height: 22,
						tintColor: '#aaa',
            marginRight: 8
					}} source={{
						uri: "https://img.icons8.com/external-kmg-design-detailed-outline-kmg-design/64/000000/external-pin-map-and-navigation-kmg-design-detailed-outline-kmg-design-2.png"}}
					/>
          <TextInput
            style={styles.input}
            editable={false}
            value={destination}
          />
        </Flex>
      </View>

      <View style={styles.chipContainer}>
        <Chip containerStyle={styles.chip} title="Solid"
        titleStyle={{ color: '#000' }}
        buttonStyle={{ backgroundColor: '#FF47734D'}}
        />
        <Chip containerStyle={styles.chip} disabled={true} title="Chip"
          buttonStyle={{ backgroundColor: '#FF47734D'}}
          />
        <Chip containerStyle={styles.chip} disabled={true} title="Solihip"
          buttonStyle={{ backgroundColor: 'r##FF47734D'}}
          />
        <Chip containerStyle={styles.chip} disabled={true} title="Solid Chip"
          buttonStyle={{ backgroundColor: '#FF47734D'}}
        />
		  </View>

      {walking && bicycling && transit ?
      <ScrollView>
      {routeData.map((data: any, index: number) => {
        return <TouchableOpacity onPress={() => {
            navigation.goBack();
          }} key={index}>
           <Card>
            <Flex justifyContent={'flex-start'} direction={'row'} alignItems={'center'} style={{ paddingRight: 10 }}>
              <View style={{ width: '22%' }}>
                <Box style={[styles.box, {backgroundColor: data?.crimes?.value < 20 ? '#007AFF' : '#FF4773'}]}>
                  <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>{data?.crimes?.value}</Text>
                </Box>
                <Text>{data.duration}</Text>
              </View>
              <View style={{ width: '78%' }}>
                  {getDirection(data)}
                  <Text style={{ marginTop: 10 }}>{data?.crimes?.name}: {data?.crimes?.value} times occurred</Text>
              </View>
              <FontAwesome size={24} style={{ color: '#aaa', paddingRight: 15 }} name="angle-right" />
            </Flex>
            </Card>
        </TouchableOpacity>
      })}
      </ScrollView>
      : Loading() }
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 60,
    borderRadius: 50,
    padding: 10,
    paddingTop: 22,
    paddingLeft: 20,
    marginBottom: 5
  },
  container: {
    flexDirection: "row",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flex: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  input: {
    height: 45,
    width: 320,
    margin: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
  chipContainer: {
    flex: 0,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'transparent'
  },
	chip: {
		marginRight: 5,
		color: '#000'
	},
});



