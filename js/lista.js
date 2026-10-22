export const CHAVE = 'emparalelo.comparacao';

function armazenamentoPadrao() {
  try { return globalThis.localStorage; } catch { return null; }
}

export function criarLista(armazenamento = armazenamentoPadrao()) {
  let memoria = ler();

  function ler() {
    try {
      const bruto = armazenamento?.getItem(CHAVE);
      const valor = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(valor) ? valor.filter((id) => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }

  function gravar() {
    try { armazenamento?.setItem(CHAVE, JSON.stringify(memoria)); } catch {}
  }

  function atual() {
    if (!armazenamento) return memoria;
    try { if (armazenamento.getItem(CHAVE) !== null) memoria = ler(); } catch {}
    return memoria;
  }

  return {
    ids: () => [...atual()],
    contem: (id) => atual().includes(id),
    adicionar(id) {
      if (atual().includes(id)) return false;
      memoria = [...memoria, id];
      gravar();
      return true;
    },
    remover(id) {
      memoria = atual().filter((x) => x !== id);
      gravar();
    },
    trocar(antigo, novo) {
      const ids = atual();
      if (ids.includes(novo) || !ids.includes(antigo)) return false;
      memoria = ids.map((x) => (x === antigo ? novo : x));
      gravar();
      return true;
    },
    limpar() {
      memoria = [];
      gravar();
    },
  };
}
