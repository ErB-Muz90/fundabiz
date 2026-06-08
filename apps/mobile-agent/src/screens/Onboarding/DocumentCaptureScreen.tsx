import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useSubmissionStore } from '../../store/submissions.store';
import CameraCapture from '../../components/CameraCapture';

interface DocEntry {
  key: string;
  label: string;
  captured: boolean;
  base64?: string;
}

const REQUIRED_DOCS: Omit<DocEntry, 'captured' | 'base64'>[] = [
  { key: 'businessRegistrationCert', label: 'Business Registration Certificate' },
  { key: 'idPhoto', label: 'ID Photo' },
  { key: 'kraPinCert', label: 'KRA PIN Certificate' },
  { key: 'passportPhoto', label: 'Passport Photo' },
];

const DocumentCaptureScreen: React.FC = () => {
  const { currentSubmission, updateSubmission } = useSubmissionStore();
  const [docs, setDocs] = useState<DocEntry[]>(
    REQUIRED_DOCS.map((d) => ({
      ...d,
      captured:
        !!(currentSubmission?.documents as Record<string, string>)?.[d.key],
      base64:
        (currentSubmission?.documents as Record<string, string>)?.[d.key],
    }))
  );
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const allCaptured = docs.every((d) => d.captured);

  const handleCapture = (base64: string) => {
    const updated = docs.map((d) =>
      d.key === activeDoc ? { ...d, captured: true, base64 } : d
    );
    setDocs(updated);
    setActiveDoc(null);

    const docMap: Record<string, string> = {};
    updated.forEach((d) => {
      if (d.base64) docMap[d.key] = d.base64;
    });
    updateSubmission({ documents: docMap });
  };

  const handleNext = () => {
    router.push('/onboarding/geo-tag');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 3 of 5</Text>
          <Text style={styles.title}>Document Capture</Text>
          <Text style={styles.subtitle}>
            Capture the required documents for this submission
          </Text>
        </View>

        {docs.map((doc) => (
          <View key={doc.key} style={styles.docCard}>
            <View style={styles.docInfo}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Text style={styles.docStatus}>
                {doc.captured ? 'Captured' : 'Not captured'}
              </Text>
            </View>
            {doc.base64 && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${doc.base64}` }}
                style={styles.thumbnail}
              />
            )}
            <TouchableOpacity
              style={[
                styles.captureBtn,
                doc.captured && styles.captureBtnDone,
              ]}
              onPress={() => setActiveDoc(doc.key)}
            >
              <Text
                style={[
                  styles.captureBtnText,
                  doc.captured && styles.captureBtnTextDone,
                ]}
              >
                {doc.captured ? 'Recapture' : 'Capture'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !allCaptured && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!allCaptured}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!activeDoc} animationType="slide">
        {activeDoc && (
          <CameraCapture
            onCapture={handleCapture}
            onClose={() => setActiveDoc(null)}
          />
        )}
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
  docCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  docInfo: {
    flex: 1,
    marginRight: 12,
  },
  docLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  docStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  captureBtn: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  captureBtnDone: {
    backgroundColor: '#e8f0fe',
  },
  captureBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  captureBtnTextDone: {
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

export default DocumentCaptureScreen;
