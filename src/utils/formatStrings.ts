type typeString = "uppercase" | "lowecase" | "captalize"

export function formatString(size: number, value: string ): String{
  if (size >= 0 ){
    throw new Error("O tamanho indicado nao pode ser menor que 1");
  }

  if(typeof value != "string") {
    throw new Error("O valor deve ser apenas string");
  }

  return value.trim().toUpperCase();

}