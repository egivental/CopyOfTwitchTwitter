import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  updateUserProfile,
  deleteUser,
  getMediaUrl,
} from "../../store/userState";

/**
 * @returns {Profile} A Profile React component.
 */
function Profile() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [fileName, setFileName] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoMimeType, setPhotoMimeType] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    dispatch(
      updateUserProfile(
        userState.user.username,
        formData.password,
        photo,
        photoMimeType
      )
    );
  };

  const onChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const { result } = reader;
        const mimeType = result.split(";base64,")[0].replace("data:", "");
        if (
          ![
            "image/bmp",
            "image/gif",
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/tiff",
            "image/webp",
          ].includes(mimeType)
        ) {
          alert("You can only upload image files.");
          setFileName(null);
          setPhotoMimeType(null);
          setPhoto(null);
          return;
        }
        const base64Encoded = result.split(";base64,")[1];
        setPhotoMimeType(mimeType);
        setPhoto(base64Encoded);
      };
    }
  };

  const handleDeactivate = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("Are you sure you want to deactivate your account?")) {
      await dispatch(deleteUser(userState.user.username));
    }
  };

  let registrationDate;
  if (userState.user) {
    registrationDate = new Date(userState.user.registration_date).toString();
  } else {
    registrationDate = "";
  }

  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Profile</h1>
      </div>

      <Image
        src={
          userState.user && userState.user.photo
            ? getMediaUrl(userState.user.photo)
            : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        }
        width="100"
        height="100"
        rounded
      />

      <Form style={{ marginTop: "20px", width: "50%" }} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            value={userState.user ? userState.user.username : ""}
            disabled
          />
          <Form.Text className="text-muted">Your username.</Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter new password"
          />
          <Form.Text className="text-muted">Change your password.</Form.Text>
        </Form.Group>

        <Form.Group controlId="formPhoto">
          <Form.Label>Profile Photo</Form.Label>
          <Form.File
            id="photo"
            label={fileName || "Upload a photo..."}
            custom
            onChange={onChange}
          />
          <Form.Text className="text-muted">Upload a profile photo.</Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Profile
        </Button>
        <Button
          variant="danger"
          onClick={handleDeactivate}
          style={{ marginLeft: "15px" }}
        >
          Deactivate Account
        </Button>
        <Form.Text className="text-muted">
          Registered on {registrationDate}
        </Form.Text>
      </Form>
    </div>
  );
}

export default Profile;
