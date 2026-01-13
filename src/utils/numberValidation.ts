const numberRegex = /^[0-9]{2}-([0-9]{8}|[0-9]{9})$/;

export function isValidNumber(number: string): boolean {
  return numberRegex.test(number);
}
