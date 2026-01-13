type typeString = "uppercase" | "lowecase" | "captalize";

export function formatString(value: string): string {
  if (typeof value != "string") {
    throw new Error("O valor deve ser apenas string");
  }

  return value.trim().toUpperCase();
}
