import app from './app';

// Define the port for the backend server
const DEFAULT_PORT = 4000;
const PORT = process.env.PORT ?? DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/health`);
});
