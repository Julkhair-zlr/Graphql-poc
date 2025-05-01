import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function App() {
  const [newUser, setNewUser] = useState({});

  const {
    data: getUsersData,
    error: getUsersError,
    loading: getUsersLoading,
  } = useQuery(GET_USERS);
  const { data: getUserByIdData, loading: getUserByIdLoading } = useQuery(
    GET_USER_BY_ID,
    {
      variables: { id: newUser.id }, // use the selected user's id
      skip: !newUser.id, // skip the query if there's no id (i.e., if newUser.id is empty)
    }
  );

  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const UPDATE_USER = gql`
    mutation UpdateUser(
      $id: ID!
      $name: String
      $age: Int
      $isMarried: Boolean
    ) {
      updateUser(id: $id, name: $name, age: $age, isMarried: $isMarried) {
        id
        name
        age
        isMarried
      }
    }
  `;

  const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `;

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  if (getUsersLoading) return <p> Data loading...</p>;

  if (getUsersError) return <p> Error: {getUsersError.message}</p>;

  const handleCreateUser = async () => {
    console.log(newUser);
    const { id, name, age, isMarried } = newUser;

    if (!name || age === undefined || isMarried === undefined) return;

    if (id) {
      // Update
      await updateUser({
        variables: { id, name, age: Number(age), isMarried },
      });
    } else {
      // Create
      await createUser({
        variables: { name, age: Number(age), isMarried },
      });
    }
    setNewUser({});
  };

  const handleDeleteUser = async (id) => {
    await deleteUser({
      variables: { id },
    });
  };

  return (
    <>
      <div>
        <input
          placeholder="Name..."
          value={newUser.name ?? ""}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder="Age..."
          value={newUser.age ?? ""}
          type="number"
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: e.target.value }))
          }
        />
        <select
          value={newUser.isMarried ?? ""}
          onChange={(e) =>
            setNewUser((prev) => ({
              ...prev,
              isMarried: e.target.value === "true",
            }))
          }
        >
          <option value="">Select Marital Status</option>
          <option value="true">Married</option>
          <option value="false">Unmarried</option>
        </select>
        <button onClick={handleCreateUser}>
          {newUser.id ? "Update User" : "Create User"}
        </button>
      </div>

      {newUser.id && (
        <div>
          <h1>Chosen User:</h1>
          {getUserByIdLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{getUserByIdData.getUserById.name}</p>
              <p>{getUserByIdData.getUserById.age}</p>
              <p>
                {getUserByIdData.getUserById.isMarried
                  ? "Married"
                  : "Unmarried"}
              </p>
            </>
          )}
        </div>
      )}

      <h1> Users</h1>
      <div>
        {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Married: {user.isMarried ? "Yes" : "No"}</p>
            <button
              onClick={() =>
                setNewUser({
                  id: user.id,
                  name: user.name,
                  age: user.age,
                  isMarried: user.isMarried,
                })
              }
            >
              Edit
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
