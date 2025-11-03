import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Grid,
  Avatar,
  Button,
  ImageList,
  ImageListItem,
  CircularProgress,
} from "@mui/material";
import { main } from "../api/apiCall";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await main.getProfileById(id);
        setUser(res?.data);
        console.log(res)
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <p>Loading user details...</p>
      </div>
    );

  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>User not found</h3>
      </div>
    );

  const {
    fullName,
    email,
    phoneNo,
    role,
    status,
    images,
    basic_information,
    education_occupation,
    family_contact_address,
  } = user;

  return (
    <div>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back to Users
      </Button>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Avatar
              src={
                images?.profileUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={fullName}
              sx={{ width: 200, height: 200, mx: "auto", mb: 2 }}
            />
            <Typography variant="h5" textAlign="center">
              {fullName}
            </Typography>
            <Typography variant="body2" textAlign="center">
              {email}
            </Typography>
            <Typography variant="body2" textAlign="center">
              {phoneNo}
            </Typography>
            <Typography variant="subtitle1" textAlign="center" sx={{ mt: 1 }}>
              <strong>Role:</strong> {role}
            </Typography>
            <Typography variant="subtitle1" textAlign="center">
              <strong>Status:</strong> {status}
            </Typography>
          </Grid>

          {/* Information Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Typography>
              <b>Gender:</b> {basic_information?.gender}
            </Typography>
            <Typography>
              <b>Height:</b> {basic_information?.height}
            </Typography>
            <Typography>
              <b>Weight:</b> {basic_information?.weight}
            </Typography>
            <Typography>
              <b>Rashi:</b> {basic_information?.rashi}
            </Typography>
            <Typography>
              <b>Cast:</b> {basic_information?.cast}
            </Typography>
            <Typography>
              <b>About:</b>{" "}
              {basic_information?.aboutMySelf?.length
                ? basic_information?.aboutMySelf.join(", ")
                : "N/A"}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Education & Occupation
            </Typography>
            <Typography>
              <b>Education:</b> {education_occupation?.educationLevel}
            </Typography>
            <Typography>
              <b>Field:</b> {education_occupation?.educationField}
            </Typography>
            <Typography>
              <b>Occupation:</b> {education_occupation?.occupation}
            </Typography>
            <Typography>
              <b>Income:</b> {education_occupation?.income}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Family Information
            </Typography>
            <Typography>
              <b>Father:</b>{" "}
              {family_contact_address?.familyMembers?.fatherName || "N/A"}
            </Typography>
            <Typography>
              <b>Mother:</b>{" "}
              {family_contact_address?.familyMembers?.motherName || "N/A"}
            </Typography>
            <Typography>
              <b>Brothers:</b>{" "}
              {family_contact_address?.familyMembers?.noOfBrothers}
            </Typography>
            <Typography>
              <b>Sisters:</b>{" "}
              {family_contact_address?.familyMembers?.noOfSisters}
            </Typography>
          </Grid>
        </Grid>

        {/* ✅ Image Collection Section */}
        {images?.imageCollectionUrls?.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <Typography variant="h6" gutterBottom>
              Photo Gallery
            </Typography>

            <ImageList cols={4} gap={12}>
              {images.imageCollectionUrls.map((imgUrl, index) => (
                <ImageListItem key={index}>
                  <img
                    src={imgUrl}
                    alt={`User Image ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        )}
      </Card>
    </div>
  );
}
