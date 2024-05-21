import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Rooms from "../Rooms/Rooms";

const SingleHotel = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    rating: 0,
    cheapestPrice: 0,
    featured: "",
    title: "",
    desc: "",
  });
  const params = useParams();
  const fetchHotelData = async (params) => {
    try {
      await axios
        .get(`http://localhost:8000/api/hotels/search/${params.id}`)
        .then((res) => {
          setData(res.data);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchHotelData(params);
  });
  return (
    <>
      <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {data.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {data.city}
          </Typography>
          <Typography variant="body2" component="p">
            Type: {data.type}
          </Typography>
          <Typography variant="body2" component="p">
            Address: {data.address}
          </Typography>
          <Typography variant="body2" component="p">
            Rating: {data.rating}
          </Typography>
          <Typography variant="body2" component="p">
            Cheapest Price: {data.cheapestPrice}
          </Typography>
          <Typography variant="body2" component="p">
            Featured: {data.featured ? "Yes" : "No"}
          </Typography>
          <Typography variant="body2" component="p">
            Title: {data.title}
          </Typography>
          <Typography variant="body2" component="p">
            Description: {data.desc}
          </Typography>

          <Box textAlign="right">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                Navigate(`/hotels`);
              }}
            >
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>
      </Box>
      <Rooms/>
    </>
  );
};

export default SingleHotel;
