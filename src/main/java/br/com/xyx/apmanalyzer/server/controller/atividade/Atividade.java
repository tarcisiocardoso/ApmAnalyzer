package br.com.xyx.apmanalyzer.server.controller.atividade;

public class Atividade {
	public String id;
	public String nome;
	
	public String conteudo;
	
	public Atividade(){}
	
	public Atividade(String id, String nome){
		this.id = id;
		this.nome = nome;
	}
	
	public Atividade(String id, String nome, String conteudo){
		this.id = id;
		this.nome = nome;
		this.conteudo = conteudo;
	}
	
}
