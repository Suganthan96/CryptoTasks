// Configuration for backend URL
export const getBackendUrl = () => {
  // In production, this will be your Railway backend URL
  // In development, it will be localhost
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-railway-app.railway.app';
  }
  return 'http://localhost:8000';
}; 