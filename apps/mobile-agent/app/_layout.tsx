import React, { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store/auth.store';
import OfflineBanner from '../src/components/OfflineBanner';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments]);
}

export default function RootLayout() {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    restoreSession().finally(() => setIsReady(true));
  }, []);

  useProtectedRoute(isAuthenticated);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: true,
            headerTitle: 'Login',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="onboarding/select-type"
          options={{
            headerShown: true,
            headerTitle: 'New Submission',
          }}
        />
        <Stack.Screen
          name="onboarding/personal-info"
          options={{
            headerShown: true,
            headerTitle: 'Personal Info',
          }}
        />
        <Stack.Screen
          name="onboarding/business-info"
          options={{
            headerShown: true,
            headerTitle: 'Business Info',
          }}
        />
        <Stack.Screen
          name="onboarding/document-capture"
          options={{
            headerShown: true,
            headerTitle: 'Documents',
          }}
        />
        <Stack.Screen
          name="onboarding/geo-tag"
          options={{
            headerShown: true,
            headerTitle: 'Geo-Tag',
          }}
        />
        <Stack.Screen
          name="onboarding/submit-kyc"
          options={{
            headerShown: true,
            headerTitle: 'Review & Submit',
          }}
        />
        <Stack.Screen
          name="kyc/my-submissions"
          options={{
            headerShown: true,
            headerTitle: 'My Submissions',
          }}
        />
        <Stack.Screen
          name="kyc/status"
          options={{
            headerShown: true,
            headerTitle: 'Submission Status',
          }}
        />
        <Stack.Screen
          name="profile/index"
          options={{
            headerShown: true,
            headerTitle: 'My Profile',
          }}
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
});
