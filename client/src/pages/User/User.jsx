import { FaEdit, FaInfo, FaTrash, FaUserAlt, FaUserPlus } from "react-icons/fa";
import UserFormModal from "../../components/User/UserFormModal";
import withReactContent from "sweetalert2-react-content";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import DataTableBase from "../../utils/DataTable";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../../api/user";

const MySwal = withReactContent(Swal);

const User = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedUser) {
        const updatedUser = await updateUser(selectedUser.id, formData);
        toast.success("User updated successfully!");
        console.log(updatedUser);
        fetchUsers();
      } else {
        const newUser = await createUser(formData);
        console.log(newUser);
        toast.success("User created successfully!");
        fetchUsers();
      }
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDeleteUser = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(id);
        MySwal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleActive = async (user) => {
    try {
      const updatedUser = await updateUserStatus(user.id, !user.is_active);
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
      toast.success("User status updated successfully!");
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns = [
    {
      name: "#",
      cell: (row) => (
        <img
          src={`https://avatar.iran.liara.run/username?username=${row.username}`}
          alt="profile"
          className="rounded-circle"
          width="30"
        />
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: "Estado",
      cell: (row) => (
        <Form.Check
          type="switch"
          id={`is-active-switch-${row.id}`}
          checked={row.is_active}
          onChange={() => handleToggleActive(row)}
        />
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <a
            href="#"
            onClick={() => handleEditUser(row)}
            className="me-2 py-1 px-2 bg-primary-subtle rounded-3"
          >
            <FaEdit />
          </a>
          <a
            href="#"
            onClick={() => confirmDeleteUser(row.id)}
            className="me-2 py-1 px-2 bg-danger-subtle rounded-3"
          >
            <FaTrash />
          </a>
        </>
      ),
    },
  ];

  return (
    <Row className="p-4">
      <Col className="p-4 mb-4 bg-dark-subtle rounded-3" md={3}>
        <p className="fs-5 mb-4">
          <FaUserAlt className="me-2" />
          Users
        </p>

        <Alert variant="info" className="mb-4">
          <FaInfo className="me-2" />
          <strong>Info:</strong> Haz clic en un usuario para editar, eliminar o
          gestionar su información. Usa <b>Agregar Usuario</b> para crear uno nuevo.
        </Alert>

        <Button
          className="w-100 mb-3"
          size="sm"
          onClick={() => {
            setShowModal(true);
            setSelectedUser(null);
          }}
        >
          <FaUserPlus className="me-2" />
          Add User
        </Button>
      </Col>

      <Col className="px-4" md={9}>
        <DataTableBase columns={columns} data={users} SS />
      </Col>

      <UserFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedUser}
      />
    </Row>
  );
};

export default User;
