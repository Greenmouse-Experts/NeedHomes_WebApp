import { logout } from "@/store/authStore";
import { LogOut, AlertCircle } from "lucide-react";

export default function LogoutModal() {
  return (
    <>
      <dialog id="logout_modal" className="modal" data-theme="nh-light">
        <div className="modal-box max-w-sm text-center p-6 rounded-lg shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-2xl text-gray-800">
            Confirm Logout
          </h3>
          <p className="py-4 text-gray-600">
            Are you sure you want to log out? You will need to sign in again to
            access your account.
          </p>
          <div className="modal-action flex flex-col-reverse sm:flex-row gap-3">
            <form method="dialog" className="flex w-full gap-3">
              <button className="btn btn-outline flex-1 border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error flex-1 gap-2 bg-red-600 text-white hover:bg-red-700"
                onClick={() => logout()}
              >
                <LogOut size={20} />
                Logout
              </button>
            </form>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/50 backdrop-blur-md"
        >
          <button className="sr-only">close</button>
        </form>
      </dialog>
    </>
  );
}
