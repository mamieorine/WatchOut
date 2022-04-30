import { StyleSheet } from 'react-native';
import React from 'react';

import { Text, View } from '../components/Themed';

export type Geometry = {
	latitude: Number;
	longitude: Number
}

const MarkerPopup = () => {
	return (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>sdf</Text>
        </View>
  );
};

export default MarkerPopup;

const styles = StyleSheet.create({
	modal: {},
	chip: {
		marginRight: 5,
		color: '#000'
	},
	title: {
	  fontSize: 20,
	  marginTop: 10,
	  fontWeight: 'bold',
	  color: '#ddd'
	},
	modalTitle: {
	  fontSize: 20,
	  marginBottom: 10,
	  fontWeight: 'bold',
	  color: '#ddd'
	},
  });
