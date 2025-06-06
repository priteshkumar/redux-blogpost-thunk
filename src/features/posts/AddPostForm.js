import { useState } from "react";
import { useDispatch } from "react-redux";
//import { nanoid } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";

function AddPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const users = useSelector(selectAllUsers);
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === "idle";

  function handleTitleChanged(e) {
    setTitle(e.target.value);
  }

  function handleContentChanged(e) {
    setContent(e.target.value);
  }

  function handleUserChanged(e) {
    setUserId(e.target.value);
  }

  function savePost() {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost({ title, body: content, userId })).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
      } catch (err) {
        console.log("failed to save the post", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a new post</h2>
      <form className="postform">
        <div className="formcontrol">
          <label htmlFor="postAuthor">Author:</label>
          <br />
          <select id="postAuthor" value={userId} onChange={handleUserChanged}>
            <option value=""></option>
            {userOptions}
          </select>
        </div>
        <div className="formcontrol">
          <label htmlFor="postTitle">Post title:</label>
          <br />
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={title}
            onChange={handleTitleChanged}
          />
        </div>

        <div className="formcontrol">
          <label htmlFor="postContent">Post content:</label>
          <br />
          <textarea
            id="postContent"
            name="postContent"
            value={content}
            onChange={handleContentChanged}
            rows="4"
            cols="50"
          />
        </div>
        <button type="button" onClick={savePost}>
          Save Post
        </button>
      </form>
    </section>
  );
}

export default AddPostForm;
