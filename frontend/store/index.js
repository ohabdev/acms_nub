import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authSlice from "@/store/slices/authSlice";
import appSlice from "@/store/slices/appSlice";
import utilsSlice from "@/store/slices/utilsSlice";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  app: appSlice,
  auth: authSlice,
  utils: utilsSlice,
});

const migrations = {
  1: (state) => {
    return {
      ...state,
    };
  },
  2: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        antTheme: {
          colorPrimary: "#007aff",
          colorSuccess: "#4cd964",
          colorError: "#ff3b30",
          colorWarning: "#faad14",
          colorInfo: "#5189f5",
          colorLink: "#1677ff",
          colorLinkActive: "#0958d9",
          colorLinkHover: "#69b1ff",
          borderRadius: 4,
        },
      },
    };
  },
  3: (state) => {
    return {
      ...state,
      app: {
        timeZone: "",
        loading: false,
      },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 3,
  storage,
  whitelist: ["app", "auth"],
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
