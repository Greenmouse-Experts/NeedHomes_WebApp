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
