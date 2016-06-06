package br.com.xyx.apmanalyzer.server.controller.comoFazer;

public class ComoFazer {
	public String id;
	public String nome;
	public String conteudo;
	
	public ComoFazer(){
		id = "";
		nome = "";
	}
	public ComoFazer(String i, String n, String c){
		id = i;
		nome = n;
		conteudo = c;
	}
	public ComoFazer(String i, String n){
		id = i;
		nome = n;
	}
	@Override
	public String toString() {
		return "ComoFazer [id=" + id + ", nome=" + nome + "]";
	}
}
