"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.excerpt = void 0;
const excerpt = (content, length = 250) => {
    return content.slice(0, length);
};
exports.excerpt = excerpt;
const generateSlug = (title, maxLength = 80) => {
    const baseSlug = title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars (except -)
        .replace(/--+/g, '-'); // Replace multiple - with single -
    if (baseSlug.length <= maxLength) {
        return baseSlug;
    }
    return baseSlug
        .substring(0, maxLength)
        .replace(/-$/, '');
};
exports.generateSlug = generateSlug;
