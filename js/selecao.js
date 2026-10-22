export function resolverSelecao(ids, indice) {
  const validos = [];
  const descartados = [];
  for (const id of ids) {
    const achado = indice.get(id);
    if (achado) validos.push(achado); else descartados.push(id);
  }
  return { validos, descartados };
}
