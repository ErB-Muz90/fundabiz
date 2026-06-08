import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getCurrentPosition, GeoPosition } from '../services/location.service';

interface GeoTagProps {
  onLocationAcquired: (location: GeoPosition) => void;
}

const GeoTag: React.FC<GeoTagProps> = ({ onLocationAcquired }) => {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      setLocation(pos);
      onLocationAcquired(pos);
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Location</Text>

      {location ? (
        <View style={styles.coordsContainer}>
          <Text style={styles.coordText}>
            Lat: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordText}>
            Lng: {location.longitude.toFixed(6)}
          </Text>
          <Text style={styles.coordText}>
            Accuracy: ±{location.accuracy.toFixed(1)}m
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>
          Tap "Capture Location" to record GPS coordinates
        </Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={captureLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {location ? 'Recapture Location' : 'Capture Location'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  coordsContainer: {
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  coordText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  error: {
    fontSize: 14,
    color: '#d32f2f',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GeoTag;
