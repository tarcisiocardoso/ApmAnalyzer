package br.com.xyx.apmanalyzer.server.controller.analise;

import java.util.Collection;
import java.util.Map;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;

public class AnaliseCmd {

	public String salvaAnalise(Analise analise) throws Exception{
		JavaWrapper wrapper = new JavaWrapper();
		String id  = wrapper.salvaAnalise(analise);
		
		return id;
	}
	public Collection<Analise> getAllAnalises(){
		JavaWrapper wrapper = new JavaWrapper();
		
		Collection<Analise> list = wrapper.getAllAnalises();
		
		return list;
	}
	public String salvaAnaliseAtributo(String idAnalise, String id, String valor, String tipo) {
		JavaWrapper wrapper = new JavaWrapper();
		String result = null;
		try {
			result = wrapper.salvaAnaliseAtributo(idAnalise, id, valor, tipo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
