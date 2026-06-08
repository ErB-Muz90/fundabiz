import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSubmissionStore } from '../../store/submissions.store';
import { SubmitKYCData } from '../../services/kyc.service';

const SubmitKYCScreen: React.FC = () => {
  const { currentSubmission, submitKYC, isSubmitting, error } =
    useSubmissionStore();

  const handleSubmit = async () => {
    if (!currentSubmission) return;
    try {
      await submitKYC(currentSubmission as SubmitKYCData);
      Alert.alert(
        'Success',
        'Your KYC submission has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              useSubmissionStore.getState().setCurrentSubmission(null);
              router.replace('/');
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Please try again');
    }
  };

  const info = currentSubmission;

  if (!info) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No submission data found.</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/onboarding/select-type')}
        >
          <Text style={styles.startButtonText}>Start New Submission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 5 of 5</Text>
        <Text style={styles.title}>Review & Submit</Text>
        <Text style={styles.subtitle}>
          Review all collected information before submitting
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submission Type</Text>
        <Text style={styles.sectionValue}>
          {info.type === 'SME' ? 'SME Registration' : 'Supplier Registration'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {info.personalInfo && (
          <>
            <InfoRow label="Full Name" value={info.personalInfo.fullName} />
            <InfoRow label="ID Number" value={info.personalInfo.idNumber} />
            <InfoRow label="ID Type" value={info.personalInfo.idType} />
            <InfoRow label="Phone" value={info.personalInfo.phone} />
            <InfoRow label="Email" value={info.personalInfo.email} />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        {info.businessInfo && (
          <>
            <InfoRow label="Business Name" value={info.businessInfo.businessName} />
            <InfoRow label="Business Type" value={info.businessInfo.businessType} />
            <InfoRow
              label="Registration No."
              value={info.businessInfo.registrationNumber}
            />
            <InfoRow
              label="Year Established"
              value={info.businessInfo.yearEstablished}
            />
            <InfoRow label="County" value={info.businessInfo.county} />
            <InfoRow label="Sub-County" value={info.businessInfo.subCounty} />
            <InfoRow
              label="Location"
              value={info.businessInfo.locationDescription}
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        {info.documents && (
          <>
            {info.documents.businessRegistrationCert && (
              <InfoRow
                label="Business Registration Cert"
                value="Captured"
              />
            )}
            {info.documents.idPhoto && (
              <InfoRow label="ID Photo" value="Captured" />
            )}
            {info.documents.kraPinCert && (
              <InfoRow label="KRA PIN Certificate" value="Captured" />
            )}
            {info.documents.passportPhoto && (
              <InfoRow label="Passport Photo" value="Captured" />
            )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geo-Tag</Text>
        {info.geoTag && (
          <>
            <InfoRow
              label="Latitude"
              value={info.geoTag.latitude.toFixed(6)}
            />
            <InfoRow
              label="Longitude"
              value={info.geoTag.longitude.toFixed(6)}
            />
            <InfoRow
              label="Accuracy"
              value={`±${info.geoTag.accuracy.toFixed(1)}m`}
            />
          </>
        )}
        <InfoRow
          label="Premises Photo"
          value={info.premisesPhoto ? 'Captured' : 'Not captured'}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit KYC</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value}>{value || '-'}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionValue: {
    fontSize: 16,
    color: '#1a73e8',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fdecea',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#34a853',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SubmitKYCScreen;
