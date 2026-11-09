package com.bibliotech.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "tb_livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório.")
    @Size(min = 3, max = 150, message = "O título deve ter entre 3 e 150 caracteres.")
    @Column(nullable = false, length = 150)
    private String titulo;

    @NotBlank(message = "O autor é obrigatório.")
    @Column(nullable = false)
    private String autor;

    @NotBlank(message = "O ISBN é obrigatório.")
    @Column(nullable = false, unique = true)
    private String isbn;

    @NotBlank(message = "O gênero é obrigatório.")
    @Column(nullable = false)
    private String genero;

    @NotNull(message = "O número de exemplares é obrigatório.")
    @PositiveOrZero(message = "O número de exemplares deve ser maior ou igual a 0.")
    @Column(nullable = false)
    private Integer exemplares;

    public Livro() {}

    public Livro(Long id, String titulo, String autor, String isbn, String genero, Integer exemplares) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.genero = genero;
        this.exemplares = exemplares;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Integer getExemplares() { return exemplares; }
    public void setExemplares(Integer exemplares) { this.exemplares = exemplares; }
}
