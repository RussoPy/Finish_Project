import { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@env'; // ✅ use @env, not process.env
import {
  Text,
  Alert,
  Animated,
  Easing,
  View,
} from 'react-native';

import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function LocationStep() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView | null>(null);

  const [region, setRegion] = useState({
    latitude: 32.0853,
    longitude: 34.7818,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateToRegion = (lat: number, lng: number) => {
    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
  };

  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    animateToRegion(latitude, longitude);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      const label = data.results?.[0]?.formatted_address;
      if (label) setSelectedAddress(label);
    } catch (err) {
      console.warn('Reverse geocode failed', err);
    }
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Please select a location');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        location_lat: region.latitude,
        location_lng: region.longitude,
      });

      navigation.navigate('ProfilePicture');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <Animated.View
    style={{
      flex: 1,
      backgroundColor: '#f0f9ff',
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }}
  >
    <ProfileNavHeader
      onSkip={() => navigation.navigate('ProfilePicture')}
      showSkip={false}
    />

    <Text
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1d4ed8',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 8,
      }}
    >
      Find your exact address
    </Text>

    {/* 💡 Overlapping Autocomplete box */}
    <View style={{ position: 'absolute', top: 90, left: 20, right: 20, zIndex: 999 }}>
      <GooglePlacesAutocomplete
        placeholder="Search address"
        fetchDetails
        onPress={(data, details = null) => {
          const loc = details?.geometry?.location;
          if (!loc) return;

          animateToRegion(loc.lat, loc.lng);
          setSelectedAddress(details?.formatted_address || '');
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'en',
          components: 'country:il',
        }}
        styles={{
          container: { flex: 0 },
          textInput: {
            height: 48,
            borderRadius: 10,
            borderColor: '#cbd5e1',
            borderWidth: 1,
            paddingHorizontal: 12,
            backgroundColor: '#fff',
            fontSize: 16,
          },
          listView: {
            backgroundColor: '#fff',
            borderRadius: 10,
            marginTop: 4,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          },
        }}
        enablePoweredByContainer={false}
      />
    </View>

    {/* 🗺️ Map View */}
    <View style={{ flex: 1, marginTop: 160, marginHorizontal: 20 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1, borderRadius: 16 }}
        region={region}
        onPress={handleMapPress}
      >
        <Marker coordinate={region} />
      </MapView>
    </View>

    {/* 🏷️ Selected Address */}
    {selectedAddress ? (
      <Text style={{ fontSize: 14, textAlign: 'center', color: '#64748b', marginVertical: 12 }}>
        Selected: {selectedAddress}
      </Text>
    ) : null}

    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
      <AppButton title="Save & Continue" onPress={handleSave} />
    </View>
  </Animated.View>
  );
}
