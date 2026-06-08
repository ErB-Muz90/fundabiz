import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { offlineQueue } from '../services/offline-sync';

const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const slideAnim = React.useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      setQueueSize(offlineQueue.getQueueSize());

      Animated.timing(slideAnim, {
        toValue: offline ? 0 : -80,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => unsubscribe();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.text}>
        {isOffline
          ? 'You are offline'
          : queueSize > 0
            ? `Syncing ${queueSize} pending item${queueSize > 1 ? 's' : ''}...`
            : ''}
      </Text>
      {queueSize > 0 && !isOffline && (
        <Text style={styles.syncing}>Syncing...</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f57c00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  syncing: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.8,
  },
});

export default OfflineBanner;
