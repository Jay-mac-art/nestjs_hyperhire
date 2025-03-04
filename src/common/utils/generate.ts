export function generateRandomString(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function createSlug(name: string): string {
  // Convert to lowercase
  let slug = name.toLowerCase();

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove special characters
  slug = slug.replace(/[^\w\-]+/g, '');

  return slug;
}

export const genrateUniqueNumberString = () => {
  const value = `${Buffer.from(Math.random().toString()).toString(
    'hex',
  )}${Date.now()}`;

  return value;
};

export const contractNameGenerator = () => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 32;
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return `${result}${Date.now()}`;
};

export async function generatePadNumber(
  input: number | string,
  length: number,
  char: string = '0',
) {
  const inputString = String(input);
  if (inputString.length >= length) {
    return inputString;
  }
  const padding = char.repeat(length - inputString.length);
  return padding + inputString;
}
