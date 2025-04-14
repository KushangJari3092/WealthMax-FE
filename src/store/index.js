import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import stockDetailReducer from "./slices/detailsBySymbol";
import userReducer from "./slices/userSlice";
import bankReducer from "./slices/bankSlice";
import watchlistReducer from "./slices/watchListSlice";
import ordersReducer from "./slices/ordersSlice";
import reportsReducer from "./slices/reportsSlice";
import commonReducer from "./slices/commonSlice";

const store = configureStore({
  reducer: {
    common: commonReducer,
    auth: authReducer,
    stockDetail: stockDetailReducer,
    user: userReducer,
    bank: bankReducer,
    watchlist: watchlistReducer,
    orders: ordersReducer,
    reports: reportsReducer,
  },
});

export default store;
