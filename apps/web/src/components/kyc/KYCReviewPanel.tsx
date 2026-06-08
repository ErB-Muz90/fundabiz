'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, AlertTriangle, Shield, User, Building2, MapPin, FileText } from 'lucide-react';
import { Badge } from '@/components/shared/Badge';
import { formatDate } from '@/lib/format';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface KYCDocument {
  id: string;
  type: string;
  url: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface KYCApplication {
  id: string;
  userId: string;
  userName: string;
  businessName: string;
  businessType: string;
  county: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  riskScore: number;
  documents: KYCDocument[];
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

interface KYCReviewPanelProps {
  application: KYCApplication;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onFlag: (id: string, reason: string) => void;
  isLoading?: boolean;
}

export function KYCReviewPanel({ application, onApprove, onReject, onFlag, isLoading }: KYCReviewPanelProps) {
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | 'flag' | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const riskColor = application.riskScore < 30 ? 'text-green-600' : application.riskScore < 60 ? 'text-yellow-600' : 'text-red-600';
  const riskBg = application.riskScore < 30 ? 'bg-green-50' : application.riskScore < 60 ? 'bg-yellow-50' : 'bg-red-50';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">KYC Application Review</h2>
            <p className="text-sm text-gray-500 mt-1">Application #{application.id.slice(0, 8)}</p>
          </div>
          <Badge
            variant={
              application.status === 'approved' ? 'success' :
              application.status === 'rejected' ? 'danger' :
              application.status === 'flagged' ? 'warning' : 'info'
            }
          >
            {application.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{application.userName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">User ID</p>
                <p className="text-sm font-medium text-gray-900">{application.userId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(application.submittedAt)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Business Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Business Name</p>
                <p className="text-sm font-medium text-gray-900">{application.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Business Type</p>
                <p className="text-sm font-medium text-gray-900">{application.businessType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">County</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" /> {application.county}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Risk Assessment
            </h3>
            <div className={clsx('px-3 py-1 rounded-full text-sm font-semibold', riskBg, riskColor)}>
              Score: {application.riskScore}/100
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={clsx('h-2 rounded-full transition-all', riskColor.replace('text', 'bg'))}
              style={{ width: `${application.riskScore}%` }}
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4" /> Documents
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {application.documents.map((doc) => (
              <div key={doc.id} className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 capitalize">{doc.type.replace(/_/g, ' ')}</p>
                <Badge variant={doc.status === 'verified' ? 'success' : doc.status === 'rejected' ? 'danger' : 'info'} size="sm">
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Decision</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
              placeholder="Add notes about this application..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setShowConfirm('approve')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button
            onClick={() => setShowConfirm('reject')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => setShowConfirm('flag')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" /> Flag for Review
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm === 'approve'}
        title="Approve KYC Application"
        message="Are you sure you want to approve this application? This action cannot be undone."
        onConfirm={() => { onApprove(application.id, notes); setShowConfirm(null); }}
        onCancel={() => setShowConfirm(null)}
        confirmLabel="Approve"
        variant="info"
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={showConfirm === 'reject'}
        title="Reject KYC Application"
        message="Are you sure you want to reject this application? The applicant will be notified."
        onConfirm={() => { onReject(application.id, rejectReason || notes); setShowConfirm(null); }}
        onCancel={() => setShowConfirm(null)}
        confirmLabel="Reject"
        variant="danger"
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={showConfirm === 'flag'}
        title="Flag KYC Application"
        message="This will flag the application for further manual review."
        onConfirm={() => { onFlag(application.id, notes); setShowConfirm(null); }}
        onCancel={() => setShowConfirm(null)}
        confirmLabel="Flag"
        variant="warning"
        isLoading={isLoading}
      />
    </div>
  );
}
