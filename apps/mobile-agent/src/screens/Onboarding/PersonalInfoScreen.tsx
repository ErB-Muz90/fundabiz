import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSubmissionStore } from '../../store/submissions.store';

const ID_TYPES = ['National ID', 'Passport', 'Driving License', 'Alien ID'];

const PersonalInfoScreen: React.FC = () => {
  const { currentSubmission, updateSubmission } = useSubmissionStore();
  const [fullName, setFullName] = useState(
    currentSubmission?.personalInfo?.fullName || ''
  );
  const [idNumber, setIdNumber] = useState(
    currentSubmission?.personalInfo?.idNumber || ''
  );
  const [idType, setIdType] = useState(
    currentSubmission?.personalInfo?.idType || ID_TYPES[0]
  );
  const [phone, setPhone] = useState(
    currentSubmission?.personalInfo?.phone || ''
  );
  const [email, setEmail] = useState(
    currentSubmission?.personalInfo?.email || ''
  );
  const [showIdTypes, setShowIdTypes] = useState(false);

  const isFormValid = fullName.trim() && idNumber.trim() && phone.trim();

  const handleNext = () => {
    updateSubmission({
      personalInfo: { fullName, idNumber, idType, phone, email },
    });
    router.push('/onboarding/business-info');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.step}>Step 1 of 5</Text>
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.subtitle}>
            Enter the personal details of the business owner/representative
          </Text>
        </View>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. John Mwangi"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>ID Number *</Text>
        <TextInput
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder="e.g. 12345678"
          placeholderTextColor="#999"
          keyboardType="default"
        />

        <Text style={styles.label}>ID Type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowIdTypes(!showIdTypes)}
        >
          <Text style={styles.dropdownText}>{idType}</Text>
          <Text style={styles.dropdownArrow}>{showIdTypes ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showIdTypes && (
          <View style={styles.dropdownList}>
            {ID_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dropdownItem,
                  idType === type && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setIdType(type);
                  setShowIdTypes(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    idType === type && styles.dropdownItemTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. 0712 345 678"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="e.g. john@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!isFormValid}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1a1a2e',
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a2e',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownList: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: '#e8f0fe',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
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

export default PersonalInfoScreen;
