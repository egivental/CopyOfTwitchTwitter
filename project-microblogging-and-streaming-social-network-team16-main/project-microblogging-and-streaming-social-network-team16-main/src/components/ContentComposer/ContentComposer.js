import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Card,
  Row,
  Col,
  Image,
  FormControl,
  Form,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { getMediaUrl } from "../../store/userState";

/**
 * @param {object} props The component's props.
 * @param {string} props.action The action of the content composer.
 * @param {string} props.title The title of the content composer.
 * @param {Function} props.createAction The create comment function.
 * @returns {ContentComposer} A ContentComposer React component.
 */
function ContentComposer({ action, title, createAction }) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [fileMimeType, setFileMimeType] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());
    dispatch(createAction(formData.message, file, fileMimeType));
    document.getElementById(`${action}-content-composer`).value = "";
    setFileName(null);
    setFile(null);
    setFileMimeType(null);
  };

  const onChange = (e) => {
    if (e.target.files.length > 0) {
      const formFile = e.target.files[0];
      if (formFile.size / 1024 / 1024 > 12) {
        alert("File cannot be larger than 12MB.");
        return;
      }
      setFileName(formFile.name);
      const reader = new FileReader();
      reader.readAsDataURL(formFile);
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
            "video/x-msvideo",
            "video/mp4",
            "video/mpeg",
            "video/ogg",
            "video/mp2t",
            "video/webm",
            "video/3gpp",
            "video/3gpp2",
            "audio/aac",
            "audio/midi",
            "audio/x-midi",
            "audio/mpeg",
            "audio/ogg",
            "audio/opus",
            "audio/wav",
            "audio/webm",
            "audio/3gpp",
            "audio/3gpp2",
          ].includes(mimeType)
        ) {
          alert("You can only upload image/video/audio files.");
          setFileName(null);
          setFileMimeType(null);
          setFile(null);
          return;
        }
        const base64Encoded = result.split(";base64,")[1];
        setFileMimeType(mimeType);
        setFile(base64Encoded);
      };
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Row>
          <Col md="auto">
            <Image
              width={80}
              height={80}
              alt="80x80"
              className="m-3"
              src={
                userState.user && userState.user.photo
                  ? getMediaUrl(userState.user.photo)
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
            />
          </Col>
          <Col>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Form style={{ marginTop: "20px" }} onSubmit={handleSubmit}>
                <Form.Group>
                  <FormControl
                    as="textarea"
                    name="message"
                    id={`${action}-content-composer`}
                  />
                </Form.Group>
                <Form.Group controlId="formPhoto">
                  <Form.File
                    id="file"
                    label={fileName || "Upload an attachment..."}
                    custom
                    onChange={onChange}
                  />
                  <Form.Text className="text-muted">Upload a file.</Form.Text>
                </Form.Group>
                <Form.Group>
                  <Button variant="primary" size="sm" type="submit">
                    {action}
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default ContentComposer;

ContentComposer.propTypes = {
  action: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createAction: PropTypes.func.isRequired,
};
