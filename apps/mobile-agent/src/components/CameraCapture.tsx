import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      if (photo?.base64) {
        setPreview(photo.base64);
      } else if (photo?.uri) {
        const b64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setPreview(b64);
      }
    } catch {
      // capture failed silently
    }
  };

  const handleConfirm = () => {
    if (preview) {
      onCapture(preview);
    }
  };

  const handleRetake = () => {
    setPreview(null);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to capture documents.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (preview) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${preview}` }}
          style={styles.preview}
          resizeMode="contain"
        />
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.button} onPress={handleRetake}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        <View style={styles.cameraOverlay}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() =>
              setFacing((f) => (f === 'back' ? 'front' : 'back'))
            }
          >
            <Text style={styles.iconText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() =>
              setFlash((f) => (f === 'off' ? 'on' : 'off'))
            }
          >
            <Text style={styles.iconText}>
              {flash === 'off' ? 'Flash Off' : 'Flash On'}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
        >
          <View style={styles.captureCircle} />
        </TouchableOpacity>
        <View style={styles.spacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  preview: {
    flex: 1,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  flipButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  flashButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  iconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#34a853',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  closeButton: {
    padding: 12,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
  spacer: {
    width: 70,
  },
});

export default CameraCapture;
