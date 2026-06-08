import * as Location from 'expo-location';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeocodedAddress {
  street: string | null;
  subregion: string | null;
  region: string | null;
  country: string | null;
  postalCode: string | null;
  formattedAddress: string | null;
}

export const getCurrentPosition = async (): Promise<GeoPosition> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    timeout: 15000,
  });

  return {
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
    accuracy: loc.coords.accuracy ?? 0,
    altitude: loc.coords.altitude,
    heading: loc.coords.heading,
    speed: loc.coords.speed,
  };
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodedAddress> => {
  const addresses = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (addresses.length === 0) {
    return {
      street: null,
      subregion: null,
      region: null,
      country: null,
      postalCode: null,
      formattedAddress: null,
    };
  }

  const addr = addresses[0];
  return {
    street: addr.street ?? null,
    subregion: addr.subregion ?? null,
    region: addr.region ?? null,
    country: addr.country ?? null,
    postalCode: addr.postalCode ?? null,
    formattedAddress: [addr.street, addr.subregion, addr.region, addr.country]
      .filter(Boolean)
      .join(', '),
  };
};
