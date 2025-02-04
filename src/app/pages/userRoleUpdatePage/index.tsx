import { useState } from "react";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import "./userRoleUpdate.css";

const UserEdit = ({
  user,
  setSelectUser,
}: {
  user: any;
  setSelectUser: any;
}) => {
  const { email } = user;
  const [role, setRole] = useState(user.role);
  const updateUser = useUpdateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate({ id: user.id, data: { email, role } });
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit-form">
      <label>Email:</label>
      <div className="user-email-display">{email}</div>

      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Update</button>
      <button type="button" onClick={() => setSelectUser(null)}>
        back
      </button>
    </form>
  );
};

export default UserEdit;
