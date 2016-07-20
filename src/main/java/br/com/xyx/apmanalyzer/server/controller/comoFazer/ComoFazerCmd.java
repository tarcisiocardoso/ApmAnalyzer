package br.com.xyx.apmanalyzer.server.controller.comoFazer;

import java.util.Collection;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

public class ComoFazerCmd {

	public Collection<ComoFazer> getAllComoFazer(){
		JavaWrapper wrapper = new JavaWrapper();
		Collection<ComoFazer> list = wrapper.getAllComoFazer();
		return list;
	}
	public String removeComoFazer(String id) throws Exception{
		JavaWrapper wrapper = new JavaWrapper();
		id= wrapper.removeComoFazer( id );
		return id;
	}
	public String savaComoFazer(ComoFazer comoFazer) throws Exception{
		String id = null;
		JavaWrapper wrapper = new JavaWrapper();
		id= wrapper.salvaComoFazer( comoFazer );
		return id;
	}
}
