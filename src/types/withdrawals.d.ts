export interface withdrawal_reqeust {
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  transferCode: string | null;
  transferReference: string;
  transferRecipient: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accountType: "PARTNER" | string;
  };
}
