interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "INVESTMENT";
  status: "SUCCESS";
  reference: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  wallet: {
    id: string;
    userId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}
