export const shortFormOfLink = (link?: string) => {
  if (!link) {
    return "";
  }
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
};

export const stringToLength = (str?: string | null, length?: number) => {
  if (!str) {
    return "";
  }
  if (!length) {
    return str;
  }
  if (str.length <= length) {
    return str;
  }
  return `${str.slice(0, length - 3)}...`;
};
