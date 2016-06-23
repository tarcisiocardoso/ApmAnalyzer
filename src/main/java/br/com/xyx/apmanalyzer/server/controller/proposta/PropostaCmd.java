package br.com.xyx.apmanalyzer.server.controller.proposta;

import java.util.Collection;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;
import br.com.xyx.apmanalyzer.server.controller.comoFazer.ComoFazer;

public class PropostaCmd {

	public String savaProposta(Proposta proposta) throws Exception{
		String id = null;
		JavaWrapper wrapper = new JavaWrapper();
		id= wrapper.salvaProposta( proposta );
		return id;
	}
	
	public Collection<Proposta> getAllPropostas(){
		JavaWrapper wrapper = new JavaWrapper();
		
		Collection<Proposta> list = wrapper.getAllPropostas();
//		list.add( new Proposta("orm-hibernate", "Performance com ORM - Hibernate"));
		
		return list;
	}
}
