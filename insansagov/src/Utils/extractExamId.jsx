import { extractIdFromSlug } from "./urlUtils.utils";

export const extractExamId = ({ slug, search }) => {
    // 1) Try new URL format: slug--id
    const idFromSlug = extractIdFromSlug(slug);
    if (idFromSlug) return idFromSlug;
  
    // 2) Try old URL format: ?id=xxxx
    if (search) {
      const params = new URLSearchParams(search);
      const id = params.get("id");
      if (id && id.length === 24 && /^[a-f0-9]{24}$/i.test(id)) return id;
    }
  
    return null;
  };
  