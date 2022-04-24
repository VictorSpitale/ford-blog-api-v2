export const urlPattern =
  '^(https:\\/\\/(www\\.)?|\\/\\/(www\\.)?|www\\.)([0-9A-Za-z-.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(\\/(.)*)?(\\?(.)*)?$';

export const urlRegex = new RegExp(urlPattern);
