package br.com.xyx.apmanalyzer.server.controller.analise;

import java.util.List;

public class Analise {
	public String id;
	public String nome;
	
	public List<Questao>questoes;
	
	public Analise(){
		
	}
	public Analise(String i, String n){
		id = i;
		nome = n;
	}
	@Override
	public String toString() {
		String ret = "Analise [id=" + id + ", nome=" + nome + "]";
		if( questoes != null && questoes.size() > 0){
			for (Questao questao : questoes) {
				ret += questao.toString()+",";
			}
			ret = ret.substring(0, ret.length()-1);
		}
		return ret;
	}
}
