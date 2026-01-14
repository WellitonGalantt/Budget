type typeFormat = "uppercase" | "lowecase" | "none";

export function formatString(type:typeFormat, value: string): string {
  if (typeof value != "string") {
    throw new Error("O valor deve ser apenas string");
  }

  // const res = type === "uppercase" ? value.trim().toUpperCase() : value.trim().toLowerCase();

  if(type === "uppercase"){
    return value.trim().toUpperCase();
  }

  if(type === "lowecase"){
    return value.trim().toLowerCase();
  }

  if(type === "none"){
    return value.trim();
  }
}
