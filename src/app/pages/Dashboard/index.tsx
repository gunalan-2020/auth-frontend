import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import UserEdit from "../userRoleUpdatePage";

import "./userdata.css";
const Dashboard = () => {
  const [selectUser, setSelectUser] = useState(null);

  const { data: users, isLoading, isError } = useUsers();

  console.log("users", users);

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>user does not have access</p>;

  return selectUser !== null ? (
    <UserEdit
      key={selectUser?.id}
      user={selectUser}
      setSelectUser={setSelectUser}
    />
  ) : (
    <div className="container">
      <div>users details</div>
      {users?.map((userData) => (
        <div
          className="user-container"
          onClick={() => {
            setSelectUser(userData);
          }}
          key={userData.id}
        >
          <div>email: {userData.email}</div>
          <div>role: {userData.role}</div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
