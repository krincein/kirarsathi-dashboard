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
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
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
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography>Loading user details...</Typography>
      </Box>
    );

  if (!user)
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">User not found</Typography>
      </Box>
    );

  const {
    _id,
    fullName,
    email,
    phoneNo,
    role,
    status,
    onboarding,
    images,
    basic_information,
    education_occupation,
    family_contact_address,
    partner_preference,
    hobbies_interests_skills,
    likes,
    shortListed,
    pendingShortlistRequests,
    sendShortlistRequests,
    createdAt,
    updatedAt,
  } = user;

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const placeholderImages = Array(5).fill(
    "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
  );

  // Table renderer helper
  const renderTable = (data) => (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Table size="small">
        <TableBody>
          {Object.entries(data || {}).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell
                sx={{ fontWeight: 600, textTransform: "capitalize", width: "35%" }}
              >
                {formatLabel(key)}
              </TableCell>
              <TableCell sx={{ color: "#444" }}>
                {value !== undefined && value !== "" ? String(value) : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back to Users
      </Button>

      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={3}>
          {/* LEFT PROFILE SUMMARY */}
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar
                src={images?.profileUrl || defaultAvatar}
                alt={fullName}
                sx={{
                  width: 180,
                  height: 180,
                  mx: "auto",
                  mb: 2,
                  border: "2px solid #ddd",
                }}
              />
              <Typography variant="h5">{fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {email || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {phoneNo || "N/A"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2">
                <b>Role:</b> {role}
              </Typography>
              <Typography variant="subtitle2">
                <b>Status:</b> {status}
              </Typography>
              <Typography variant="subtitle2">
                <b>Onboarding:</b> {onboarding?.status} (Step {onboarding?.step})
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" display="block">
                <b>ID:</b> {_id}
              </Typography>
              <Typography variant="caption" display="block">
                <b>Created:</b> {new Date(createdAt).toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block">
                <b>Updated:</b> {new Date(updatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT DETAILED SECTIONS */}
          <Grid item xs={12} md={8} >
            <Section title="Basic Information">{renderTable(basic_information)}</Section>
            <Section title="Education & Occupation">
              {renderTable(education_occupation)}
            </Section>

            <Section title="Family / Contact / Address">
              {family_contact_address?.familyMembers &&
                renderTable(family_contact_address.familyMembers)}

              {family_contact_address?.addressDetails && (
                <Typography sx={{ mb: 1 }}>
                  <b>Address:</b> {family_contact_address.addressDetails}
                </Typography>
              )}

              {family_contact_address?.contactDetails?.length > 0 && (
                <>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    Contact Details:
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableBody>
                        {family_contact_address.contactDetails.map((c, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {c.name} ({c.relationship})
                            </TableCell>
                            <TableCell>{c.phoneNo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Section>

            <Section title="Partner Preferences">
              {renderTable(partner_preference)}
            </Section>

            <Section title="Hobbies / Interests / Skills">
              {renderTable(hobbies_interests_skills)}
            </Section>

            <Section title="Social Connections">
              {renderTable({
                "Likes Count": likes?.length || 0,
                "Shortlisted Users": shortListed?.length || 0,
                "Pending Shortlist Requests": pendingShortlistRequests?.length || 0,
                "Sent Shortlist Requests": sendShortlistRequests?.length || 0,
              })}
            </Section>
          </Grid>
        </Grid>

        {/* GALLERY */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Photo Gallery
          </Typography>
          <ImageList cols={4} gap={12}>
            {(images?.imageCollectionUrls?.length
              ? images.imageCollectionUrls
              : placeholderImages
            ).map((imgUrl, index) => (
              <ImageListItem key={index}>
                <img
                  src={imgUrl}
                  alt={`User Image ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Card>
    </Box>
  );
}

/* Helper Components */
const Section = ({ title, children }) => (
  <Box mb={3}>
    <Typography
      variant="subtitle1"
      gutterBottom
      sx={{
        mt: 3,
        fontWeight: 700,
        color: "#333",
        borderBottom: "2px solid #eee",
        pb: 0.5,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
