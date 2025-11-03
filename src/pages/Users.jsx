import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { admin } from "../api";

const allowedStatuses = ["active", "blocked", "married", "muted", "pending"];
const allowedRoles = ["user", "admin", "superadmin"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const filterStatus = queryParams.get("status");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await admin.getUsers();
      const userList = res?.data || res?.data?.data || [];
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((u) => u.status === filterStatus);
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower) ||
          u.role?.toLowerCase().includes(lower) ||
          u.status?.toLowerCase().includes(lower) ||
          u?.basic_information?.gender?.toLowerCase().includes(lower) ||
          u.phoneNo?.toLowerCase?.()?.includes(lower) // ✅ Added phone to search
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, users, filterStatus]);

  const getRowColor = (status) => {
    switch (status) {
      case "active":
        return "#d4edda";
      case "blocked":
        return "#f8d7da";
      case "pending":
        return "#fff3cd";
      case "muted":
        return "#e2e3e5";
      case "married":
        return "#d1ecf1";
      default:
        return "white";
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingId(userId);
      await admin.updateUserStatus(userId, { status: newStatus });
      alert("Status updated successfully");
      fetchUsers();
    } catch (error) {
      alert(error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await admin.updateUserRole(userId, { role: newRole });
      alert("Role updated successfully");
      fetchUsers();
    } catch (error) {
      alert(error || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <h3>Loading users...</h3>;

  return (
    <div>
      <h1>
        Users {filterStatus && filterStatus !== "all" && `(${filterStatus})`}
      </h1>

      {/* ✅ Search Input */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search by name, email, gender, phone, role, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        />
      </div>

      <table
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ background: "#00BFFF", color: "#fff" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone</th> {/* ✅ Added phone column */}
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length ? (
            filteredUsers.map((u) => (
              <tr
                key={u._id}
                style={{
                  backgroundColor: getRowColor(u.status),
                  cursor: "pointer",
                }}
              >
                <td onClick={() => navigate(`/users/${u._id}`)}>
                  {u.fullName || "N/A"}
                </td>
                <td>{u.email || "N/A"}</td>
                <td>{u?.basic_information?.gender || "N/A"}</td>
                <td>{u.phoneNo || "N/A"}</td>
                <td>
                  <select
                    value={u.role}
                    disabled={updatingId === u._id}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  >
                    {allowedRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={u.status}
                    disabled={updatingId === u._id}
                    onChange={(e) => handleStatusChange(u._id, e.target.value)}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {updatingId === u._id ? (
                    <span style={{ color: "gray" }}>Updating...</span>
                  ) : (
                    <button
                      style={{
                        background: "red",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => alert(`Delete feature coming soon`)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
