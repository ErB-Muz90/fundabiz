import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useSubmissionStore } from '../../store/submissions.store';
import { router } from 'expo-router';
import { offlineQueue } from '../../services/offline-sync';

const HomeScreen: React.FC = () => {
  const { agent } = useAuthStore();
  const { submissions, fetchMySubmissions, syncQueueSize } = useSubmissionStore();
  const [refreshing, setRefreshing] = useState(false);

  const pendingCount = submissions.filter(
    (s) => s.status === 'PENDING' || s.status === 'REVIEW'
  ).length;

  const todayCount = submissions.filter((s) => {
    const today = new Date();
    const created = new Date(s.createdAt);
    return created.toDateString() === today.toDateString();
  }).length;

  useEffect(() => {
    fetchMySubmissions();
    offlineQueue.init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMySubmissions();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Welcome, {agent?.name?.split(' ')[0] || 'Agent'}
        </Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-KE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, styles.cardPending]}>
          <Text style={styles.cardNumber}>{pendingCount}</Text>
          <Text style={styles.cardLabel}>Pending{'\n'}Submissions</Text>
        </View>
        <View style={[styles.card, styles.cardToday]}>
          <Text style={styles.cardNumber}>{todayCount}</Text>
          <Text style={styles.cardLabel}>Today's{'\n'}Count</Text>
        </View>
        <View style={[styles.card, styles.cardSync]}>
          <Text style={styles.cardNumber}>
            {syncQueueSize > 0 ? syncQueueSize : 'OK'}
          </Text>
          <Text style={styles.cardLabel}>{syncQueueSize > 0 ? 'Pending{'\n'}Sync' : 'Sync{'\n'}Status'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            router.push({
              pathname: '/onboarding/select-type',
              params: { entityType: 'SME' },
            })
          }
        >
          <Text style={styles.actionButtonText}>New KYC Submission</Text>
          <Text style={styles.actionButtonSub}>Register a new SME or Supplier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionSecondary]}
          onPress={() => router.push('/kyc/my-submissions')}
        >
          <Text style={[styles.actionButtonText, styles.actionSecondaryText]}>
            My Submissions
          </Text>
          <Text style={styles.actionButtonSub}>
            View all your KYC submissions ({submissions.length})
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 20,
  },
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardPending: {
    borderTopColor: '#f57c00',
    borderTopWidth: 3,
  },
  cardToday: {
    borderTopColor: '#1a73e8',
    borderTopWidth: 3,
  },
  cardSync: {
    borderTopColor: '#34a853',
    borderTopWidth: 3,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  cardLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  actionSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1a73e8',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionSecondaryText: {
    color: '#1a73e8',
  },
  actionButtonSub: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
});

export default HomeScreen;
