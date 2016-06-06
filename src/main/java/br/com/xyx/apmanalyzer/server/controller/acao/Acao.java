package br.com.xyx.apmanalyzer.server.controller.acao;

public class Acao {
	public String id;
	public String nome;
	public String conteudo;
	
	public Acao(String i, String n){
		id = i;
		nome = n;
	}
	@Override
	public String toString() {
		return "Acao [id=" + id + ", nome=" + nome + "]";
	}
}
