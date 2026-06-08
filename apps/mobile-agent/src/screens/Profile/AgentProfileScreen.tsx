import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { useSubmissionStore } from '../../store/submissions.store';
import { router } from 'expo-router';

const AgentProfileScreen: React.FC = () => {
  const { agent, logout } = useAuthStore();
  const { submissions } = useSubmissionStore();

  const totalSubmissions = submissions.length;
  const approvedSubmissions = submissions.filter(
    (s) => s.status === 'APPROVED'
  ).length;
  const approvalRate =
    totalSubmissions > 0
      ? Math.round((approvedSubmissions / totalSubmissions) * 100)
      : 0;

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {agent?.name
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'AG'}
          </Text>
        </View>
        <Text style={styles.name}>{agent?.name || 'Agent'}</Text>
        <Text style={styles.phone}>{agent?.phone || ''}</Text>
        <Text style={styles.email}>{agent?.email || ''}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSubmissions}</Text>
          <Text style={styles.statLabel}>Total{'\n'}Submissions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{approvedSubmissions}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{approvalRate}%</Text>
          <Text style={styles.statLabel}>Approval{'\n'}Rate</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/kyc/my-submissions')}
        >
          <Text style={styles.menuItemText}>My Submissions</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  phone: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1a1a2e',
  },
  menuItemArrow: {
    fontSize: 22,
    color: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d32f2f',
  },
  logoutButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AgentProfileScreen;
