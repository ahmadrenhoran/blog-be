
export const excerpt = (content: String, length = 250) =>{
    return content.slice(0, length)
}

export const generateSlug = (title: String, maxLength = 80) => {
    const baseSlug = title.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
    return
}