package br.com.xyx.apmanalyzer.server.controller.analise;

import java.util.List;

public class Questao {

	public String id;
	public String nome;
	public Help help;
	
	public List<Resposta>respostas;
	
	public Questao(){}
	
	@Override
	public String toString() {
		String ret = "Questao [id=" + id + ", nome=" + nome + "]";
		if( help != null){
			ret += ", "+help.toString();
		}
		if( respostas != null && respostas.size() > 0 ){
			for (Resposta resposta : respostas) {
				ret += resposta+", ";
			}
			ret = ret.substring(0, ret.length()-1);
		}
		
		return ret;
	}
	
}
