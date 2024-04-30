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
// import { data } from "./HotelsData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Hotels = () => {
  const Navigate = useNavigate();
  const [hotelList, setHotelList] = useState([]);
  const [id, setId] = useState("");
  const [hotelData, setHotelData] = useState({
    name: "",
    city: "",
    address: "",
    distance: "",
    rating: "",
    cheapestPrice: "",
    featured: false,
    type: "",
    title: "",
    desc: "",
  });

  const resetForm = () => {
    setHotelData({
      name: "",
      city: "",
      address: "",
      distance: "",
      rating: "",
      cheapestPrice: "",
      featured: false,
      type: "",
      title: "",
      desc: "",
    });
  };
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "checkbox" ? event.target.checked : value;
    setHotelData({ ...hotelData, [name]: newValue });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const fetchHotelData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/hotel/hotels"
      );
      setHotelList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalClose = async () => {
    if (id === "") {
      //  const {id, ...data}=hotelData
      await axios.post("http://localhost:8000/api/hotel/", hotelData);

      resetForm();
      setIsModalOpen(false);
    } else {
      // console.log("id", id);
      handleUpdate(id);
    }
  };
  const handleUpdate = async (id) => {
    try {
      console.log("id", id);

      await axios
        .put(`http://localhost:8000/api/hotel/${id}`, hotelData)
        .then(() => {
          resetForm();
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
        await axios.delete(`http://localhost:8000/api/hotel/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHotelData();
  }, [hotelList]);

  const columns = useMemo(
    () => [
      {
        id: "hotels",
        header: "Hotels",
        columns: [
          {
            accessorFn: (row) => row.name,
            id: "name",
            header: "Name",
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
            accessorKey: "city",
            header: "City",
            size: 150,
          },
          {
            accessorKey: "address",
            header: "Address",
            size: 150,
          },
          // {
          //   accessorKey: "distance",
          //   header: "Distance",
          //   size: 150,
          // },
          {
            accessorKey: "rating",
            header: "Rating",
            size: 150,
          },
          {
            accessorKey: "cheapestPrice",
            header: "Cheapest Price ($)",
            size: 150,
          },
          // {
          //   accessorKey: "featured",
          //   header: "Featured",
          //   size: 150,
          // },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: hotelList,
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
          Navigate(`/hotel/${params.row.original._id}`);
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
          setHotelData(
            hotelList.find((item) => item._id === params.row.original._id)
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
      <Box mb={2} textAlign="right">
        <Button variant="contained" color="primary" onClick={handleModalOpen}>
          ADD NEW+
        </Button>
      </Box>
      <MaterialReactTable table={table} />

      {/* New Hotels Form */}
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
            <Typography variant="h5">Add New Hotel</Typography>
            <TextField
              variant="standard"
              label="Name"
              fullWidth
              margin="normal"
              name="name"
              value={hotelData.name}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="City"
              fullWidth
              margin="normal"
              name="city"
              value={hotelData.city}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Address"
              fullWidth
              margin="normal"
              name="address"
              value={hotelData.address}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Distance"
              fullWidth
              margin="normal"
              name="distance"
              value={hotelData.distance}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Rating"
              fullWidth
              margin="normal"
              name="rating"
              value={hotelData.rating}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Cheapest Price"
              fullWidth
              margin="normal"
              name="cheapestPrice"
              value={hotelData.cheapestPrice}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Featured"
              fullWidth
              margin="normal"
              name="featured"
              value={hotelData.featured}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Type"
              fullWidth
              margin="normal"
              name="type"
              value={hotelData.type}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Title"
              fullWidth
              margin="normal"
              name="title"
              value={hotelData.title}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              label="Description"
              fullWidth
              margin="normal"
              name="desc"
              value={hotelData.desc}
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
                {id === "" ? "Add Hotel" : "Update Hotel"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Hotels;