export const generateSlugUrl = (
  title,
  id,
  basePath = "/top-exams-for-government-jobs-in-india",
  isNewTrue
) => {
  if (!title || !id) {
    console.error("generateSlugUrl: title and id are required");
    return basePath;
  }
  const slug = slugGenerator(title);
  if (isNewTrue) return `${basePath}/${slug}--${id}`;
  else return `${basePath}/${slug}?id=${id}`;
};

const slugGenerator = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
};

export default slugGenerator;
