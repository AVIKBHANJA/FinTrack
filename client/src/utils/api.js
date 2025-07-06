import { store } from "../redux/store.js";
import { clearAuth } from "../redux/auth/authSlice.js";

// Create a wrapper for fetch that handles authentication
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      credentials: "include", // Include cookies
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // If we get a 401, the user is not authenticated
    if (response.status === 401) {
      // Clear auth state and redirect to landing
      store.dispatch(clearAuth());
      throw new Error("Authentication required");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Wrapper for GET requests
export const apiGet = async (endpoint) => {
  const response = await authenticatedFetch(endpoint);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// Wrapper for POST requests
export const apiPost = async (endpoint, data) => {
  const response = await authenticatedFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// Wrapper for PUT requests
export const apiPut = async (endpoint, data) => {
  const response = await authenticatedFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// Wrapper for DELETE requests
export const apiDelete = async (endpoint) => {
  const response = await authenticatedFetch(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};
