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

  // ✅ new modal-related states
  const [showModal, setShowModal] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnerList, setPartnerList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const filterStatus = queryParams.get("status");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await admin.getUsers();
      const userList = res?.data || res?.data?.data || [];
      setUsers(userList);
      setFilteredUsers(userList);
      setPartnerList(userList);
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
          u.phoneNo?.toLowerCase?.()?.includes(lower)
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

  // ✅ open modal instead of prompt
  const handleMarriedWith = (userId) => {
    setActiveUserId(userId);
    setPartnerSearch("");
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleSelectPartner = (user) => {
    setSelectedUser(user);
  };

  const confirmMarriage = async () => {
    if (!selectedUser) {
      alert("Please select a partner to proceed!");
      return;
    }

    try {
      setUpdatingId(activeUserId);
      await admin.updateUserStatus({
        userId: activeUserId,
        status: "married",
        marriedWith: selectedUser._id,
      });
      alert("Marriage linked successfully!");
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to link marriage.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <h3>Loading users...</h3>;

  // ✅ Filter partner list dynamically by search
  const filteredPartnerList = partnerList.filter(
    (u) =>
      u._id !== activeUserId &&
      u.fullName?.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  return (
    <div>
      <h1>
        Users {filterStatus && filterStatus !== "all" && `(${filterStatus})`}
      </h1>

      {/* Search Input */}
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
            <th>Phone</th>
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
                <td>{`+91 ${u.phoneNo}` || "N/A"}</td>
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
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      if (newStatus === "married") {
                        handleMarriedWith(u._id);
                      } else {
                        handleStatusChange(u._id, newStatus);
                      }
                    }}
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
                      onClick={() => alert("Delete feature coming soon")}
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

      {/* ✅ Marriage Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `rgba(${colors.rowDefault.r}, ${colors.rowDefault.g}, ${colors.rowDefault.b}, 0.5)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: colors.modalContent,
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: `rgba(${colors.rowDefault.r}, ${colors.rowDefault.g}, ${colors.rowDefault.b}, 0)`,
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ❌
            </button>

            <h3>Select a partner</h3>
            <input
              type="text"
              placeholder="Search partner by name..."
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: `1px solid ${colors.inputBorder}`,
                marginBottom: "10px",
              }}
            />

            <ul style={{ listStyle: "none", padding: 0 }}>
              {filteredPartnerList.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleSelectPartner(user)}
                  style={{
                    padding: "8px",
                    marginBottom: "5px",
                    borderRadius: "6px",
                    background:
                      selectedUser?._id === user._id ? "#00BFFF" : "#f4f4f4",
                    color: selectedUser?._id === user._id ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  {user.fullName} — {user.email}
                </li>
              ))}
            </ul>

            <button
              onClick={confirmMarriage}
              style={{
                width: "100%",
                padding: "10px",
                background: colors.primary,
                color: colors.tableHeaderText,
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Confirm Marriage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
