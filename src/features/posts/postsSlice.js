import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

/*const initialState = [
  {
    id: "1",
    title: "Learning redux toolkit",
    content: "I have heard good things",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsup: 0,
      heart: 0,
    },
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, more i want pizza",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsup: 0,
      heart: 0,
    },
  },
];*/

const initialState = {
  posts: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    try {
      console.log("call api");
      const response = await axios.get(POSTS_URL);
      return [...response.data];
    } catch (err) {
      return err.message;
    }
  },
  {
    condition(arg, thunkApi) {
      const postsStatus = getPostsStatus(thunkApi.getState());
      if (postsStatus !== "idle") {
        console.log("return false thunk");
        return false;
      }
    },
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsup: 0,
              heart: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          //console.log("postid: ", post.id);
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsup: 0,
            heart: 0,
          };
          return post;
        });
        //state.posts = state.posts.concat(loadedPosts);
        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsup: 0,
          heart: 0,
        };
        state.posts.push(action.payload);
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const { postAdded, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;
