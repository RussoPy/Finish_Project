// src/profile/business/JobLocationBusinessStep.tsx

import React, { useState, useRef } from 'react';
import {
    View,
    Alert,
    Keyboard,
    Platform
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

// Import Firestore functions and auth/db
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../api/firebase';

import { ProfileNavHeader } from '../../components/ProfileNavHeader';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import spacing from '../../styles/spacing';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileSetupParamList } from '../../navigation/ProfileSetupNavigator'; // Adjust if needed

// Navigation Prop Type (adjust if needed)
type JobLocationBusinessNavProp = NativeStackNavigationProp<
  ProfileSetupParamList,
  'JobLocationBusiness' // Assuming this is the correct route name
>;

// Default region (e.g., Tel Aviv) - Match worker example if different
const DEFAULT_REGION = {
    latitude: 32.0853,
    longitude: 34.7818,
    latitudeDelta: 0.02, // Match worker example's initial zoom
    longitudeDelta: 0.02,
};

export default function JobLocationBusinessStep() {
    const navigation = useNavigation<JobLocationBusinessNavProp>();
    const mapRef = useRef<MapView | null>(null);
    const placesRef = useRef<GooglePlacesAutocompleteRef | null>(null);

    const [region, setRegion] = useState(DEFAULT_REGION);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    // Use region directly for Marker for simplicity unless lag is observed
    // const [markerCoords, setMarkerCoords] = useState({ latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude });
    const [isSaving, setIsSaving] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Function to animate map - matches worker example
    const animateToRegion = (lat: number, lng: number) => {
        const newRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.02, // Keep consistent zoom level
            longitudeDelta: 0.02,
        };
        setRegion(newRegion); // Update region state (controls map and marker)
        mapRef.current?.animateToRegion(newRegion, 500); // Animate map smoothly
    };

    // Handle pressing directly on the map - matches worker example + improvements
    const handleMapPress = async (event: MapPressEvent) => {
        if (isGeocoding || isSaving) return;

        const { latitude, longitude } = event.nativeEvent.coordinate;
        setIsGeocoding(true);
        animateToRegion(latitude, longitude); // Move map and marker

        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
             if (!res.ok) {
                throw new Error(`Geocoding request failed with status ${res.status}`);
            }
            const data = await res.json();
            const label = data.results?.[0]?.formatted_address;

            if (label) {
                setSelectedAddress(label);
                placesRef.current?.setAddressText(label); // Update search input
            } else {
                 console.warn('Reverse geocode failed or no results:', data.status, data.error_message);
                 setSelectedAddress('Selected location (address unavailable)');
                 placesRef.current?.setAddressText('');
            }
        } catch (err: any) {
            console.error('Reverse geocode error:', err);
            setSelectedAddress('Selected location (address lookup failed)');
            placesRef.current?.setAddressText('');
             Alert.alert('Location Error', 'Could not fetch address for the selected location.');
        } finally {
             setIsGeocoding(false);
        }
    };

    // Handle saving the selected location - adapted for business fields
    const handleSave = async () => {
        if (!selectedAddress) {
            Alert.alert('Location Required', 'Please select the job location.');
            return;
        }
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'You must be logged in to save.');
            return;
        }

        setIsSaving(true);
        try {
            const dataToUpdate = {
                job_location_lat: region.latitude, // Use current region state
                job_location_lng: region.longitude, // Use current region state
                job_location_address: selectedAddress,
                last_updated_at: Timestamp.now()
            };
            const userDocRef = doc(db, 'users', uid);
            await updateDoc(userDocRef, dataToUpdate);
            console.log(`User document ${uid} updated successfully with job location.`);
            navigation.navigate('BusinessLogo'); // Navigate next

        } catch (error) {
            console.error('Error updating user document:', error);
            Alert.alert('Save Error', 'Could not save the job location.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        // Use global container, ensure content starts from top
        <View style={[globalStyles.container, { justifyContent: 'flex-start' }]}>
            {/* Header */}
            <ProfileNavHeader
                stepText="2/12" // *** Adjust Step Number ***
                progress={2 / 12} // *** Adjust Progress ***
                showBack={true}
                showSkip={true}
                onSkip={() => navigation.navigate('BusinessLogo')}
            />

            {/* Title - Match worker example margin */}
            <Text style={[
                globalStyles.title,
                // Match worker example title's top margin (adjust 40 if needed)
                { marginTop: spacing.xl + 40, marginBottom: spacing.xs }
            ]}>
                Your Business Location?
            </Text>

             {/* Selected Address Display - Match worker example style */}
            {selectedAddress ? (
                 <Text
                    style={{ // Copied directly from worker example
                        textAlign: 'center',
                        color: colors.info,
                        fontSize: 14,
                        marginTop: spacing.s,
                        marginBottom: spacing.m,
                        paddingHorizontal: spacing.l,
                    }}
                    numberOfLines={2}
                 >
                     {isGeocoding ? 'Fetching address...' : selectedAddress}
                 </Text>
            ) : (
                // Add placeholder space if needed to prevent layout jumps
                 <View style={{ height: 20 + spacing.s + spacing.m, paddingHorizontal: spacing.l }}>
                     <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 14, marginTop: spacing.s}}>
                         Search or tap map to select location
                     </Text>
                 </View>
            )}

            {/* Google Places Search Input Container - Match worker example style */}
            <View
                 style={{ // Copied directly from worker example
                    marginTop: spacing.s,
                    marginBottom: spacing.l,
                    marginHorizontal: spacing.l, // Use horizontal margin like worker example
                    zIndex: 99, // High zIndex like worker example
                 }}
            >
                <GooglePlacesAutocomplete
                    ref={placesRef}
                    placeholder="Search job address" // Updated placeholder
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        const loc = details?.geometry?.location;
                        const addr = details?.formatted_address;
                        if (loc && addr) {
                            animateToRegion(loc.lat, loc.lng); // Use animateToRegion
                            setSelectedAddress(addr);
                        } else {
                            Alert.alert('Location Error', 'Could not get location details.');
                        }
                         Keyboard.dismiss(); // Dismiss keyboard on selection
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                        components: 'country:il', // Bias to Israel
                    }}
                    styles={{ // Copied directly from worker example styles prop
                        container: { flex: 0 },
                        textInput: {
                            height: 48,
                            borderRadius: 12,
                            borderColor: colors.muted,
                            borderWidth: 1,
                            paddingHorizontal: spacing.m,
                            backgroundColor: colors.white, // Use color from theme
                            fontSize: 16,
                            color: colors.textPrimary, // Added text color
                        },
                        listView: {
                            backgroundColor: colors.white,
                            borderRadius: 10,
                            marginTop: 4,
                            elevation: 3,
                            shadowColor: colors.black, // Use color from theme
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            shadowOffset: { width: 0, height: 2 },
                            borderWidth: Platform.OS === 'android' ? 0 : 1, // Optional border for iOS
                            borderColor: colors.muted, // Optional border color
                        },
                        row: { // Style each row in dropdown
                             padding: spacing.m,
                             height: 'auto',
                        },
                        description: { // Style address text in dropdown
                             color: colors.textPrimary,
                             fontSize: 15,
                        },
                         separator: { // Style separator line
                             height: 1,
                             backgroundColor: colors.muted,
                        },
                    }}
                     textInputProps={{
                         placeholderTextColor: colors.textSecondary,
                         clearButtonMode: 'while-editing',
                    }}
                    enablePoweredByContainer={false}
                    suppressDefaultStyles
                    onFail={console.error}
                    onNotFound={() => Alert.alert('Not Found', 'Address not found.')}
                    keyboardShouldPersistTaps="handled" // Keep dropdown open on tap
                />
            </View>

            {/* Map Display Container - Match worker example style */}
            <View
                style={{ // Copied directly from worker example
                    flex: 1, // Take remaining space
                    marginTop: spacing.m, // Use worker example margin
                    marginHorizontal: spacing.l, // Use worker example margin
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: colors.muted, // BG while map loads
                }}
            >
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    region={region}
                    onPress={handleMapPress}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                >
                    {/* Use region state directly for marker simplicity */}
                    <Marker coordinate={region} />
                </MapView>
                 {/* Loading indicator over map */}
                 {isGeocoding && (
                     <ActivityIndicator
                        size="large"
                        color={colors.primary}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)' }}
                     />
                 )}
            </View>

            {/* Save Button - Match worker example style */}
            <Button
                mode="contained"
                onPress={handleSave}
                disabled={!selectedAddress || isSaving || isGeocoding}
                loading={isSaving}
                style={[
                    globalStyles.button, // Use global style for positioning (absolute bottom, horizontal margins/padding)
                    // Only override background color
                    { backgroundColor: selectedAddress ? colors.primary : colors.muted }
                ]}
                contentStyle={globalStyles.buttonContent} // Use global content style
                labelStyle={{ color: colors.white, fontWeight: '600' }} // Use global label style
            >
                {isSaving ? 'Saving...' : 'Next'}
            </Button>
        </View>
    );
}