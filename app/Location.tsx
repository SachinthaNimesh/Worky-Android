import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { sendLocationData } from './api/locationService'; // Import the API function
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY; 

const LocationComponent = () => {
    const [locationInfo, setLocationInfo] = useState<{
        coords: Location.LocationObjectCoords | null;
        address: string | null;
        loading: boolean;
        error: string | null;
        studentId: number | null;
    }>({
        coords: null,
        address: null,
        loading: true,
        error: null,
        studentId: 1 // Replace with the Logic
    });
    
  
    const SERVER_URL = 'https://87e89eab-95e5-4c0f-8192-7ee0196e1581-dev.e1-us-east-azure.choreoapis.dev/employee-mgmt-system/student-mgmt-server/v1.0/location'; 

    useEffect(() => {
        const getDeviceLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setLocationInfo(prev => ({
                        ...prev,
                        loading: false,
                        error: 'Permission to access location was denied'
                    }));
                    return;
                }

                const deviceLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest
                });

                const address = await reverseGeocode(
                    deviceLocation.coords.latitude,
                    deviceLocation.coords.longitude
                );

                setLocationInfo({
                    coords: deviceLocation.coords,
                    address: address,
                    loading: false,
                    error: null,
                    studentId: 1 // Replace with the Logic
                });

                // Send location data to the web app
                const studentId = 1; // Replace with the Logic
                await sendLocationData(
                    SERVER_URL,
                    deviceLocation.coords.longitude,
                    deviceLocation.coords.latitude,
                    address,
                    studentId
                );

            } catch (error) {
                console.error("Error getting location: ", error);
                setLocationInfo(prev => ({
                    ...prev,
                    loading: false,
                    error: error instanceof Error ? error.message : 'An unknown error occurred'
                }));
            }
        };

        getDeviceLocation();
    }, []);

    const reverseGeocode = async (latitude: number, longitude: number) => {
        try {
            if (!GOOGLE_API_KEY) {
                throw new Error("Please provide a valid Google API key in your .env file");
            }

            interface GeocodeResponse {
                status: string;
                results: { formatted_address: string }[];
            }

            const response = await axios.get<GeocodeResponse>(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
            );

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                return response.data.results[0].formatted_address;
            } else {
                throw new Error(`Geocoding API error: ${response.data.status}`);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            return "Address lookup failed";
        }
    };

    return (
        <View style={styles.container}>
            {locationInfo.loading ? (
                <Text style={styles.loadingText}>Getting precise location...</Text>
            ) : locationInfo.error ? (
                <Text style={styles.errorText}>Error: {locationInfo.error}</Text>
            ) : (
                <View>
                    <Text style={styles.headerText}>Your Location</Text>
                    <Text style={styles.coordsText}>
                        Latitude: {locationInfo.coords ? locationInfo.coords.latitude.toFixed(6) : 'N/A'}
                    </Text>
                    <Text style={styles.coordsText}>
                        Longitude: {locationInfo.coords ? locationInfo.coords.longitude.toFixed(6) : 'N/A'}
                    </Text>
                    <Text style={styles.accuracyText}>
                        Accuracy: ±{locationInfo.coords && locationInfo.coords.accuracy ? locationInfo.coords.accuracy.toFixed(1) : 'N/A'} meters
                    </Text>
                    <Text style={styles.addressText}>
                        Address: {locationInfo.address}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        margin: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    coordsText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#34495e',
    },
    accuracyText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#7f8c8d',
    },
    addressText: {
        fontSize: 16,
        marginTop: 8,
        color: '#34495e',
    },
    loadingText: {
        fontSize: 16,
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
    }
});

export default LocationComponent;