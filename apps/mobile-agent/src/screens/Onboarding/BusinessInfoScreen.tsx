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

const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Muranga', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

const BUSINESS_TYPES = [
  'Sole Proprietorship', 'Partnership', 'Limited Company',
  'Cooperative', 'Self Help Group', 'Other',
];

const BusinessInfoScreen: React.FC = () => {
  const { currentSubmission, updateSubmission } = useSubmissionStore();
  const [businessName, setBusinessName] = useState(
    currentSubmission?.businessInfo?.businessName || ''
  );
  const [businessType, setBusinessType] = useState(
    currentSubmission?.businessInfo?.businessType || ''
  );
  const [registrationNumber, setRegistrationNumber] = useState(
    currentSubmission?.businessInfo?.registrationNumber || ''
  );
  const [yearEstablished, setYearEstablished] = useState(
    currentSubmission?.businessInfo?.yearEstablished || ''
  );
  const [county, setCounty] = useState(
    currentSubmission?.businessInfo?.county || ''
  );
  const [subCounty, setSubCounty] = useState(
    currentSubmission?.businessInfo?.subCounty || ''
  );
  const [locationDescription, setLocationDescription] = useState(
    currentSubmission?.businessInfo?.locationDescription || ''
  );
  const [showCounties, setShowCounties] = useState(false);
  const [showBizTypes, setShowBizTypes] = useState(false);

  const isFormValid = businessName.trim() && county.trim();

  const handleNext = () => {
    updateSubmission({
      businessInfo: {
        businessName,
        businessType,
        registrationNumber,
        yearEstablished,
        county,
        subCounty,
        locationDescription,
      },
    });
    router.push('/onboarding/document-capture');
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
          <Text style={styles.step}>Step 2 of 5</Text>
          <Text style={styles.title}>Business Information</Text>
          <Text style={styles.subtitle}>
            Provide details about the business entity
          </Text>
        </View>

        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="e.g. Mwangi Enterprises Ltd"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Business Type</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowBizTypes(!showBizTypes)}
        >
          <Text style={businessType ? styles.dropdownText : styles.placeholder}>
            {businessType || 'Select business type'}
          </Text>
          <Text style={styles.dropdownArrow}>{showBizTypes ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showBizTypes && (
          <View style={styles.dropdownList}>
            {BUSINESS_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dropdownItem,
                  businessType === type && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setBusinessType(type);
                  setShowBizTypes(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    businessType === type && styles.dropdownItemTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Registration Number</Text>
        <TextInput
          style={styles.input}
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          placeholder="e.g. CPR/2023/123456"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Year Established</Text>
        <TextInput
          style={styles.input}
          value={yearEstablished}
          onChangeText={setYearEstablished}
          placeholder="e.g. 2020"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={4}
        />

        <Text style={styles.label}>County *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowCounties(!showCounties)}
        >
          <Text style={county ? styles.dropdownText : styles.placeholder}>
            {county || 'Select county'}
          </Text>
          <Text style={styles.dropdownArrow}>{showCounties ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showCounties && (
          <ScrollView style={styles.countyList} nestedScrollEnabled>
            {COUNTIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.dropdownItem,
                  county === c && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setCounty(c);
                  setShowCounties(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    county === c && styles.dropdownItemTextActive,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.label}>Sub-County</Text>
        <TextInput
          style={styles.input}
          value={subCounty}
          onChangeText={setSubCounty}
          placeholder="e.g. Westlands"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Location Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={locationDescription}
          onChangeText={setLocationDescription}
          placeholder="Describe the location, landmarks, building name, floor, etc."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
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
  textArea: {
    minHeight: 100,
    paddingTop: 14,
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
  placeholder: {
    fontSize: 16,
    color: '#999',
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
  countyList: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: '#fff',
    maxHeight: 200,
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

export default BusinessInfoScreen;
