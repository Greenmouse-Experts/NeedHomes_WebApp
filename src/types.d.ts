export interface USER {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: "INDIVIDUAL" | "INVESTOR" | "PARTNER";
  isEmailVerified: boolean;
  roles: string[];
  permissions: string[];
}

export interface INVESTOR {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string;
  accountType: "CORPORATE";
  account_status: "ACTIVE";
  account_verification_status: "PENDING";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: {
    userId: string;
    roleId: string;
    assignedAt: string;
    role: {
      name: string;
    };
  }[];
}
[];
