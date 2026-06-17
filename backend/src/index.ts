import app from './app';

// Define the port for the backend server
const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/health`);
});
