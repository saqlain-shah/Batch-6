/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
// import { data } from "./RoomData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const Navigate = useNavigate();
  const [roomList, setroomList] = useState([]);
  const [id, setId] = useState("");
  const [roomData, setroomData] = useState({
    title: "",
    price: "",
    maxPeople: "",
    desc: "",
  });

  const resetForm = () => {
    setroomData({
      title: "",
      price: "",
      maxPeople: "",
      desc: "",
      hotelId: "", // Reset the hotelId field as well
    });
  };

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "checkbox" ? event.target.checked : value;
    setroomData({ ...roomData, [name]: newValue });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const fetchroomData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/room"

      );
      setroomList(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalClose = async () => {
    const { hotelId } = roomData; // Destructure hotelId from roomData

    if (id === "") {
      // If id is empty, it means we are creating a new room
      try {
        // Add hotelId to the roomData object
        const dataWithHotelId = { ...roomData };
        
        // Make a POST request to create a new room
        await axios.post(`http://localhost:8000/api/room/${hotelId}`, dataWithHotelId);
        
        // Reset the form fields and close the modal
             resetForm();
        setIsModalOpen(false);
      } catch (error) {
        // Handle any errors that occur during the POST request
        console.error("Error creating new room:", error);
      }
    } else {
      // If id is not empty, it means we are updating an existing room
      handleUpdate(id);
    }
  };

  
  const handleUpdate = async (id) => {
    try {
      console.log("id", id);

      await axios
        .put(`http://localhost:8000/api/room/${id}`, roomData)
        .then(() => {
          resetForm();
          setId("");
          setIsModalOpen(false);
        });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id, hotelId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the room?");
      if (confirmDelete) {
        // Send DELETE request to delete the room
        await axios.delete(`http://localhost:8000/api/room/${id}/${hotelId}`);
        console.log("Room with ID", id, "in hotel with ID", hotelId, "deleted successfully.");
        
        // Update local state to remove the deleted room
        setroomList(prevRoomList => prevRoomList.filter(room => room._id !== id));
      }
    } catch (error) {
      // Log any errors that occur during the delete request
      console.error("Error deleting room:", error);
    }
  };
  
  
  
  
  
  

  useEffect(() => {
    fetchroomData();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "Room",
        header: "Room",
        columns: [
          {
            accessorKey:"title",
            id: "title",
            header: "title",
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
                  src={row.original.photos[0]}
                  loading="lazy"
                  style={{ border: "2px solid teal", borderRadius: "5px" }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "price",
            header: "price",
            size: 150,
          },
          {
            accessorKey: "maxPeople",
            header: "maxPeople",
            size: 150,
          },
         {
            accessorKey: "desc",
            header: "desc",
            size: 150,
          },
        
         
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: roomList,
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
          maxWidth: "100%",
        }}
      >
        <img
          alt="avatar"
          src={row.original.photos[0]}
          loading="lazy"
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "2px solid teal",
            borderRadius: "5px",
            marginBottom: "16px",
          }}
        />
        <Typography variant="h5" sx={{ marginBottom: "8px" }}>
          {row.original.title}
        </Typography>
        <Typography variant="body1">{row.original.desc}</Typography>
      </Box>
    ),

    renderRowActionMenuItems: (params) => [
      <MenuItem
        key="view"
        onClick={() => {
          Navigate(`/room/${params.row.original._id}`);
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
          setroomData(
            roomList.find((item) => item._id === params.row.original._id)
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
        handleDelete(params.row.original._id, params.row.original.hotelId);
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
      <Box mb={2} textAlign="right">
        <Button variant="contained" color="primary" onClick={handleModalOpen}>
          ADD NEW+
        </Button>
      </Box>
      <MaterialReactTable table={table} />

      {/* New Room Form */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
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
            <Typography variant="h5">Add New room</Typography>
            <TextField
              variant="standard"
              label="Ttile"
              fullWidth
              margin="normal"
              name="title"
              value={roomData.title}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Price"
              fullWidth
              margin="normal"
              name="price"
              value={roomData.price}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="maxPeople"
              fullWidth
              margin="normal"
              name="maxPeople"
              value={roomData.maxPeople}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Description"
              fullWidth
              margin="normal"
              name="desc"
              value={roomData.desc}
              onChange={handleChange}
            />
            
            {/* Other fields */}
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
                  resetForm();
                  setIsModalOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalClose}
              >
                {id === "" ? "Add room" : "Update room"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Room;