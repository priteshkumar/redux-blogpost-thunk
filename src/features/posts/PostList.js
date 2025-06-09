import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from "./postsSlice";
import PostExcerpt from "./PostExcerpt";

function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (postsStatus === "idle") {
      console.log("dispatch fetchposts");
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  console.log("render postlist");
  
  let content;
  if (postsStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postsStatus === "succeeded") {
    console.log("sort posts");
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    /*for (let i = 0; i < orderedPosts.length; i++) {
      console.log("ordered post id: ", orderedPosts[i].id);
    }*/
    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ));
  } else if (postsStatus === "failed") {
    content = <p>{error}</p>;
  }
  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
}

export default PostList;
