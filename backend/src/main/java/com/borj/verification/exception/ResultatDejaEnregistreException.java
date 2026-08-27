package com.borj.verification.exception;

public class ResultatDejaEnregistreException extends RuntimeException {
    public ResultatDejaEnregistreException(Integer id) {
        super("Un resultat IA est deja enregistre pour la valeur " + id);
    }
}