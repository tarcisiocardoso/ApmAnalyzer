	var objHelp = {}; //variavel para guardar os helpes da analise
	var objAtual= null; //guarda o objecto que esta sendo editado
	var modoEdicao = false;
	var isAtributoModeEdicao = false; // entra na edição de um atributo
	var atributoEdicao; // indica qual atributo esta sendo editado
	
	function listaProposta(me){
		console.log('>>>>listaProposta<<<');
		$('#modalProposta').modal('show');
		
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
		return novaResposta(div, resposta);
	}
	function novaResposta(me, resposta) {
		var p = me;
		if (me.className != 'panel panel-primary'){
			if (me.nodeName == "DIV"){
				//if( me.className != 'panel-body') {
					var cont = $(me).find('div')
					p = cont[0];
//				}else{
//					p = me.parentElement;
//				}
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
		var idResp, nomeResp, idComoFazer;
		if( resposta ){
			idResp = resposta.id;
			nomeResp = resposta.nome;
		}else{
			idResp = "r";
			nomeResp = "Resposta";
			idComoFazer = "cf";
		}

		var html = '\
                       <input type="checkbox" onchange="changeResposta(this);" value="">\
                       <input type="hidden" name="identificador" value="'+idResp+'" >\
                       <span>'+nomeResp+'</span>\
                       <button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-question"></i></button>\
                       <button class="btn btn-default" type="button" onClick="editarOuSalvar(this)"><i class="fa fa-edit"></i></button>\
                       <button class="btn btn-default" type="button" onClick="novaQuestao(this)"><i class="fa fa-plus"></i></button>\
                       <button class="btn btn-default" type="button" onClick="kb(this, \''+idComoFazer+'\')"><i class="fa fa-life-ring"></i></button>\
					   <button class="btn btn-default" type="button" onClick="removeElementoResposta(this)"><i class="fa fa-times" aria-hidden="true"></i></button>\
					   <i class="fa fa-edit pull-right" onClick="edicaoAtributo(this);"></i>\
		    	';
		div.innerHTML = html;
		p.appendChild(div);
		
		if( !modoEdicao && !isAtributoModeEdicao ){
			var btn = $(div).find('button');
			$(btn[1]).hide();
			$(btn[2]).hide();
			if( idComoFazer == null ){
				$(btn[3]).hide();
			}
			$(btn[4]).hide();
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
		/*
		$.post( "/analise",  data )
		.done(function( json ) {
			console.log(json);
			if( json.sucesso ){
				$('#myModal .modal-title').html("Sucesso!");
			}else{
				$('#myModal .modal-title').html("Problema!");
			}
			$('#myModal .modal-body').html( json.dado);
			$('#myModal').modal('show')
		  });
		  */
		

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
				var item = {};
				var no = nodes[i];
				var q = $(no).find("span:first");
				var id = $(no).find("input:last");
				item["nome"] = q[0].innerHTML;
				item["id"] = id[0].value;
				item['help'] = getHelpById(id[0].value);
				
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
	function kb(me, key) {
		
		var p = me.parentElement;
		var cn = p.lastChild.className
		if (cn == 'panel-body') {
			console.log('remover...');
			p.removeChild(p.lastChild);
		} else {

			var div = document.createElement('div');
			div.className = 'panel-body';

//			var html = '\
//				<div class="panel panel-primary">\
//					<button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-edit"></i></button>\
//	             	<button class="btn btn-default" type="button" onClick="listaProposta(this)"><i class="fa fa-search" aria-hidden="true"></i></button>\
//	             	<button class="btn btn-default" type="button" onClick="help(this)"><i class="fa fa-plus"></i></button>\
//	                 <h1>Para solucionar esse problema deve fazer os seguintes pontos</h1>\
//	                 <ul>\
//	                   <li>pontos aaaaa</li>\
//	                   <li>pontos bbb</li>\
//	                   <li>pontos ccc</li>\
//	                 </ul>\
//	            </div>\
//		    	';
//			div.innerHTML = html;
			
			$.get( "./como_fazer/"+key+"/index.html", function( data ) {
				  $( div ).html( data );
				});
			
			p.appendChild(div);
		}
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
			'nomeHelp': $('#nomeHelp')[0].value,
			'doc': $('#x')[0].value
		};
		
		objHelp[q[0].value] = help;
		
	}
	function help(me) {
		var p = me.parentElement;
		objAtual = p;
		
		var q = $(objAtual).find("input[name='identificador']");
		var h = getHelpById(q[0].value);
		if( h ){
			$('#nomeHelp')[0].value = h.nomeHelp;
			var element = document.querySelector("trix-editor");
			element.editor.setSelectedRange([0, $('#x')[0].value.length ]);
			element.editor.insertHTML(h.doc);
		}else{
			$('#nomeHelp')[0].value = "";
			var element = document.querySelector("trix-editor");
			element.editor.setSelectedRange([0, $('#x')[0].value.length ]);
			element.editor.insertHTML("");
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
		  openDado(id);
	});
}

function changeResposta(me){
	var p = me.parentElement;
	
	console.log(p);
	if( !modoEdicao ){
		var cont = $(p).find('div:first');
		console.log( cont );
		if(me.checked ){
			cont.show();
		}else{
			cont.hide();
		}
	}
	
	return
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

function edicaoAtributo(me){
	console.log(me);
	if( isAtributoModeEdicao == false){
		var p = me.parentElement;
		console.log(p);
		p = $(p).find("button");
		$(p).show();
		atributoEdicao = me;
		isAtributoModeEdicao = true;
	}else{
		var p = me.parentElement;
		console.log(p);
		var btn = $(p).find("button");
		$(btn[1]).hide();
		$(btn[2]).hide();
		$(btn[4]).hide();

		isAtributoModeEdicao = false;
		atributoEdicao = null;
		
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