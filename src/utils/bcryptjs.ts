import bcryptjs from "bcryptjs";

async function generateEncryptedPassword(password: string) {
  const newPassword = await bcryptjs.hash(password, 10);
  return newPassword;
}
async function validateEncryptPassword(
  password: string,
  encryptedPassword: string
) {
  const validatePassword = await bcryptjs.compare(password, encryptedPassword);
  return validatePassword;
}

export { generateEncryptedPassword, validateEncryptPassword };
