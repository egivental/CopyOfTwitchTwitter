import _ from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Row, Col, Image, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";
import { getMediaUrl } from "../../store/userState";

/**
 * @param {object} props The component's props.
 * @param {Array} props.comments The comments to display
 * @param {Function} props.createAction The create comment function.
 * @param {Function} props.updateAction The update comment function.
 * @param {Function} props.deleteAction The delete comment function.
 * @param {string} props.parent The name of the parent property.
 * @returns {Comments} A Comments React component.
 */
function Comments({
  comments,
  parent,
  createAction,
  updateAction,
  deleteAction,
}) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [currentlyEditing, setCurrentlyEditing] = useState(new Set());

  return (
    <div>
      <h5>Comments</h5>
      <hr />
      <Row>
        <Col xs={1} />
        <Col>
          {_.clone(comments)
            .sort((c1, c2) => c1.date < c2.date)
            .map((comment) => (
              <Card
                className="mb-4"
                style={{ fontSize: "12px" }}
                key={comment.id}
              >
                <Row>
                  <Col md="auto">
                    <Image
                      width={40}
                      height={40}
                      alt="40x40"
                      className="m-3"
                      src={
                        comment.photo
                          ? getMediaUrl(comment.photo)
                          : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                      }
                    />
                  </Col>
                  <Col>
                    <Card.Body>
                      <Card.Title style={{ fontSize: "14px" }}>
                        @{comment.user}
                      </Card.Title>
                      <Row>
                        <Col>
                          {!currentlyEditing.has(comment.id) ? (
                            <Card.Text>{comment.message}</Card.Text>
                          ) : null}
                          {currentlyEditing.has(comment.id) ? (
                            <FormControl
                              as="textarea"
                              id={`${parent}-comment-${comment.id}`}
                            />
                          ) : null}
                        </Col>
                        {userState.user.username === comment.user ? (
                          <Col md="auto">
                            {!currentlyEditing.has(comment.id) ? (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                  setCurrentlyEditing(
                                    new Set(currentlyEditing.add(comment.id))
                                  );
                                  setTimeout(() => {
                                    document.getElementById(
                                      `${parent}-comment-${comment.id}`
                                    ).value = comment.message;
                                  }, 1);
                                }}
                              >
                                Edit
                              </Button>
                            ) : null}
                            {currentlyEditing.has(comment.id) ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  currentlyEditing.delete(comment.id);
                                  setCurrentlyEditing(
                                    new Set(currentlyEditing)
                                  );
                                  dispatch(
                                    updateAction(
                                      parent,
                                      comment.id,
                                      document.getElementById(
                                        `${parent}-comment-${comment.id}`
                                      ).value
                                    )
                                  );
                                }}
                              >
                                Submit
                              </Button>
                            ) : null}
                            <Button
                              variant="outline-danger"
                              className="ml-2 mr-2"
                              size="sm"
                              onClick={() =>
                                dispatch(deleteAction(parent, comment.id))
                              }
                            >
                              Delete
                            </Button>
                          </Col>
                        ) : null}
                      </Row>
                    </Card.Body>
                  </Col>
                </Row>
                <Card.Footer className="text-muted">
                  <Row>
                    <Col>{moment.unix(comment.date / 1000).fromNow()}</Col>
                  </Row>
                </Card.Footer>
              </Card>
            ))}
          <Card className="mb-4" style={{ fontSize: "12px" }}>
            <Row>
              <Col md="auto">
                <Image
                  width={40}
                  height={40}
                  alt="40x40"
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
                  <Card.Title style={{ fontSize: "14px" }}>
                    Create a new Comment
                  </Card.Title>
                  <Row>
                    <Col>
                      <FormControl as="textarea" id={`${parent}-comment-new`} />
                    </Col>
                    <Col md="auto">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          dispatch(
                            createAction(
                              parent,
                              document.getElementById(`${parent}-comment-new`)
                                .value
                            )
                          );
                          document.getElementById(
                            `${parent}-comment-new`
                          ).value = "";
                        }}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Comments;

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  parent: PropTypes.string.isRequired,
  createAction: PropTypes.func.isRequired,
  updateAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
};
