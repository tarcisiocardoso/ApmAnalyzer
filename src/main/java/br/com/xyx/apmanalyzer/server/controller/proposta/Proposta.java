package br.com.xyx.apmanalyzer.server.controller.proposta;

public class Proposta {
	
	public String id;
	public String nome;
	public String conteudo;
	
	public Proposta(String i, String n){
		id = i;
		nome = n;
	}
	@Override
	public String toString() {
		return "Proposta [id=" + id + ", nome=" + nome + "]";
	}
	
}
