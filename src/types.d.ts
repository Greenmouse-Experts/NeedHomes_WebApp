export interface USER {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: "INDIVIDUAL" | "INVESTOR";
  isEmailVerified: boolean;
  roles: string[];
  permissions: string[];
}
