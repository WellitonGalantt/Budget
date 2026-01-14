const numberRegex = /^[0-9]{2}([0-9]{8}|[0-9]{9})/;

export function isValidNumber(number: string): boolean {
  const normalizedNumber = number.replace(/\D/g, "");
  return numberRegex.test(normalizedNumber);
}
