
export const excerpt = (content: String, length = 250) =>{
    return content.slice(0, length)
}

export const generateSlug = (title: string, maxLength = 80) => {
  const baseSlug = title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars (except -)
    .replace(/--+/g, '-');    // Replace multiple - with single -

  if (baseSlug.length <= maxLength) {
    return baseSlug;
  }
  return baseSlug
    .substring(0, maxLength)
    .replace(/-$/, ''); 
};