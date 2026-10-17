// Multipart filenames arrive latin1-decoded, so Arabic names look garbled — restore them.
export const fixFileName = (name = "cv") => {
  let result = name;

  if (![...name].some((ch) => ch.charCodeAt(0) > 255)) {
    const decoded = Buffer.from(name, "latin1").toString("utf8");
    if (!decoded.includes("\uFFFD")) result = decoded;
  }

  // strip characters that are unsafe in file names; keep the end (extension)
  return result.replace(/[\\/:*?"<>|\r\n]/g, "_").slice(-150);
};
