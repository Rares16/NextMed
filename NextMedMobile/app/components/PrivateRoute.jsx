// app/components/PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Redirect to login if user is not authenticated
    router.replace('../index'); // Make sure this matches your login route
    return null; // Return null to render nothing during redirect
  }

  // Render children if the user is authenticated
  return children;
};

export default PrivateRoute;
