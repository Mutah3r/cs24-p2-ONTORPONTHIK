export const formatTimeToHumanReadable = (timeString) => {
        const date = new Date(timeString);
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        };
      
        return date.toLocaleDateString(undefined, options);
};