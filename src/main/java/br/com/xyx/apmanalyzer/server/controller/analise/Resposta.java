package br.com.xyx.apmanalyzer.server.controller.analise;

import java.util.List;

public class Resposta {
	public String id;
	public String nome;
	public String idComoFazer;
	
	public Help help;
	public List<Questao>questoes;
	
	public Resposta(){}

	@Override
	public String toString() {
		return "Resposta [id=" + id + ", nome=" + nome + ", help=" + help + "]";
	}
	
	
}
