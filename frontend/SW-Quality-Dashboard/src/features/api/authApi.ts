import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './authSlice';
// see slack for more info
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers, { getState }: any) => {
        const { accessToken } = getState().auth;
        if (accessToken) {
            // api should be looking for both A-a
            headers.set('authorization', `Bearer ${accessToken}`);
        }
        return headers;
    },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        // send refresh token to get new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        console.info(refreshResult)
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            //some of these are api specific
            api.dispatch(setCredentials({ ...refreshResult.data, user }));
            // retry the initial request
            result = await baseQuery(args, api, extraOptions);
        } else {
            // if refresh token fails, log out
            api.dispatch(logOut());
        }
    }
    return result;
}

// export const apiSlice = createApi({
//     baseQuery: baseQueryWithReAuth,
//     endpoints: (builder) => ({})
// })
