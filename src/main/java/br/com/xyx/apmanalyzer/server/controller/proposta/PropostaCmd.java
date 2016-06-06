package br.com.xyx.apmanalyzer.server.controller.proposta;

import java.util.Collection;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

public class PropostaCmd {

	public Collection<Proposta> getAllPropostas(){
		JavaWrapper wrapper = new JavaWrapper();
		
		Collection<Proposta> list = wrapper.getAllPropostas();
//		list.add( new Proposta("orm-hibernate", "Performance com ORM - Hibernate"));
		
		return list;
	}
}
