import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  View,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Text } from 'react-native-paper';
import { AppButton } from '../components/AppButton';
import { auth, db } from '../api/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import globalStyles from '../styles/globalStyles';
import colors from '../styles/colors';
import spacing from '../styles/spacing';
import { ProfileNavHeader } from '../components/ProfileNavHeader';
import { Button } from 'react-native-paper';

export default function LocationStep() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView | null>(null);
  const placesRef = useRef<any>(null);

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
      placesRef.current?.setAddressText(label);
    } catch (err) {
      console.warn('Reverse geocode failed', err);
    }
  };

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !selectedAddress) {
      Alert.alert('Please select your location before continuing.');
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
      style={[
        globalStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* ⬅️ Header with Progress */}
      <ProfileNavHeader
        stepText="2/10"
        progress={0.2}
        onSkip={() => navigation.navigate('ProfilePicture')}
        showSkip={false}
        showBack={true}
      />

      <Text style={[globalStyles.title, { marginTop: spacing.xl + 40 }]}>
        your <Text style={globalStyles.highlightText}>location?</Text>
      </Text>

      {/* 🧾 Selected Address */}
      {selectedAddress ? (
        <Text
          style={{
            textAlign: 'center',
            color: colors.info,
            fontSize: 14,
            marginTop: spacing.s,
            marginBottom: spacing.m,
            paddingHorizontal: spacing.l,
          }}
        >
          {selectedAddress}
        </Text>
      ) : null}

      {/* 📍 Google Search Input */}
      <View
        style={{
          marginTop: spacing.s,
          marginBottom: spacing.l,
          marginHorizontal: spacing.l,
          zIndex: 99,
        }}
      >
        <GooglePlacesAutocomplete
          ref={placesRef}
          placeholder="Search your address"
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
              borderRadius: 12,
              borderColor: colors.muted,
              borderWidth: 1,
              paddingHorizontal: spacing.m,
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

      {/* 🗺️ Map Display */}
      <View
        style={{
          flex: 1,
          marginTop: spacing.m,
          marginHorizontal: spacing.l,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={region}
          onPress={handleMapPress}
        >
          <Marker coordinate={region} />
        </MapView>
      </View>



      {/* ✅ Continue Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!selectedAddress}
        style={[
          globalStyles.button,
          { backgroundColor: selectedAddress ? colors.primary : colors.muted },
        ]}
        contentStyle={globalStyles.buttonContent}
        labelStyle={{ color: 'white', fontWeight: '600' }}
      >
        Next
      </Button>
    </Animated.View>
  );
}
