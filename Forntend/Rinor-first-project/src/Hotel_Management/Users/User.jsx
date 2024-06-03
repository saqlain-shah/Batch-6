/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
// MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import {
  Box,
  ListItemIcon,
  MenuItem,
  Button,
  Modal,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

// Icons Imports
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Users Data
// import { data } from "./usersData";

const User = () => {
  const Navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [id, setId] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isAdmin: true,
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    const newValue =
      type === "checkbox"
        ? event.target.checked
        : type === "file"
        ? event.target.files[0]
        : value;
    setUserData({ ...userData, [name]: newValue });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleModalOpen = () => {
  //   setIsModalOpen(true);
  // };

  const fetchUsersData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/");
      console.log("data:", response.data);
      response.data.users.map(
        (user) => (user.photo = `http://localhost:8000/${user.photo}`)
      );
      setUserList(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (id) {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      await axios.put(`http://localhost:8000/api/users/${id}`, formData);
    }

    setIsModalOpen(false);
  };

  const handleUpdate = async (id) => {
    try {
      console.log("id", id);
      await axios
        .put(`http://localhost:8000/api/users/${id}`, userData)
        .then(() => {
          setId("");
          setIsModalOpen(false);
        });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  let handleDelete = async (id) => {
    // console.log("id", id);
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete the data?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:8000/api/users/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "Users-Identities",
        header: "Users-Identities",
        columns: [
          {
            accessorKey:"firstName",
           
            id: "firstName",
          
            header: "First-Name",
            size: 200,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  alt="avatar"
                  height={50}
                  src={row.original.photo}
                  loading="lazy"
                  style={{ border: "2px solid teal", borderRadius: "5px" }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "lastName",
            header: "last-Name",
            size: 150,
          },
          {
            accessorKey: "email",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            header: "Email",
            size:150,
          },
          {
            accessorKey: "isAdmin",
            // accessorFn: (row) => (row.isAdmin ? "Yes" : "No"),
            header: "IsAdmin",
            size: 50,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor: cell.getValue()
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  color: "#fff",
                  borderRadius: "0.25rem",
                  padding: "0.25rem",
                  fontWeight: "bold",
                })}
              >
                {cell.getValue() ? "Yes" : "No"}
              </Box>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: userList,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 15, 20, 25, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "16px",
          textAlign: "center",
          maxWidth: "40%",
        }}
      >
        <img
          alt="avatar"
          src={row.original.photo}
          loading="lazy"
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "2px solid teal",
            borderRadius: "5px",
            marginBottom: "16px",
            marginLeft: "10%",
          }}
        />
      </Box>
    ),
    renderRowActionMenuItems: (params) => [
      <MenuItem
        key="view"
        onClick={() => {
          Navigate(`/user/${params.row.original._id}`);
          params.closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Visibility />
        </ListItemIcon>
        View
      </MenuItem>,

      <MenuItem
        key="edit"
        onClick={() => {
          setUserData(
            userList.find((item) => item._id === params.row.original._id)
          );
          setId(params.row.original._id);
          setIsModalOpen(true);

          params.closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>,

      <MenuItem
        key="delete"
        onClick={() => {
          handleDelete(params.row.original._id);
          params.closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Delete
      </MenuItem>,
    ],
  });

  return (
    <>
      <MaterialReactTable table={table} />;{/* User Form */}
      <Modal open={isModalOpen} onClose={handleUpdateUser}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
          }}
        >
          <form>
            <Typography variant="h5">Update User</Typography>
            <TextField
              variant="standard"
              label="First Name"
              fullWidth
              margin="normal"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Last Name"
              fullWidth
              margin="normal"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />

            <TextField
              variant="standard"
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />

            <input
              style={{ display: "block" }}
              type="file"
              name="photos"
              onChange={handleChange}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={userData.isAdmin}
                  onChange={handleChange}
                  name="isAdmin"
                />
              }
              label="Yes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!userData.isAdmin}
                  onChange={(e) =>
                    handleChange({
                      ...e,
                      target: { name: "isAdmin", value: !userData.isAdmin },
                    })
                  }
                  name="isAdmin"
                />
              }
              label="No"
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateUser}
              >
                Update User
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};
export default User;
