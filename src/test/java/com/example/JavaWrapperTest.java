package com.example;

import br.com.xyx.apmanalyzer.desktop.JavaWrapper;
import br.com.xyx.apmanalyzer.server.controller.atividade.Atividade;
import junit.framework.TestCase;

public class JavaWrapperTest extends TestCase{

	//-DrootPath=src/main/resources/
	{
		JavaWrapper.PATH = "src/main/resources/static/web/base/";
		JavaWrapper.PATH_ACAO = JavaWrapper.PATH + "/acao";
		JavaWrapper.PATH_COMO_FAZER = JavaWrapper.PATH + "/como_fazer";
		JavaWrapper.PATH_PROPOSTA = JavaWrapper.PATH + "/proposta";
		JavaWrapper.PATH_ANALISE = JavaWrapper.PATH + "/analise";
		JavaWrapper.PATH_ATIVIDADE = JavaWrapper.PATH + "/atividade";
	}
	
	public void testNada(){
		assertEquals( 1==1, true );
	}
	public void testeSalvaAtividade(){
		String id = null;
		String nome = "aaaa";
		String conteudo = "<b>de qual e</b>";
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaAtividade(new Atividade( id, nome, conteudo) );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
/*
	public void testSalvaProposta(){
		String id = null;
		String nome = "aaaa";
		String conteudo = "<b>de qual e</b>";
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaProposta(new Proposta( id, nome, conteudo) );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	public void testRemoveProposta(){
		String id = null;
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.removeProposta( "1467642154079_pppp" );
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	public void testRemoveComoFazer(){
		String id = null;
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.removeComoFazer( "1466717392592_tttttt" );
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	public void testRemoveAcao(){
		String id = null;
		try {
			JavaWrapper w = new JavaWrapper();
			
			id = w.removeAcao( "1467642265602_aaaaaa" );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	
	public void testSalvaAcao(){
		String id = null;
		String nome = "aaaa";
		String conteudo = "<b>de qual e</b>";
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaAcao( id, nome, conteudo );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	public void testSalvaAnaliseAtributo(){
		//Object {idAnalise: "xptoII", id: "q01", valor: "xxxx"}
		String id = null;
		try {
			JavaWrapper w = new JavaWrapper();
			id = w.salvaAnaliseAtributo( "xptoII", "r01", "xoxoxo", "nome" );
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		assertEquals( id != null, true );
	}
	
	public void testBuscaAnaliseDisco(){
		String json = null;
		JavaWrapper w = new JavaWrapper();
		try {
			json = w.recuperaAnaliseByIdJson("1467827941435_aaaa");
			System.out.println( json );
		} catch (Exception e) {
			e.printStackTrace();
			assertEquals(false, true );
		}
		assertEquals( json!= null, true );
	}
	
	public void testAnaliseDisco(){
		JavaWrapper w = new JavaWrapper();
		
		Analise analise = new Analise();
		analise.id = "xptoII";
		analise.nome = "Teste Analise xpto";
		analise.questoes = makeQuestao();
		
		String id = null;
		try {
			id = w.salvaAnalise( analise );
		} catch (Exception e) {
			e.printStackTrace();
			
		}
		assertEquals(analise.id, id );
	}
	private List<Questao> makeQuestao() {
		List<Questao> l = new ArrayList<>();
		Questao q = new Questao();
		q.id ="q01";
		q.nome= "Nome da questao 01";
		
		Help h = new Help();
		h.doc = "<b>Ajuda para entender essa questao</b>";
		q.help = h;
		List<Resposta> lr = new ArrayList<>();
		Resposta r = new Resposta();
		r.id = "r01";
		r.nome = "Resposta 01";
		r.help = h;
		r.propostas = new String[]{"1466515981834_Teste_Prop", "1466601520944_xxxxx"};
		lr.add(r );
		q.respostas = lr;
		
		l.add(q);
		return l;
	}
	public void testSalvaComoFazer(){
		JavaWrapper w = new JavaWrapper();
		ComoFazer comoFazer = new ComoFazer("Teste_inde", "Teste indentificador", "<h1>so para verII</h1>");
		
		String id = null;
		try {
			id = w.salvaComoFazer( comoFazer );
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		assertEquals(id != null, true);
	}
	public void testeBuscaComoFazer(){
		JavaWrapper w = new JavaWrapper();
		
		Collection<ComoFazer> list= w.getAllComoFazer();
		for (ComoFazer comoFazer : list) {
			System.out.println( comoFazer );
		}
		
		assertEquals(list != null, true);
		
	}
	
	public void testeAcao(){
		JavaWrapper w = new JavaWrapper();
		
//		Collection<Acao> list= w.getAllAcoes();
//		for (Acao acao : list) {
//			System.out.println( acao );
//		}
		String json = w.getAllAcaoAsJson();
		System.out.println(json);
		
		assertEquals(json.length()> 3, true);
	}
	public void testAnalise(){
		JavaWrapper w = new JavaWrapper();
		
		Collection<Analise> list= w.getAllAnalises();
		for (Analise analise : list) {
			System.out.println( analise );
		}
		
		assertEquals(list != null, true);
	}
	public void testProposta(){
		JavaWrapper w = new JavaWrapper();
		String json = w.getAllPropostasAsJson();
		
		assertEquals(json != null, true);
	}
*/	
}
