import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface DocumentScannerProps {
  onCapture: (base64: string) => void;
  documentType: string;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onCapture,
  documentType,
}) => {
  const [permission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const capture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });
      if (photo?.base64) {
        onCapture(photo.base64);
      }
    } catch {
      // capture failed
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <View style={styles.guideFrame}>
            <Text style={styles.guideText}>
              Align {documentType.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  guideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default DocumentScanner;
