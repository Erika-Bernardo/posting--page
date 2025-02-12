document.getElementById('visualizar').addEventListener('click', function() {
    const titulo = document.getElementById('titulo').value.trim();
    const conteudo = document.getElementById('conteudo').value.trim();
    const postContainer = document.getElementById('post-container');
    const renderizadorTitulo = document.getElementById('renderizador-titulo');
    const renderizadorConteudo = document.getElementById('renderizador-conteudo');
    
    renderizadorTitulo.innerText = titulo;
    renderizadorConteudo.innerText = conteudo;
    
    if (titulo || conteudo) {
        postContainer.style.display = "block";
    } else {
        postContainer.style.display = "none";
    }
    
    document.getElementById('postar').disabled = titulo === '' || conteudo === '';
});

document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const conteudo = document.getElementById('conteudo').value.trim();
    const postContainer = document.getElementById('post-container');
    const renderizadorTitulo = document.getElementById('renderizador-titulo');
    const renderizadorConteudo = document.getElementById('renderizador-conteudo');

    if (!titulo || !conteudo) return;

    const data = {
        title: titulo,
        body: conteudo,
        userId: 1
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(response => response.json())
    .then(data => {
        addPostToList(data);

        // Armazena localmente
        localStorage.setItem('posts', JSON.stringify(getStoredPosts().concat(data)));

        // Limpa os campos de entrada
        document.getElementById('titulo').value = '';
        document.getElementById('conteudo').value = '';
        document.getElementById('postar').disabled = true;

        // Esconde e limpa o quadro de visualização
        renderizadorTitulo.innerText = '';
        renderizadorConteudo.innerText = '';
        postContainer.style.display = "none";
    })
    .catch(error => console.error('Erro ao postar:', error));
});

function addPostToList(post) {
    const postList = document.getElementById('posts-list');
    const postElement = document.createElement('div');
    postElement.classList.add('post-item');
    postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
    postList.prepend(postElement);

    if (postList.childNodes.length > 10) {
        postList.removeChild(postList.lastChild);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getStoredPosts().slice(-10).forEach(addPostToList);
});

// Função auxiliar para recuperar posts armazenados localmente
function getStoredPosts() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}