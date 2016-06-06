package br.com.xyx.apmanalyzer.server.controller.acao;

import java.util.Collection;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

public class AcaoCmd {
	public Collection<Acao> getAllAcoes(){
		JavaWrapper wrapper = new JavaWrapper();
		
		Collection<Acao> list = wrapper.getAllAcoes();
//		list.add( new Acao("orm-hibernate", "Performance com ORM - Hibernate"));
		
		return list;
	}
}
