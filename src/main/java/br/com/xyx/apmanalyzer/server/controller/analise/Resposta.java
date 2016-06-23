package br.com.xyx.apmanalyzer.server.controller.analise;

import java.util.List;

public class Resposta {
	public String id;
	public String nome;
	
	public Help help;
	public List<Questao>questoes;
	
	public String []propostas;
	
	public Resposta(){}

	@Override
	public String toString() {
		return "Resposta [id=" + id + ", nome=" + nome + ", help=" + help + ", propostas="+propostas+"]";
	}
	
	
}
