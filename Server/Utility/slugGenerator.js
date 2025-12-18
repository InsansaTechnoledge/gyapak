// utils/slugGenerator.js
export const slugGenerator = (title = "") => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove all non-word, non-space chars
    .replace(/\s+/g, "-"); // replace spaces with dashes
};
