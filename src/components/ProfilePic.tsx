import { useAuth, set_user_value } from "@/store/authStore";
import { Button } from "./ui/Button";
import Modal from "@/components/modals/DialogModal";
import { useModal } from "@/store/modals";
import SelectImage from "@/components/images/SelectImage";
import { useSelectImage } from "@/helpers/images";
import { uploadImage } from "@/api/imageApi";
import apiClient from "@/api/simpleApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ThemeProvider from "@/simpleComps/ThemeProvider";

export default function ProfilePicture() {
  const [auth] = useAuth();
  const user = auth?.user;
  const { ref, showModal, closeModal } = useModal();
  const imageState = useSelectImage(user?.profilePicture || "");

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!imageState.image) throw new Error("Please select an image first");

      const uploadResp = await uploadImage(imageState.image);
      const imageUrl = uploadResp.data.url;

      const response = await apiClient.post("users/profile-picture", {
        profilePicture: imageUrl,
      });
      return { response: response.data, imageUrl };
    },
    onSuccess: (data) => {
      if (auth) {
        set_user_value({
          ...auth,
          user: { ...auth.user, profilePicture: data.imageUrl },
        });
      }

      toast.success("Profile picture updated successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile picture",
      );
    },
  });

  if (!user) return null;
  return (
    <div>
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <div className="avatar placeholder">
            <div className="w-20 md:w-24 rounded-full bg-linear-to-br from-cyan-400 to-cyan-500 text-white">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <span className="text-xl grid place-items-center size-full md:text-2xl">
                  {user?.firstName
                    ? user.firstName.charAt(0).toUpperCase()
                    : "U"}
                </span>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs md:text-sm"
            onClick={showModal}
          >
            Change Picture
          </Button>
        </div>
      </div>

      <Modal
        ref={ref}
        title="Update Profile Picture"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              disabled={updateProfileMutation.isPending || !imageState.image}
              onClick={() => updateProfileMutation.mutate()}
            >
              {updateProfileMutation.isPending
                ? "Uploading..."
                : "Save Changes"}
            </Button>
          </div>
        }
      >
        <ThemeProvider>
          <SelectImage {...imageState} title="Select New Image" />
        </ThemeProvider>
      </Modal>
    </div>
  );
}
