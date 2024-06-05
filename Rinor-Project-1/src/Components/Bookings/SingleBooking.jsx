import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleBooking = () => {
  const [bookingData, setBookingData] = useState({
    name: "",
    contact: "",
    fromDate: "",
    toDate: "",
    hotelId: "",
  });

  const [hotelData, setHotelData] = useState({
    name: "",
    type: "",
    city: "",
    address: "",
    rating: 0,
    cheapestPrice: 0,
    featured: false,
    title: "",
    desc: "",
  });

  const params = useParams();

  const fetchBookingData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/booking/${params.id}`
      );
      setBookingData(res.data.booking);
      fetchHotelData(res.data.booking.hotelId); // Fetch hotel data after booking data is fetched
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchHotelData = async (hotelId) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/hotels/search/${hotelId}`
      );
      setHotelData(res.data);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {hotelData.name}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {hotelData.city}
          </Typography>
          <Typography variant="body2" component="p">
            Type: {hotelData.type}
          </Typography>
          <Typography variant="body2" component="p">
            Address: {hotelData.address}
          </Typography>
          <Typography variant="body2" component="p">
            Rating: {hotelData.rating}
          </Typography>
          <Typography variant="body2" component="p">
            Cheapest Price: {hotelData.cheapestPrice}
          </Typography>
          <Typography variant="body2" component="p">
            Featured: {hotelData.featured ? "Yes" : "No"}
          </Typography>
          <Typography variant="body2" component="p">
            Title: {hotelData.title}
          </Typography>
          <Typography variant="body2" component="p">
            Description: {hotelData.desc}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ marginTop: 2 }}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Name: {bookingData.name}
          </Typography>
          <Typography variant="body2" component="p">
            Contact: {bookingData.contact}
          </Typography>
          <Typography variant="body2" component="p">
            From Date: {bookingData.fromDate}
          </Typography>
          <Typography variant="body2" component="p">
            To Date: {bookingData.toDate}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SingleBooking;
