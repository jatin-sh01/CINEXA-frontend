import UserList from "../../components/admin/UserList";

export default function AdminUsers() {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600">Search and manage user roles and statuses.</p>
      </div>
      <UserList />
    </div>
  );
}
