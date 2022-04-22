import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import { useAtom } from 'jotai';
import { routesAtom } from '../functions/atom';

export default function TabTwoScreen(props: { routes: any; origin: string; destination: string, onSelect: any }) {
  const navigation = useNavigation();
  const location = useRoute();
  const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string; }) => {
    return <FontAwesome size={24} style={{ marginTop: 20, marginLeft: 10 }} {...props} />;
  }

  const params: any = location.params;
  const [routes, onRoutesUpdate] = useAtom(routesAtom)

  const data = [{
      select: false,
      distance: 0.963,
      duration: 12.066666666666666,
      waypoints: [],
    }, {
      select: false,
      distance: 1.056,
      duration: 4.266666666666667,
      waypoints: [],
    }
  ]

  return (
    <View style={{ height: 100 }}>
      <View style={{ padding: 10 }}>
        <TextInput
          style={styles.input}
          editable={false}
          value={params.origin ?? 'origin'}
        />
        <TextInput
          style={styles.input}
          editable={false}
          value={params.destination ?? 'destination'}
        />
      </View>
      <TouchableOpacity onPress={() => {
          routes.indexSelected = 0;
          onRoutesUpdate(routes);
          console.log("onRoutesUpdate(routes)");
          navigation.goBack();
        }}>
        <Card containerStyle={{borderRadius: 10, borderColor: '#eee', borderWidth: 0, margin: 15}}>
          <Text style={{marginBottom: 10, fontSize: 18, fontWeight: 'bold'}}>
            Option 1
          </Text>
          <Text style={{marginBottom: 10, fontSize: 16}}> Distance: {data[0].distance} </Text>
          <Text style={{marginBottom: 10, fontSize: 16}}> Duration: {data[0].duration} </Text>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
          routes.indexSelected = 1;
          onRoutesUpdate(routes);
          navigation.goBack();
        }}>
        <Card containerStyle={{borderRadius: 10, borderColor: '#eee'}}>
          <Text style={{marginBottom: 10, fontSize: 18, fontWeight: 'bold'}}>
            Option 1
          </Text>
          <Text style={{marginBottom: 10, fontSize: 16}}> Distance: {data[1].distance} </Text>
          <Text style={{marginBottom: 10, fontSize: 16}}> Duration: {data[1].duration} </Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  input: {
    height: 45,
    width: 355,
    margin: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 10,
  },
});



