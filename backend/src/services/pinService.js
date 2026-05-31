import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPin = async (pin) => {
  return await bcrypt.hash(pin.toString(), SALT_ROUNDS);
};

export const verifyPin = async (plainPin, hashedPin) => {
  return await bcrypt.compare(plainPin.toString(), hashedPin);
};

export const generateRandomPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};