// Rules for the password Juan sets with `npm run admin:password`.
// Messages are in English: only Juan reads them, in the terminal.
export const MIN_PASSWORD_LENGTH = 12;

export function newPasswordProblem(
  password: string,
  confirmation: string,
): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `The password must have at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirmation) return "The two passwords are different.";
  return null;
}
