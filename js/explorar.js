const modelosPorMarca = JSON.parse(document.getElementById('modelos-por-marca').textContent);
const selMarca = document.getElementById('marca');
const selModelo = document.getElementById('modelo');

function preencherModelos() {
  const atual = selModelo.value;
  const slugs = selMarca.value ? [selMarca.value] : Object.keys(modelosPorMarca);
  selModelo.replaceChildren(new Option('Todos', ''));
  for (const slug of slugs) {
    for (const m of modelosPorMarca[slug] ?? []) selModelo.append(new Option(m.nome, m.id, false, m.id === atual));
  }
}

selMarca.addEventListener('change', preencherModelos);
