import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userUid: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userUid = action.payload;
        },
    }
})

export const { setUser } = userSlice.actions;

export default userSlice.reducer;