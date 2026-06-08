import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { KYCSubmission, getSubmissionStatus } from '../../services/kyc.service';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pending Review', color: '#f57c00', icon: '⏳' },
  REVIEW: { label: 'Under Review', color: '#1a73e8', icon: '🔍' },
  APPROVED: { label: 'Approved', color: '#34a853', icon: '✅' },
  REJECTED: { label: 'Rejected', color: '#d32f2f', icon: '❌' },
  FLAGGED: { label: 'Flagged', color: '#d32f2f', icon: '🚩' },
};

const TIMELINE_ORDER = ['PENDING', 'REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED'];

const KYCStatusScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [submission, setSubmission] = useState<KYCSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSubmission(id);
    }
  }, [id]);

  const loadSubmission = async (subId: string) => {
    try {
      const data = await getSubmissionStatus(subId);
      setSubmission(data);
    } catch {
      // failed to load
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (!submission) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Submission not found</Text>
      </View>
    );
  }

  const statusCfg = STATUS_CONFIG[submission.status] || STATUS_CONFIG.PENDING;
  const currentIdx = TIMELINE_ORDER.indexOf(submission.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusBanner, { backgroundColor: statusCfg.bg || '#f5f5f5' }]}>
        <Text style={styles.statusIcon}>{statusCfg.icon}</Text>
        <Text style={[styles.statusLabel, { color: statusCfg.color }]}>
          {statusCfg.label}
        </Text>
      </View>

      {submission.rejectionReason && (
        <View style={styles.rejectionBox}>
          <Text style={styles.rejectionTitle}>Rejection Reason</Text>
          <Text style={styles.rejectionText}>{submission.rejectionReason}</Text>
        </View>
      )}

      <View style={styles.timeline}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {TIMELINE_ORDER.map((step, idx) => {
          const cfg = STATUS_CONFIG[step];
          const isReached = currentIdx >= idx;
          return (
            <View key={step} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  isReached ? { backgroundColor: cfg.color } : styles.timelineDotInactive,
                ]}
              />
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    isReached ? { color: cfg.color } : styles.timelineLabelInactive,
                  ]}
                >
                  {cfg.label}
                </Text>
                {isReached && step === submission.status && (
                  <Text style={styles.timelineDate}>
                    {new Date(submission.updatedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Submission Details</Text>
        <DetailRow label="Type" value={submission.type === 'SME' ? 'SME' : 'Supplier'} />
        <DetailRow label="Business Name" value={submission.businessInfo?.businessName} />
        <DetailRow label="Owner" value={submission.personalInfo?.fullName} />
        <DetailRow label="Phone" value={submission.personalInfo?.phone} />
        <DetailRow label="County" value={submission.businessInfo?.county} />
        <DetailRow label="Created" value={new Date(submission.createdAt).toLocaleString()} />
        <DetailRow label="Updated" value={new Date(submission.updatedAt).toLocaleString()} />
      </View>
    </ScrollView>
  );
};

const DetailRow: React.FC<{ label: string; value?: string }> = ({
  label,
  value,
}) => (
  <View style={detailStyles.row}>
    <Text style={detailStyles.label}>{label}</Text>
    <Text style={detailStyles.value}>{value || '-'}</Text>
  </View>
);

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  statusBanner: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  rejectionBox: {
    backgroundColor: '#fdecea',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  timeline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineDotInactive: {
    backgroundColor: '#ddd',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  timelineLabelInactive: {
    color: '#bbb',
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});

export default KYCStatusScreen;
