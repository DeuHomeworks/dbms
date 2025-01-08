// utils/dateUtils.js
export const formatDate = (dateString) => {
  if (!dateString) return 'Not available';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};