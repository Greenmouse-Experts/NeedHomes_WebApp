import { useAuth } from "@/store/authStore";
import { Link } from "@tanstack/react-router";

export default function ProfileCard() {
  const [user] = useAuth();

  const handleLinkClick = () => {
    // Add any desired link click handling here
  };

  return (
    <div className="bg-white rounded-xl p-4 text-center">
      <div className="avatar placeholder mx-auto mb-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xl">
          {user?.user.profilePicture ? (
            <img
              src={user.user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-xl text-white bg-transparent">
              {user?.user.firstName
                ? user.user.firstName.charAt(0).toUpperCase()
                : "U"}
            </span>
          )}
        </div>
      </div>
      <h3 className="text-gray-900 font-bold text-sm mb-1">Profile</h3>
      <p className="text-gray-500 text-xs mb-3">
        {user?.user.firstName && user?.user.lastName
          ? `${user.user.firstName} ${user.user.lastName}`
          : "John Doe"}
      </p>
      <Link
        to="/investors/settings"
        onClick={handleLinkClick}
        className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors block"
      >
        Profile
      </Link>
    </div>
  );
}
