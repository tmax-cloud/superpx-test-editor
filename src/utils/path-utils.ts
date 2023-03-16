export const getExtensionOfFilename = (filename) => {
  return filename
    .substring(filename.lastIndexOf('.') + 1, filename.length)
    .toLowerCase();
};
