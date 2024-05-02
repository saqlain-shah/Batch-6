import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleUser = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    isAdmin: true,
    photos: [],
  });
  const params = useParams();

  const fetchuserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/room/${params.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchuserData();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {`${userData.firstName} ${userData.lastName}`}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Username: {userData.username}
        </Typography>
        <Typography variant="body2" component="p">
          Email: {userData.email}
        </Typography>
        <Typography variant="body2" component="p">
          Admin: {userData.isAdmin ? "Yes" : "No"}
        </Typography>
        {/* Render photos if available */}
        {userData.photos && userData.photos.length > 0 && (
          <div>
            <Typography variant="h6" gutterBottom>
              Photos:
            </Typography>
            {userData.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Photo ${index}`} style={{ maxWidth: "100%", marginBottom: "8px" }} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SingleUser;
