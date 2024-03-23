export const shortFormOfLink = (link?: string) => {
  if (!link) {
    return "";
  }
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
};
