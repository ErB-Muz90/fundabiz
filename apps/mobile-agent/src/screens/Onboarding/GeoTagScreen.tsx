import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSubmissionStore } from '../../store/submissions.store';
import GeoTag from '../../components/GeoTag';
import CameraCapture from '../../components/CameraCapture';
import { GeoPosition } from '../../services/location.service';

const GeoTagScreen: React.FC = () => {
  const { currentSubmission, updateSubmission } = useSubmissionStore();
  const [location, setLocation] = useState<GeoPosition | null>(
    currentSubmission?.geoTag as GeoPosition | null
  );
  const [premisesPhoto, setPremisesPhoto] = useState<string | undefined>(
    currentSubmission?.premisesPhoto
  );
  const [showCamera, setShowCamera] = useState(false);

  const handleLocationAcquired = (pos: GeoPosition) => {
    setLocation(pos);
    updateSubmission({ geoTag: pos });
  };

  const handlePremisesPhoto = (base64: string) => {
    setPremisesPhoto(base64);
    setShowCamera(false);
    updateSubmission({ premisesPhoto: base64 });
  };

  const handleNext = () => {
    router.push('/onboarding/submit-kyc');
  };

  const handleBack = () => {
    router.back();
  };

  const canSubmit = location !== null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 4 of 5</Text>
          <Text style={styles.title}>Geo-Tag & Premises Photo</Text>
          <Text style={styles.subtitle}>
            Capture the GPS location and a photo of the business premises
          </Text>
        </View>

        <GeoTag onLocationAcquired={handleLocationAcquired} />

        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Premises Photo</Text>
          {premisesPhoto ? (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${premisesPhoto}` }}
                style={styles.premisesImage}
              />
              <TouchableOpacity
                style={styles.recaptureBtn}
                onPress={() => setShowCamera(true)}
              >
                <Text style={styles.recaptureBtnText}>Recapture</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.takePhotoBtn}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.takePhotoIcon}>📷</Text>
              <Text style={styles.takePhotoText}>Take Premises Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !canSubmit && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!canSubmit}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showCamera} animationType="slide">
        <CameraCapture
          onCapture={handlePremisesPhoto}
          onClose={() => setShowCamera(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  step: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a73e8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a2e',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    lineHeight: 20,
  },
  photoSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  takePhotoBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
  },
  takePhotoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  takePhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  photoPreview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  premisesImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  recaptureBtn: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  recaptureBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default GeoTagScreen;
