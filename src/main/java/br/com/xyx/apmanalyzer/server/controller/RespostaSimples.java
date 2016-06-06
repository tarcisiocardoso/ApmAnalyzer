package br.com.xyx.apmanalyzer.server.controller;

public class RespostaSimples {

	public boolean sucesso;
	public String dado;
	
	public RespostaSimples(){}
	public RespostaSimples(boolean s, String d){
		sucesso = s;
		dado = d;
	}
	@Override
	public String toString() {
		return "RespostaSimples [sucesso=" + sucesso + ", dado=" + dado + "]";
	}
	
	
}
