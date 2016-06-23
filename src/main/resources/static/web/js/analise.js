	var objHelp = {}; //variavel para guardar os helpes da analise
	var objPropostas = {}; //variavel para guardar as propostas da resposta
	var objAtual= null; //guarda o objecto que esta sendo editado
	var modoEdicao = false;
	var isAtributoModeEdicao = false; // entra na edição de um atributo
	var atributoEdicao; // indica qual atributo esta sendo editado
	var propostaEdicao; // guarda qual proposta esta sendo editado
	
	function entraModoEdicao(){
		$("nav").removeClass( "cbp-spmenu-open" );
		$("body").removeClass( "cbp-spmenu-push-toleft" );
		//alert('ainda nao implentado');
		modoEdicao = true;
	}
	function propostaEscolhida(me){
		console.log('>>>propostaEscolhida<<<');
		console.log(propostaEdicao);
		console.log( $(me).attr("name") );
		if($(me).is(':checked')){
			console.log( 'add');
			var p = propostaEdicao.parentElement;
			
			//$(p).html('<h1>so m teste</h1>');
			showPropostaAnalise($(me).attr("name"), p);
			//var p = me.parentElement;
			//var q = $(objAtual).find("input[name='identificador']");
			//console.log(q[0].value );
//			objHelp();//ComoFazer
		}else{
			console.log( 'remove');
			var p = propostaEdicao.parentElement;
			removeProposta( $(me).attr("name"), p);
		}
	}
	function removeProposta(key, p){
		console.log( key );
		console.log(p);
		console.log( $(p).find(key) );
		$( p ).find("[name="+key+"]").remove();
	}
	function openDado(id, edit){
		modoEdicao = edit;
		if( !modoEdicao ){
			$(formulario).hide();
		}
		if( id ){
			$.ajax({
				  url: "/analise/"+id
				}).done(function(data) {
					montaAnalise( data );
				});
		}
	}
	function montaObjectPropostas( id, propostas ){
		objPropostas[id] = propostas;
	}
	function montaObjectHelper(id, help){
		objHelp[id] = help;
	}
	function montaAnalise(json){
		$('#idAnalise').val(json.id);
		$('#nomeAnalise').val(json.nome);
		for (var i = 0; i < json.questoes.length; i++) {
			var q = json.questoes[i];
			montaPanelQuestoes(null, q)
		}
	}
	function montaPanelQuestoes(root, questao){
		var div = null;
		if( root ){
			div = novaQuestao(root);
			if( !modoEdicao ){
				$(div).hide();
			}
		}else{
			div = novaQuestaoHeader(questao);
		}
		if( questao.help ){
			montaObjectHelper(questao.id, questao.help);
		}
		var res = questao.respostas;
		for (var i = 0; i < res.length; i++) {
			var r = res[i];
			var p = montaPanelResposta(div, r);
			if( r.questoes ){
				for (var j = 0; j < r.questoes.length; j++) {
					var q = r.questoes[j];
					montaPanelQuestoes(p, q);
				}
			}
		}
	}
	function montaPanelResposta(div, resposta){
		if( resposta.help ){
			montaObjectHelper(resposta.id, resposta.help);
		}
		if( resposta.propostas){
			montaObjectPropostas( resposta.id, resposta.propostas );
		}
		return novaResposta(div, resposta);
	}
	function novaResposta(me, resposta) {
		var p = me;
		if (me.className != 'panel panel-primary'){
			if (me.nodeName == "DIV"){
				var cont = $(me).find('div')
				p = cont[0];
			}else{
				p = me.parentElement.parentElement.parentElement;
			}
		}
		var nodes = p.childNodes;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].className == "panel-body") {
				p = nodes[i];
				break;
			}
		}
		
		var div = document.createElement('div');
		/* if( nodes.length < 3){
			div.className='panel-body';
		} */
		var idResp, nomeResp, propostas;
		if( resposta ){
			idResp = resposta.id;
			nomeResp = resposta.nome;
			propostas = resposta.propostas;
		}else{
			idResp = "r"+p.childNodes.length;
			nomeResp = "Resposta_"+p.childNodes.length;
		}
		
		var html = '\
                       <input type="checkbox" onchange="changeResposta(this);" value="">\
                       <input type="hidden" name="identificador" value="'+idResp+'" >\
                       <span>'+nomeResp+'</span>\
                       <button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-question"></i></button>\
                       <button class="btn btn-default" type="button" onClick="editarOuSalvar(this)"><i class="fa fa-edit"></i></button>\
                       <button class="btn btn-default" type="button" onClick="novaQuestao(this)"><i class="fa fa-plus"></i></button>\
                       <button class="btn btn-default" type="button" onClick="kb( this )"><i class="fa fa-life-ring"></i></button>\
					   <button class="btn btn-default" type="button" onClick="removeElementoResposta(this)"><i class="fa fa-times" aria-hidden="true"></i></button>\
					   <i class="fa fa-edit pull-right" onClick="edicaoAtributo(this);"></i>\
		    	';
		div.innerHTML = html;
		p.appendChild(div);
		
		if( !modoEdicao && !isAtributoModeEdicao ){
			var btn = $(div).find('button');
			$(btn[1]).hide();
			$(btn[2]).hide();
			if( propostas ){
				$(btn[3]).hide();
				var i=0;
				for(i=0; i< propostas.length; i++){
					showPropostaAnalise(propostas[i], div);	
				}
			}
			$(btn[4]).hide();
		}else{
			if( propostas ){
				var i = $(div).find('i:last');
				i.hide();
				var i=0;
				for(i=0; i< propostas.length; i++){
					showPropostaAnalise(propostas[i], div);	
				}
			}
		}
		if( isAtributoModeEdicao ){
			habilitaSalvaGeral()
		}
		return div;
	}
	function habilitaSalvaGeral(){
		console.log(">>>habilitaSalvaGeral<<<");
		$(formulario).show();
	}
	
	function salvaAnalise(){
		var root = document.getElementById("panelPrincipal");
		var nomeAnalise = document.getElementById("nomeAnalise").value;
		var idAnalise = document.getElementById("idAnalise").value;
		
		var json = {};
		json["id"] = idAnalise;
		json["nome"] = nomeAnalise;
		
		var qs = montaQuestoes( root ); 
		json["questoes"] = qs;
		
		var data =  JSON.stringify(json) ;
		
		console.log(data);

		$.ajax({
		  url:'/analise',
		  type:"POST",
		  data:data,
		  contentType:"application/json; charset=utf-8",
		  dataType:"json",
		  success: function(json){
			  console.log(json);
				if( json.sucesso ){
					$('#myModal .modal-title').html("Sucesso!");
				}else{
					$('#myModal .modal-title').html("Problema!");
				}
				$('#myModal .modal-body').html( json.dado);
				$('#myModal').modal('show')
		  }
		})
	}
	function montaQuestoes(panel){
		var nodes = panel.childNodes;
		var questao = [];
		var i = 0;
		for (var i = 0; i < nodes.length; i++) {
			if( nodes[i].className == "panel panel-primary" ){
				var item = {};
				var no = nodes[i];
				var q = $(no).find("span:first");
				var id = $(no).find("input:first");
				item["nome"] = q[0].innerHTML;
				item["id"] = id[0].value;
				item['help'] = getHelpById(id[0].value);
				item["respostas"] = montaRespostas(no);
				console.log( item );
				questao.push( item );
			}
		}
		return questao;
	}
	function montaRespostas(panel){
		var resposta = [];
		//panel = panel.childNodes[2];
		
		var nodes = panel.childNodes;
		for (var i = 0; i < nodes.length; i++) {
			if( nodes[i].nodeName == "DIV"){
			
				if( nodes[i].className == 'panel-heading'){
					continue;
				}
				var item = {};
				var no = nodes[i];
				var q = $(no).find("span:first");
				var id = $(no).find("input:last");
				item["nome"] = q[0].innerHTML;
				item["id"] = id[0].value;
				item['help'] = getHelpById(id[0].value);
				item['propostas'] = getPropostasDaRespota(no);
				
				var root = $(no).find('.panel-body');
				root = root[0];
				if( root ){
					//root = root.childNodes[1];
					var q = montaQuestoes( root );
					if(q.length > 0) item["questoes"] = q;
				}
				resposta.push( item );
			}
		}
		return resposta;
	}
	function getPropostasDaRespota(no){
		var propostas = $(no).find(".panel-proposta");
		var item = [];
		$.each(propostas, function(index, pro){
			console.log(pro);
			item.push( $(pro).attr('name') );
		} );
		
		if( item.length == 0 )return null;
		
		return item;
	}
	function removeElementoResposta(me){
		var p = me.parentElement;
		p.remove(p.firstChild);
	}
	function removeElemento(me) {
		var p = me.parentElement.parentElement.parentElement;
		p.remove(p.firstChild);
	}
	function editarOuSalvar(me) {
		var p = me.parentElement;
		var nodes = p.childNodes;

		var i = 0;
		var id = $(p).find("input[name='identificador']");
		id = id[0].value;
		
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].nodeName == "SPAN") {
				p = nodes[i];
				break;
			}
		}
		var value = null;
		var html = p.innerHTML;
		if (me.firstChild.className == "fa fa-save") {
			me.firstChild.className = "fa fa-edit";
			value = p.firstChild.value;
			html = value;
			
			//id iqual a 'q' ou 'r' indica uma nova estrutura
			if( isAtributoModeEdicao == true && id != 'q' && id != 'r' ){
				var json = {};
				json["idAnalise"] = document.getElementById("idAnalise").value;
				json["id"] = id;
				json["valor"] = value;
				json["tipo"] = "nome";
				console.log(json);
				$.post( "/analise/savaAtributo",  json )
					.done(function( json ) {
						console.log(json);
				  });
			}
		} else {
			me.firstChild.className = "fa fa-save";
			html = '<input class="form-control" name="nome" value="'+html+'">';
		}

		p.innerHTML = html;
	}
	function kb(me) {
		if( modoEdicao || isAtributoModeEdicao ){
			$('#myModal').modal('show');
			propostaEdicao = me; 
			var p = propostaEdicao.parentElement;
			var propostas = $(p).find('.panel-proposta');
			
			listaPropostaAnalise(propostas);
			
			return;
		}
		var p = me.parentElement;
		var cn = $(p).find('.panel-body');//.lastChild.className
		console.log( cn.length );
		if (cn.length > 0) {
			if( $(cn).is(':visible') ){
			//	p.removeChild(p.lastChild);
				cn.hide();
			}else{
				cn.show();
			}
		} else if (cn.length == 0) {
			showOrHideOrCreateProposta(me);
			//var p = me.parentElement;
//			var q = $(p).find("input[name='identificador']");
//			var id = q[0].value;
//			console.log(id);
//			var propostas = buscaPropostasById(id);
//			var div = document.createElement('div');
//			div.className = 'panel-body';
//
//			var i=0;
//			for(i=0; i< propostas.length; i++){
//				showPropostaAnalise(propostas[i], div);	
//			}
//
//			p.appendChild(div);
		} else{
			console.log('...show...');
		}
	}
	function buscaPropostasById(id){
		for (p in objPropostas) {
			if( p == id ){
				return objPropostas[p];
			}
		} 
		return null;
	}
	function getHelpById(id){
		for (p in objHelp) {
			if( p == id ){
				return objHelp[p];
			}
		} 
		return null;
	}
	function salvaHelp(){
		console.log( objAtual);
		var q = $(objAtual).find("input[name='identificador']");
		
		var help = {
			//'nomeHelp': $('#nomeHelp')[0].value,
			'doc': $('#xHelp')[0].value
		};
		objHelp[q[0].value] = help;
	}
	function help(me) {
		var p = me.parentElement;
		objAtual = p;
		var q = $(objAtual).find("input[name='identificador']");
		var h = getHelpById(q[0].value);
		
		if( modoEdicao || isAtributoModeEdicao){
			$('.help-edicao').show();
			$('.help-visualizacao').hide();
			
			if( h ){
				$('.help-titulo').html( h.nomeHelp );
				//$('#nomeHelp')[0].value = h.nomeHelp;
				var element = document.querySelector("trix-editor");
				console.log( $('#xHelp') );
				console.log( element );
				element.editor.setSelectedRange([0, $('#xHelp')[0].value.length ]);
				element.editor.insertHTML(h.doc);
			}else{
				//$('#nomeHelp')[0].value = "";
				var element = document.querySelector("trix-editor");
				element.editor.setSelectedRange([0, $('#xHelp')[0].value.length ]);
				element.editor.insertHTML("");
			}
		}else{
			$('.help-edicao').hide();
			$('.help-visualizacao').show();
			
			if( h ){
				$('.help-titulo').html( h.nomeHelp );
				$('.help-visualizacao').html(h.doc);
			}else{
				$('.help-visualizacao').html("");
			}
		}
		$('#modalHelp').modal('show')
	}
	
	function novaQuestaoHeader( questao ) {
		var p = document.getElementById("panelPrincipal");
		var nodes = p.childNodes;
		var qtd = nodes.length;
		
		var idQ, nomeQ;
		if( questao){
			idQ = questao.id;
			nomeQ = questao.nome;
		}else{
			idQ = "q"//(qtd+1);
			nomeQ = 'Questao0'+(qtd+1);
		}
		
		var div = document.createElement('div');
		div.className = 'panel panel-primary';
		var html = '\
			<div class="panel-heading">\
			<h3 class="panel-title">\
				<i class="fa fa-question" ></i>\
				<input type="hidden" name="identificador" value="'+idQ+'" >\
				<span>'+nomeQ+'</span>\
				<button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-question"></i></button>\
				<button class="btn btn-default" type="button" onClick="editarOuSalvar(this)"><i class="fa fa-edit"></i></button>\
				<button class="btn btn-default" type="button" onClick="novaResposta(this)"><i class="fa fa-plus"></i></button>'
				+((qtd > 0)?'<button class="btn btn-default" type="button" onClick="removeElemento(this)"><i class="fa fa-times" aria-hidden="true"></i></button>':'')
				+'<i class="fa fa-edit pull-right" onClick="edicaoAtributo(this);"></i>\
			</h3>\
		</div>';

		div.innerHTML = html;
		p.appendChild(div);
		
		if( !modoEdicao ){
			var btn = $(div).find('button');
			$(btn[1]).hide();
			$(btn[2]).hide();
			$(btn[3]).hide();
		}else{
			var i = $(div).find('i:last');
			i.hide();
			console.log(i);
		}
		if( isAtributoModeEdicao ){
			habilitaSalvaGeral()
		}
		return div;
	}
	function novaQuestao(me) {
		var p = me.parentElement;
		if ( me.nodeName != "BUTTON"){
			p = me;
		}
		var div = document.createElement('div');

		div.className = 'panel-body';
		var html = '\
				<div class="panel panel-primary">\
	                         <div class="panel-heading">\
	                             <h3 class="panel-title"><i class="fa fa-file-image-o"></i>\
	                             	<input type="hidden" name="identificador" value="q" >\
									<span>Questao01.01</span>\
	                             	<button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-question"></i></button>\
	                             	<button class="btn btn-default" type="button" onClick="editarOuSalvar(this)"><i class="fa fa-edit"></i></button>\
	                             	<button class="btn btn-default" type="button" onClick="novaResposta(this)"><i class="fa fa-plus"></i></button>\
	                             	<button class="btn btn-default" type="button" onClick="removeElemento(this)"><i class="fa fa-times" aria-hidden="true"></i></button>\
									<i class="fa fa-edit pull-right" onClick="edicaoAtributo(this);"></i>\
	                             </h3>\
	                         </div>\
	                     </div>\
		    	';

		div.innerHTML = html;
		p.appendChild(div);
		console.log(isAtributoModeEdicao );
		if( !modoEdicao && !isAtributoModeEdicao ){
			var btn = $(div).find('button');
			$(btn[1]).hide();
			$(btn[2]).hide();
			$(btn[3]).hide();
			$(btn[4]).hide();
		}
		
		if( modoEdicao || isAtributoModeEdicao ){
			var i = $(div).find('i:last');
			i.hide();
			console.log(i);
		}
		if( isAtributoModeEdicao ){
			habilitaSalvaGeral()
		}
		
		return div;
	}
	
function novaAnalise(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/analise/novo.html", function( data ) {
		  $( "body" ).html( data );
		  
		  //montaListaComoFazer();
		  
		});

}
function novoComoFazer(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/howto/novo.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaComoFazer();
		  
		});
}

function proposta(me){
	var p = me.parentElement;
	
	var cn = p.lastChild.className
	if( cn == 'panel-body'){
		console.log('remover...');
		p.removeChild(p.lastChild);
	}else{
		console.log(p.lastChild.className);
		
		var div = document.createElement('div');
		div.className = 'panel-body';
		
		var html =
	    	'\
			<div class="panel panel-primary">\
                 <h1>Para solucionar esse problema deve fazer os seguintes pontos</h1>\
                 <ul>\
                   <li>pontos aaaaa</li>\
                   <li>pontos bbb</li>\
                   <li>pontos ccc</li>\
                 </ul>\
            </div>\
	    	';
            
        div.innerHTML = html; 
	    p.appendChild(div);
	}
}

function ajuda(){
	$('#myModal').modal('show')
}
function maisQuestoes(me){
		var p = me.parentElement;
		console.log(p);
		
		if(me.checked ){
			var div = document.createElement('div');
	
		    div.className = 'panel-body';
	
		    var html =
		    	'\
				<div class="panel panel-primary">\
	                         <div class="panel-heading">\
	                             <h3 class="panel-title"><i class="fa fa-file-image-o"></i>Questao01.02\
	                             	<button class="btn btn-default" type="button" onClick="help()"><i class="fa fa-question"></i></button>\
	                             </h3>\
	                         </div>\
	                         <div class="panel-body">\
	                           	<div >\
	                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 01\
	                                <button class="btn btn-default" type="button" onClick="help()"><i class="fa fa-question"></i></button>\
	                            </div>	\
	                            <div >\
	                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 02\
	                            </div>\
	                            <div >\
	                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 03\
	                            </div>\
	                         </div>\
	                     </div>\
		    	';
	            
	        div.innerHTML = html; 
		    p.appendChild(div);
		}else{
			console.log('remover...');
			p.removeChild(p.lastChild);
		}
	}

function openListaAnalise(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	modoEdicao = false;
	$.get( "app/analise/index.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaAnalise();
		  
		});
}

function montaListaAnalise(){
	wrapper.getAnalises(function( data ) {
		  console.log("-->"+data);
		  $.each( data, function (index, analise){
			  var html = "<a href='#' onClick=\"showAnalise(\'"+analise.id+"\', \'"+analise.nome+"\'); return false\"><h4>"+analise.nome+"</h4></a>";
			  console.log( '===>'+html );
			  $( "#idAnalise" ).append(html);
		  });
		}
	);
}

function showAnalise(id, nome){
	$( "#tituloPagina" ).html( "<h3><a href='#' onClick=\"openListaAnalise(); return false;\">"+nome+"</a></h3>" );
	
	var url = "./app/analise/analise.html";
	//var url = "/analise/"+id;
	console.log(url);
	$.get( url, function( data ) {
		  $( "#analiseContainer" ).html( data );		  
		  openDado(id, modoEdicao);
	});
}

function changeResposta(me){
	var p = me.parentElement;
	if( modoEdicao || isAtributoModeEdicao ){
		return;
	}
	console.log(p);
	if( !modoEdicao ){
		var cont = $(p).find('.panel-body');
		console.log( cont );
		if(me.checked ){
			if( cont.length == 0 ){
				var q = $(p).find("input[name='identificador']");
				var id = q[0].value;
				console.log(id);
				var propostas = buscaPropostasById(id);
				console.log(propostas);
	
				var div = document.createElement('div');
				div.className = 'panel-body';
	
				var i=0;
				for(i=0; i< propostas.length; i++){
					showPropostaAnalise(propostas[i], div);	
				}
				$(p).append(div);
			}
			cont.show();
		}else{
			cont.hide();
		}
	}
	
	return;
	
	if(me.checked ){
		var div = document.createElement('div');

	    div.className = 'panel-body';

	    var html =
	    	'\
			<div class="panel panel-primary">\
                         <div class="panel-heading">\
                             <h3 class="panel-title"><i class="fa fa-file-image-o"></i>Questao01.02\
                             	<button class="btn btn-default" type="button" onClick="help()"><i class="fa fa-question"></i></button>\
                             </h3>\
                         </div>\
                         <div class="panel-body">\
                           	<div >\
                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 01\
                                <button class="btn btn-default" type="button" onClick="help()"><i class="fa fa-question"></i></button>\
                            </div>	\
                            <div >\
                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 02\
                            </div>\
                            <div >\
                                <input type="checkbox" onchange="changeResposta(this);" value="">resposta 03\
                            </div>\
                         </div>\
                     </div>\
	    	';
            
        div.innerHTML = html; 
	    p.appendChild(div);
	}else{
		console.log('remover...');
		p.removeChild(p.lastChild);
	}
}
function showOrHideOrCreateProposta(me){
	var p = me.parentElement;
	var cont = $(p).find('.panel-body');
	console.log('cont.length: '+ cont.length );
	if( cont.length == 0 ){
		if( !propostas ) return;
		//----------------
		var q = $(p).find("input[name='identificador']");
		var id = q[0].value;
		console.log(id);
		var propostas = buscaPropostasById(id);
		console.log(propostas);

		var div = document.createElement('div');
		div.className = 'panel-body';

		
		var i=0;
		for(i=0; i< propostas.length; i++){
			showPropostaAnalise(propostas[i], div);	
		}
		$(p).append( div );
		//----------------
	}else{
		if( !isAtributoModeEdicao){
			cont.hide();
		}else{
			cont.show();
		}
		
	}
}
function edicaoAtributo(me){
	console.log(me);
	if( isAtributoModeEdicao == false){
		var p = me.parentElement;
		
		var btns = $(p).find("button");
		$(btns).show();
		atributoEdicao = me;
		isAtributoModeEdicao = true;
		//-----------
		showOrHideOrCreateProposta(me);
		//-----------
	}else{
		var p = me.parentElement;
		console.log(p);
		var btn = $(p).find("button");
		$(btn[1]).hide();
		$(btn[2]).hide();
		$(btn[4]).hide();

		isAtributoModeEdicao = false;
		atributoEdicao = null;
		//-----------
		showOrHideOrCreateProposta(me);
		//-----------		
		
	}
//	if( isAtributoModeEdicao == false){
//		console.log(me);
//		var p = me.parentElement;
//		console.log(p);
//		p = $(p).find(".fa-edit:first")[0];
//		p = p.parentElement;
//		
//		console.log( p );
//		$(p).show();
//		editarOuSalvar(p);		
//		atributoEdicao = p;
//		isAtributoModeEdicao = true;
//	}else{
//		isAtributoModeEdicao = false;
//		editarOuSalvar(atributoEdicao);
//		atributoEdicao = null;
//		
//	}
}