import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSubmissionStore } from '../../store/submissions.store';
import { KYCSubmission } from '../../services/kyc.service';
import { router } from 'expo-router';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: '#f57c00', bg: '#fff3e0' },
  REVIEW: { label: 'In Review', color: '#1a73e8', bg: '#e8f0fe' },
  APPROVED: { label: 'Approved', color: '#34a853', bg: '#e6f4ea' },
  REJECTED: { label: 'Rejected', color: '#d32f2f', bg: '#fdecea' },
  FLAGGED: { label: 'Flagged', color: '#d32f2f', bg: '#fdecea' },
};

const MySubmissionsScreen: React.FC = () => {
  const { submissions, fetchMySubmissions } = useSubmissionStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMySubmissions();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: KYCSubmission }) => {
    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/kyc/status',
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.businessName}>
            {item.businessInfo?.businessName || 'N/A'}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.badgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>
        <Text style={styles.typeText}>
          {item.type === 'SME' ? 'SME' : 'Supplier'}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={submissions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No submissions yet</Text>
            <Text style={styles.emptySubtext}>
              Pull to refresh or start a new KYC submission
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeText: {
    fontSize: 13,
    color: '#1a73e8',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default MySubmissionsScreen;
