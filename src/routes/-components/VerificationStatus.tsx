import { useKyc } from "@/store/authStore";

export default function VerificationStatus() {
  const [kyc] = useKyc();
  return <div></div>;
}
