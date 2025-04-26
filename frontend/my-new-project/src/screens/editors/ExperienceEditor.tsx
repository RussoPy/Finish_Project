import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Text } from 'react-native-paper';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Feather } from '@expo/vector-icons';

export default function LocationStep({
  onLocationSelect,
  goToNextStep, 
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  goToNextStep: () => void;
}) {
  const mapRef = useRef<MapView>(null);
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');

  const animateToRegion = (latitude: number, longitude: number) => {
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region, 1000);
    setMarkerCoords({ latitude, longitude });
  };

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search for your location"
        fetchDetails
        onPress={(data, details) => {
          if (!details || !details.geometry?.location) {
            console.warn('No location details found.');
            return;
          }

          const { lat, lng } = details.geometry.location;
          const address = details.formatted_address || '';

          animateToRegion(lat, lng);
          setSelectedAddress(address);
          onLocationSelect(lat, lng, address);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
          components: 'country:il',
          types: 'geocode',
        }}
        textInputProps={{
          placeholderTextColor: '#888',
          autoCapitalize: 'none',
          returnKeyType: 'search',
          clearButtonMode: 'while-editing',
          value: undefined,
          onChangeText: () => {}, // prevents crash
        }}
        styles={{
          container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          },
          textInput: {
            height: 48,
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: spacing.m,
            margin: spacing.m,
            fontSize: 16,
            borderColor: colors.muted,
            borderWidth: 1,
          },
          listView: {
            backgroundColor: '#fff',
            marginHorizontal: spacing.m,
            borderRadius: 10,
            elevation: 4,
          },
        }}
        enablePoweredByContainer={false}
        debounce={200}
      />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 32.0853,
          longitude: 34.7818,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markerCoords && <Marker coordinate={markerCoords} />}
      </MapView>

      {selectedAddress !== '' && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>📍 {selectedAddress}</Text>
        </View>
      )}

      {/* ✅ NEXT ARROW BUTTON */}
      <TouchableOpacity
        onPress={goToNextStep}
        style={styles.nextButton}
      >
        <Feather name="arrow-right" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addressText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
