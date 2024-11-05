// Date formatting
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Text truncation
export const truncateText = (text: string, length = 150) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Error handling
export const handleApiError = (error: any) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors.join(". ");
  }
  return "An error occurred. Please try again.";
};

// Accessibility
export const accessibility = {
  increaseFontSize() {
    const root = document.documentElement;
    const currentSize = parseInt(getComputedStyle(root).fontSize);
    root.style.fontSize = `${currentSize + 2}px`;
  },

  decreaseFontSize() {
    const root = document.documentElement;
    const currentSize = parseInt(getComputedStyle(root).fontSize);
    root.style.fontSize = `${currentSize - 2}px`;
  },

  toggleHighContrast() {
    document.body.classList.toggle("high-contrast");
  },
};
