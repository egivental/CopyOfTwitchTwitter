import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import moment from "moment";
import {
  createPost,
  getPosts,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
} from "../../store/postState";
import { getMediaUrl } from "../../store/userState";
import Comments from "../../components/Comments/Comments";
import ContentComposer from "../../components/ContentComposer/ContentComposer";

/**
 * @returns {PostsView} A PostsView React component.
 */
function PostsView() {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.post);
  const userState = useSelector((state) => state.user);
  const [filter, setFilter] = useState("");

  // Periodically update posts
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(getPosts());
    }, 1500);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  let { posts } = postState;

  // Only fetch posts if posts haven't been fetched yet (prevents an infinite loop)
  if (posts === null) {
    dispatch(getPosts());
    posts = [];
  }

  // Handle post deletion
  const handleDelete = async (id) => {
    await dispatch(deletePost(id));
  };

  // Render posts
  const displayPosts = posts
    .filter((post) => {
      if (filter.trim().length > 0) {
        const postText = post.message;
        const commentText = post.comments.map((c) => c.message).join("");
        return (
          postText.includes(`#${filter.trim()}`) ||
          commentText.includes(`#${filter.trim()}`)
        );
      }
      return true;
    })
    .map((post) => (
      <Card className="mb-4" key={post.id}>
        <Row>
          <Col md="auto">
            <Image
              width={80}
              height={80}
              alt="80x80"
              className="m-3"
              src={
                post.photo
                  ? getMediaUrl(post.photo)
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
            />
          </Col>
          <Col>
            <Card.Body>
              <Card.Title>@{post.user}</Card.Title>
              <Row>
                <Col>
                  <Card.Text>{post.message}</Card.Text>
                </Col>
                <Col md="auto">
                  <Button
                    variant="outline-danger"
                    className="ml-2 mr-2"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    {userState.user.username === post.user ? "Delete" : "Hide"}
                  </Button>
                </Col>
              </Row>
              {post.attachment_type && (
                <Row>
                  <Col
                    style={{
                      marginTop: "20px",
                      textAlign: "center",
                    }}
                  >
                    {post.attachment_type &&
                    post.attachment_type.startsWith("image") ? (
                      <img
                        src={getMediaUrl(post.attachment)}
                        alt={post.message}
                        style={{ maxWidth: "60%" }}
                      />
                    ) : null}
                    {post.attachment_type &&
                    post.attachment_type.startsWith("video") ? (
                      <video
                        src={getMediaUrl(post.attachment)}
                        style={{ maxWidth: "60%" }}
                        controls
                        autoPlay
                        loop
                      />
                    ) : null}
                    {post.attachment_type &&
                    post.attachment_type.startsWith("audio") ? (
                      <audio
                        src={getMediaUrl(post.attachment)}
                        style={{ maxWidth: "60%" }}
                        controls
                        loop
                      />
                    ) : null}
                  </Col>
                </Row>
              )}
              <br />
              <Comments
                comments={post.comments}
                parent={post.id}
                createAction={createComment}
                updateAction={updateComment}
                deleteAction={deleteComment}
              />
            </Card.Body>
          </Col>
        </Row>
        <Card.Footer className="text-muted">
          <Row>
            <Col>{moment.unix(post.date / 1000).fromNow()}</Col>
            <Col md="auto">
              {userState.user.username === post.user ? (
                <span>
                  <b>Hides: </b>
                  {post.analytics.hides}{" "}
                  <b style={{ marginLeft: "15px" }}>Comments: </b>
                  {post.analytics.comments}
                </span>
              ) : null}
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    ));

  // Render
  return (
    <div>
      <div id="title" style={{ marginBottom: "40px" }}>
        <h1>Posts</h1>
      </div>
      <ContentComposer
        action="Post"
        title="What is on your mind?"
        createAction={createPost}
      />
      <h5>Your Feed</h5>
      <hr />
      <div>
        <Row>
          <Col />
          <Col md={{ span: 4, offset: 0 }}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Filter by #</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="hashtag"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </div>
      <div>{displayPosts}</div>
      {displayPosts.length === 0 ? "No posts." : null}
    </div>
  );
}

export default PostsView;
