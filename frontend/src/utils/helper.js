import ADD_STORY_IMG from "../assets/images/empty.png";
import NO_SEARCH_DATA_IMG from "../assets/images/empty.png";
import NO_FILTER_DATA_IMG from "../assets/images/empty.png";


export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split("");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const getEmptyCardImage = (filterType) => {
  switch (filterType) {
    case "search":
      return NO_SEARCH_DATA_IMG;

    case "date":
      return NO_FILTER_DATA_IMG;
      

    default:
      return ADD_STORY_IMG;
  }
};

export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case "search":
      return `Oopa ! No stories found match your search`;

    case "date":
      return `No stories found in the given data range`;

    default:
      return `Start creating your first travel story!!! Click the 'Add' button to add your thoughts, ideas and memories. Let's get started`;
  }
};
