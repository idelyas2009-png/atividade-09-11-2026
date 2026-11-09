package com.bibliotech.service;

import com.bibliotech.exception.ResourceConflictException;
import com.bibliotech.exception.ResourceNotFoundException;
import com.bibliotech.model.Livro;
import com.bibliotech.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Livro buscarPorId(Long id) {
        return livroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livro com ID " + id + " não encontrado."));
    }

    public Livro salvar(Livro livro) {
        if (livroRepository.existsByIsbn(livro.getIsbn())) {
            throw new ResourceConflictException("Já existe um livro cadastrado com o ISBN informado: " + livro.getIsbn());
        }
        return livroRepository.save(livro);
    }

    public Livro atualizar(Long id, Livro livroAtualizado) {
        Livro livroExistente = buscarPorId(id);

        if (livroRepository.existsByIsbnAndIdNot(livroAtualizado.getIsbn(), id)) {
            throw new ResourceConflictException("O ISBN informado já pertence a outro livro.");
        }

        livroExistente.setTitulo(livroAtualizado.getTitulo());
        livroExistente.setAutor(livroAtualizado.getAutor());
        livroExistente.setIsbn(livroAtualizado.getIsbn());
        livroExistente.setGenero(livroAtualizado.getGenero());
        livroExistente.setExemplares(livroAtualizado.getExemplares());

        return livroRepository.save(livroExistente);
    }

    public void deletar(Long id) {
        Livro livro = buscarPorId(id);
        livroRepository.delete(livro);
    }
}
