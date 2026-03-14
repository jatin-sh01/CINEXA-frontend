import { useAuth } from "../../contexts/AuthContext";
import { capitalize } from "../../utils/format";
import ResetPasswordCard from "./ResetPasswordCard";

export default function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <div className="bg-gray-900 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-20 h-20 rounded-full bg-purple-600 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4">
          {user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <p className="text-white text-lg font-semibold">{user.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300">
          {capitalize(user.role)}
        </span>
      </div>
      <ResetPasswordCard />
    </div>
  );
}
