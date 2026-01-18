type typeFormat = "uppercase" | "lowecase" | "none";

export function formatString(type: typeFormat, value: string): string {
  if (typeof value != "string") {
    console.log(value);
    throw new Error("O valor deve ser apenas string");
  }

  // const res = type === "uppercase" ? value.trim().toUpperCase() : value.trim().toLowerCase();

  if (type === "uppercase") {
    return value.trim().toUpperCase();
  }

  if (type === "lowecase") {
    return value.trim().toLowerCase();
  }

  return value.trim();
}

export function validateTypeUnit(unit: string): boolean {
  switch (unit) {
    case "vl":
    case "hr":
    case "un":
      return true;
      break;
    default:
      return false;
      break;
  }
}
