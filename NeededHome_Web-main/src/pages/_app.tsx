import { Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export default function index() {
  return (
    <>
      <Toaster theme="light" richColors />
      <Outlet />
    </>
  );
}
