import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 12);
    return hashedPass;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashPassword) => {
  try {
    const isSame = bcrypt.compare(password, hashPassword);
    return isSame;
  } catch (error) {
    console.log(error);
  }
};
