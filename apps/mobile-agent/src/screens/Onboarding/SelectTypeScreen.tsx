import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSubmissionStore } from '../../store/submissions.store';

const SelectTypeScreen: React.FC = () => {
  const { setCurrentSubmission } = useSubmissionStore();

  const handleSelect = (type: 'SME' | 'SUPPLIER') => {
    setCurrentSubmission({ type });
    router.push('/onboarding/personal-info');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New KYC Submission</Text>
        <Text style={styles.subtitle}>
          Select the type of entity you are registering
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelect('SME')}
        >
          <Text style={styles.optionIcon}>🏢</Text>
          <Text style={styles.optionTitle}>Register SME</Text>
          <Text style={styles.optionDescription}>
            Register a Small or Medium Enterprise. Collect business details,
            owner information, and required documents.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelect('SUPPLIER')}
        >
          <Text style={styles.optionIcon}>📦</Text>
          <Text style={styles.optionTitle}>Register Supplier</Text>
          <Text style={styles.optionDescription}>
            Register a new Supplier/Vendor. Capture company info, KYC
            documents, and premises details.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#e8edf2',
  },
  optionIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SelectTypeScreen;
