export const handleError = (error: any) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors.join('\n');
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};