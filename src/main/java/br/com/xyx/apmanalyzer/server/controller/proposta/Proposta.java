package br.com.xyx.apmanalyzer.server.controller.proposta;

public class Proposta {
	
	public String id;
	public String nome;
	public String conteudo;
	
	public Proposta(String i, String n){
		id = i;
		nome = n;
	}
	public Proposta(String i, String n, String c){
		id = i;
		nome = n;
		conteudo = c;
	}
	@Override
	public String toString() {
		return "Proposta [id=" + id + ", nome=" + nome + "]";
	}
	
}
