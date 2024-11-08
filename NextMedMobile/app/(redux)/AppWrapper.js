import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Slot } from "expo-router";
import { loadUser } from "./authSlice";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return <Slot />;
}

export default AppWrapper;
