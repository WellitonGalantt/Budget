export const verifyAllowedKeys = (
  input: Record<string, unknown>,
  alowwed: Set<string>
): void => {
  for (const key in input) {
    if (!alowwed.has(key)) {
      throw new Error(`The key '${key}' is not allowed`);
    }
  }
};
