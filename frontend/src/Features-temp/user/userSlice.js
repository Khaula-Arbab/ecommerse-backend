
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// create API
export const register = createAsyncThunk('user/register', async(userData, {rejectWithValue}) => {

   try{
     const config ={
       headers:{
         'Content-Type': 'multipart/form-data'
       }
     } 
    const {data} =  await axios.post('/api/v1/register',userData, config);
    console.log("UserData being sent:", userData);
   return data;



  }catch(error){
      return rejectWithValue(error.response?.data || "Registration failed. Please try again later.");
   }
})

// login
export const login = createAsyncThunk('user/login', async({email, password}, {rejectWithValue}) => {
  try{
    const  config = {
      headers:{
        'Content-Type': 'application/json'
      }
    }
    const {data} = await axios.post('/api/v1/login', {email, password}, config);
    return data;
  }catch(error){
    return rejectWithValue(error.response?.data || "Login failed. Please try again later.");
  }
})

// load user
export const loadUser = createAsyncThunk('user/loadUser', async(_, {rejectWithValue}) => {
  try{
    const {data} = await axios.get('/api/v1/profile');
    return data;
  }catch(error){
    return rejectWithValue(error.response?.data || "Could not load user. Please try again later.");
  }
}) 
// logout
export const logout = createAsyncThunk('user/logout', async(_, {rejectWithValue}) => {
  try{
    const {data} = await axios.post('/api/v1/logout',{withCredentials: true});
    return data;
  }catch(error){
    return rejectWithValue(error.response?.data || "Logout failed. Please try again later.");
  }
})

const userSlice = createSlice({
  name: 'user',

  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false
  },
  reducers: {
    
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers:(builder) => {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.success = action.payload.success;
      state.isAuthenticated = Boolean(action.payload?.user);
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Registration failed. Please try again later.";
      state.user = null;
      state.isAuthenticated = false;
    });
  //  login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.success = action.payload.success;
      state.isAuthenticated = Boolean(action.payload?.user);
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Login failed. Please try again later.";
      state.user = null;
      state.isAuthenticated = false;
    });

    // load user
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.isAuthenticated = Boolean(action.payload?.user);
      state.error = null;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Could not load user. Please try again later.";
      state.user = null;
      state.isAuthenticated = false;
    });

    // logout user
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Logout failed. Please try again later.";
     
    });
  }
})

export const {removeSuccess, removeErrors}=userSlice.actions;
export default userSlice.reducer;