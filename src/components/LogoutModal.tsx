import { logout } from "@/store/authStore";
import { LogOut, AlertCircle } from "lucide-react";

export default function LogoutModal() {
  return (
    <>
      <dialog id="logout_modal" className="modal " data-theme="nh-light">
        <div className="modal-box max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 mb-4">
            <AlertCircle className="h-6 w-6 text-error" />
          </div>
          <h3 className="font-bold text-xl">Confirm Logout</h3>
          <p className="py-4 text-base-content/70">
            Are you sure you want to log out? You will need to sign in again to
            access your account.
          </p>
          <div className="modal-action flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <form method="dialog" className="flex w-full gap-2">
              <button className="btn btn-ghost flex-1">Cancel</button>
              <button
                type="button"
                className="btn btn-error flex-1 gap-2"
                onClick={() => logout()}
              >
                <LogOut size={18} />
                Logout
              </button>
            </form>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/40 backdrop-blur-sm"
        >
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
