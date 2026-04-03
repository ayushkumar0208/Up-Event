const config = {
  // Use environment variables or fallback to localhost for development
  API_SERVER: process.env.REACT_APP_API_SERVER || "http://localhost:8800",
  SIGNALING_SERVER: process.env.REACT_APP_SIGNALING_SERVER || "http://localhost:4001",
};

export default config;
