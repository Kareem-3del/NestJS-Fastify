import { hash as bcryptHash , compare as bcryptCompare} from 'bcrypt';
import { secret_text } from '../../constants';
/**
 * Hashes a password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
export async function hash(password: string): Promise<string> {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  return await bcryptHash(password + secret_text, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} plainText - The plain text password to compare.
 * @param {string} hashedText - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the passwords match.
 */
export async function compare(
  plainText: string,
  hashedText: string,
): Promise<boolean> {
  return await bcryptCompare(plainText + secret_text, hashedText);
}
