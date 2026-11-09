const API_URL = 'http://localhost:8080/livros';

document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    document.getElementById('livro-form').addEventListener('submit', salvarLivro);
});

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alert-box');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 4000);
}

async function carregarLivros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar a lista de livros.');
        const livros = await response.json();
        
        const tbody = document.getElementById('livros-list');
        tbody.innerHTML = '';
        
        livros.forEach(livro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.id}</td>
                <td>${escapeHtml(livro.titulo)}</td>
                <td>${escapeHtml(livro.autor)}</td>
                <td>${escapeHtml(livro.isbn)}</td>
                <td>${escapeHtml(livro.genero)}</td>
                <td>${livro.exemplares}</td>
                <td>
                    <button class="btn btn-edit" onclick="prepararEdicao(${livro.id}, '${escapeHtml(livro.titulo)}', '${escapeHtml(livro.autor)}', '${escapeHtml(livro.isbn)}', '${escapeHtml(livro.genero)}', ${livro.exemplares})">Editar</button>
                    <button class="btn btn-delete" onclick="deletarLivro(${livro.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

async function salvarLivro(e) {
    e.preventDefault();

    const id = document.getElementById('livro-id').value;
    const livroData = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        isbn: document.getElementById('isbn').value.trim(),
        genero: document.getElementById('genero').value.trim(),
        exemplares: parseInt(document.getElementById('exemplares').value, 10)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livroData)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                const msgs = Object.values(data.errors).join(' ');
                throw new Error(msgs);
            }
            throw new Error(data.message || 'Erro ao processar requisição.');
        }

        showAlert(id ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!', 'success');
        resetForm();
        carregarLivros();
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

function prepararEdicao(id, titulo, autor, isbn, genero, exemplares) {
    document.getElementById('livro-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('autor').value = autor;
    document.getElementById('isbn').value = isbn;
    document.getElementById('genero').value = genero;
    document.getElementById('exemplares').value = exemplares;

    document.getElementById('form-title').textContent = 'Editar Livro';
    document.getElementById('btn-cancel').classList.remove('hidden');
}

function resetForm() {
    document.getElementById('livro-form').reset();
    document.getElementById('livro-id').value = '';
    document.getElementById('form-title').textContent = 'Cadastrar Novo Livro';
    document.getElementById('btn-cancel').classList.add('hidden');
}

async function deletarLivro(id) {
    if (!confirm('Deseja realmente excluir este livro?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Erro ao excluir livro.');
        }
        showAlert('Livro excluído com sucesso!', 'success');
        carregarLivros();
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
