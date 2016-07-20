package br.com.xyx.apmanalyzer.server.controller.atividade;

import java.util.Collection;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

public class AtividadeCmd {
	public String removeAtividade(String identificador)throws Exception{
		String id = null;
		JavaWrapper wrapper = new JavaWrapper();
		id= wrapper.removeAtividade( identificador );
		return id;
	}
	
	public String savaAtividade(Atividade atividade) throws Exception{
		String id = null;
		JavaWrapper wrapper = new JavaWrapper();
		id= wrapper.salvaAtividade( atividade );
		return id;
	}
	
	public Collection<Atividade> getAllAtividades(){
		JavaWrapper wrapper = new JavaWrapper();
		
		Collection<Atividade> list = wrapper.getAllAtividades();
//		list.add( new Proposta("orm-hibernate", "Performance com ORM - Hibernate"));
		
		return list;
	}
}
