import { redirect } from "@tanstack/react-router";

export const Loader = () => {
  console.log("Loader executed");
  return redirect({ to: "/home" });
};
export default function index() {
  return <div></div>;
}
