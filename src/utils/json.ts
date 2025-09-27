export const stringifyJson = (obj: any, opc: string) => {
  if (opc === "stringify") {
    const dados: Record<string, string> = {};
    for (const [campo, valor] of Object.entries(obj)) {
      dados[campo] =
        typeof valor === "object" ? JSON.stringify(valor) : String(valor);
    }
    return dados;
  }

  if (opc === "parse") {
    const dados: Record<string, any> = {};
    for (const [campo, valor] of Object.entries(obj)) {
      dados[campo] = typeof valor === "string" ? JSON.parse(valor) : valor;
    }
    return dados;
  }
};
