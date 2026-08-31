import { useAuth } from "../../contexts/AuthContext";
import { capitalize } from "../../utils/format";
import ResetPasswordCard from "./ResetPasswordCard";

export default function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-700 text-3xl font-bold flex items-center justify-center mx-auto mb-4">
          {user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <p className="text-gray-900 text-lg font-semibold">{user.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          {capitalize(user.role)}
        </span>
      </div>
      <ResetPasswordCard />
    </div>
  );
}
