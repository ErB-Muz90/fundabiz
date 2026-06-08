import axios from 'axios';

const API_BASE = 'https://api.fundabiz.com/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export interface KYCSubmission {
  id: string;
  type: 'SME' | 'SUPPLIER';
  agentId: string;
  status: 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  personalInfo: {
    fullName: string;
    idNumber: string;
    idType: string;
    phone: string;
    email: string;
  };
  businessInfo: {
    businessName: string;
    businessType: string;
    registrationNumber: string;
    yearEstablished: string;
    county: string;
    subCounty: string;
    locationDescription: string;
  };
  documents: {
    businessRegistrationCert?: string;
    idPhoto?: string;
    kraPinCert?: string;
    passportPhoto?: string;
  };
  geoTag?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  premisesPhoto?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

export interface SubmitKYCData {
  type: 'SME' | 'SUPPLIER';
  personalInfo: KYCSubmission['personalInfo'];
  businessInfo: KYCSubmission['businessInfo'];
  documents: KYCSubmission['documents'];
  geoTag?: KYCSubmission['geoTag'];
  premisesPhoto?: string;
}

export const submitKYC = async (data: SubmitKYCData): Promise<KYCSubmission> => {
  const response = await api.post('/kyc/submit', data);
  return response.data;
};

export const getMySubmissions = async (): Promise<KYCSubmission[]> => {
  const response = await api.get('/kyc/my-submissions');
  return response.data;
};

export const getSubmissionStatus = async (id: string): Promise<KYCSubmission> => {
  const response = await api.get(`/kyc/submissions/${id}`);
  return response.data;
};

export const uploadDocument = async (
  base64: string,
  fileName: string
): Promise<{ url: string }> => {
  const response = await api.post('/upload/document', {
    base64,
    fileName,
    mimeType: 'image/jpeg',
  });
  return response.data;
};

export default api;
