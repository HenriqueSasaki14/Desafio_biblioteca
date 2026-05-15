// ── Estado da aplicação ──────────────────────────────────────────
let livros = [];
let proximoId = 1;

// ── Referências ao DOM ───────────────────────────────────────────
const form          = document.querySelector('#form-livro');
const inputTitulo   = document.querySelector('#titulo');
const inputAutor    = document.querySelector('#autor');
const selectGenero  = document.querySelector('#genero');
const inputAno      = document.querySelector('#ano');
const checkFavorito = document.querySelector('#favorito');

const listaLivros     = document.querySelector('#lista-livros');
const listaFavoritos  = document.querySelector('#lista-favoritos');
const spanTotal       = document.querySelector('#total-livros');
const spanFavoritos   = document.querySelector('#total-favoritos');

const inputPesquisa    = document.querySelector('#pesquisa');
const filtroGenero     = document.querySelector('#filtro-genero');
const filtroFavorito   = document.querySelector('#filtro-favorito');

// ── Eventos ──────────────────────────────────────────────────────
form.addEventListener('submit', function(event) {
  event.preventDefault();
  cadastrarLivro();
});

inputPesquisa.addEventListener('input', renderizar);
filtroGenero.addEventListener('change', renderizar);
filtroFavorito.addEventListener('change', renderizar);

// ── Funções principais ───────────────────────────────────────────
function cadastrarLivro() {
  const titulo = inputTitulo.value.trim();
  const autor  = inputAutor.value.trim();
  const genero = selectGenero.value;
  const ano    = inputAno.value.trim();
  const fav    = checkFavorito.checked;

  if (!titulo || !autor || !genero) return;

  const novoLivro = {
    id: proximoId++,
    titulo,
    autor,
    genero,
    ano: ano || '—',
    favorito: fav
  };

  livros.push(novoLivro);
  form.reset();
  renderizar();
}

function removerLivro(id) {
  livros = livros.filter(function(livro) {
    return livro.id !== id;
  });
  renderizar();
}

function toggleFavorito(id) {
  for (let i = 0; i < livros.length; i++) {
    if (livros[i].id === id) {
      livros[i].favorito = !livros[i].favorito;
      break;
    }
  }
  renderizar();
}

// ── Filtragem ────────────────────────────────────────────────────
function filtrarLivros() {
  const texto  = inputPesquisa.value.toLowerCase();
  const genero = filtroGenero.value;
  const fav    = filtroFavorito.value;

  return livros.filter(function(livro) {
    const buscaOk = livro.titulo.toLowerCase().includes(texto) ||
                    livro.autor.toLowerCase().includes(texto);

    const generoOk = genero === '' || livro.genero === genero;

    let favOk = true;
    if (fav === 'sim') favOk = livro.favorito === true;
    if (fav === 'nao') favOk = livro.favorito === false;

    return buscaOk && generoOk && favOk;
  });
}

// ── Renderização ─────────────────────────────────────────────────
function renderizar() {
  const visiveis  = filtrarLivros();
  const favoritos = livros.filter(function(l) { return l.favorito; });

  spanTotal.textContent     = `Total: ${livros.length} livro${livros.length !== 1 ? 's' : ''}`;
  spanFavoritos.textContent = `⭐ ${favoritos.length} favorito${favoritos.length !== 1 ? 's' : ''}`;

  renderizarLista(visiveis);
  renderizarFavoritos(favoritos);
}

function renderizarLista(lista) {
  listaLivros.innerHTML = '';

  if (lista.length === 0) {
    const li = document.createElement('li');
    li.className = 'vazio';
    li.textContent = livros.length === 0
      ? 'Nenhum livro cadastrado ainda.'
      : 'Nenhum livro encontrado para os filtros selecionados.';
    listaLivros.appendChild(li);
    return;
  }

  for (let i = 0; i < lista.length; i++) {
    const livro = lista[i];
    const li    = document.createElement('li');

    const article = criarCardLivro(livro);
    li.appendChild(article);
    listaLivros.appendChild(li);
  }
}

function criarCardLivro(livro) {
  const article = document.createElement('article');
  article.className = livro.favorito ? 'livro favorito' : 'livro';

  const infoDiv = document.createElement('div');
  infoDiv.className = 'livro-info';

  const h3 = document.createElement('h3');
  h3.textContent = livro.titulo;

  const p = document.createElement('p');
  p.textContent = `${livro.autor} · ${livro.ano}`;

  const badge = document.createElement('span');
  badge.className = 'livro-badge';
  badge.textContent = livro.genero;

  infoDiv.appendChild(h3);
  infoDiv.appendChild(p);
  infoDiv.appendChild(badge);

  const acoesDiv = document.createElement('div');
  acoesDiv.className = 'livro-acoes';

  const btnFav = document.createElement('button');
  btnFav.className = livro.favorito ? 'btn-fav ativo' : 'btn-fav';
  btnFav.textContent = livro.favorito ? '⭐' : '☆';
  btnFav.title = livro.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
  btnFav.addEventListener('click', function() {
    toggleFavorito(livro.id);
  });

  const btnRemover = document.createElement('button');
  btnRemover.className = 'btn-remover';
  btnRemover.textContent = '✕ Remover';
  btnRemover.addEventListener('click', function() {
    removerLivro(livro.id);
  });

  acoesDiv.appendChild(btnFav);
  acoesDiv.appendChild(btnRemover);

  article.appendChild(infoDiv);
  article.appendChild(acoesDiv);

  return article;
}

function renderizarFavoritos(favoritos) {
  listaFavoritos.innerHTML = '';

  if (favoritos.length === 0) {
    const li = document.createElement('li');
    li.className = 'vazio';
    li.textContent = 'Nenhum favorito ainda.';
    listaFavoritos.appendChild(li);
    return;
  }

  for (let i = 0; i < favoritos.length; i++) {
    const livro = favoritos[i];
    const li    = document.createElement('li');
    li.className = 'fav-item';

    const strong = document.createElement('strong');
    strong.textContent = livro.titulo;

    const span = document.createElement('span');
    span.textContent = `${livro.autor} · ${livro.genero}`;

    li.appendChild(strong);
    li.appendChild(span);
    listaFavoritos.appendChild(li);
  }
}

// ── Inicialização com dados de exemplo ───────────────────────────
function carregarExemplos() {
  const exemplos = [
    { titulo: 'Dom Casmurro',      autor: 'Machado de Assis', genero: 'Romance',   ano: '1899', favorito: true  },
    { titulo: 'O Alquimista',      autor: 'Paulo Coelho',     genero: 'Ficção',    ano: '1988', favorito: false },
    { titulo: '1984',              autor: 'George Orwell',    genero: 'Ficção',    ano: '1949', favorito: true  },
    { titulo: 'O Senhor dos Anéis',autor: 'J.R.R. Tolkien',  genero: 'Fantasia',  ano: '1954', favorito: false },
  ];

  for (let i = 0; i < exemplos.length; i++) {
    livros.push({ id: proximoId++, ...exemplos[i] });
  }

  renderizar();
}

carregarExemplos();
