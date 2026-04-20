import { Button } from "@/components/ui/Button";
import { get_user_value, useAuth } from "@/store/authStore";
import { ShieldCheck } from "lucide-react";
import type { PropsWithChildren } from "react";

export const allow_invest = () => {
  const user = get_user_value();
  if (user?.user.accountType == "INVESTOR") return true;
  return false;
};

export default function InvestorOnly(props: PropsWithChildren) {
  const [auth] = useAuth();

  if (auth?.user.accountType == "INVESTOR") {
    return <div>{props.children}</div>;
  }
  return (
    <>
      <Button variant="primary" size="md">
        Sign In As Investor
      </Button>
    </>
  );
}
