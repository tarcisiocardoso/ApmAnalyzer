var isAcaoEditModel = false;
var isAcaoDeleteModel = false;
var myCodeMirror = null;

function atualizaTela(){
	var idAcao = $('#idAcaoAtual').val();
	console.log('atualizaTela: '+idAcao);
	if( idAcao){
		var url = "./acao/"+idAcao+"/index.html";
		$.get( url, function( data ) {
			  $( "#acaoContainer" ).html( data );		  
		});
	}
}
function modoEdicaoHTML(){
	var idAcao = $('#identificador').val();
	if( $(".row").length >0 ){ //se tem esse conteudo esta em modo formulario
		$('.trash').remove();
		var p = $("#wrapper").find(".col-lg-12");
		var conteudo = p.html().trim();
		
		var btn = $(".fa-html5");
		btn.html(" FORM");
		
		$('.row').remove();
		var html = '\<div class="form-editor">\
			<input id="identificador" type="hidden" name="identificador">\
			<textarea class="conteudo-textarea" rows="20" cols="100"></textarea>\
			  </div>';
		$('.container-fluid').append( html );
		
		var id = $('#idAcaoAtual').val();
		limpaConteudo();
		$(".conteudo-textarea").val(conteudo);

		myCodeMirror = CodeMirror.fromTextArea($(".conteudo-textarea")[0]);
		
	}else{//se não esta em modo html
		var corpo = myCodeMirror.getValue();
		$('.form-editor').remove();
		//TODO rever solução para que possa ficar mais manutenivel
		var html = '\
			<div class="row">\
			<div class="col-lg-12" id="panelPrincipal">\
			  <div class="form-group">\
		          <label>Novo item:</label>\
		          <input class="form-control" id="nomeItem">\
		      </div>\
			  <input id="identificador" type="hidden" name="identificador">\
			  <input id="x" type="hidden" name="content">\
			  <trix-editor input="x"></trix-editor>\
			  <span class="input-group-btn"><button class="btn btn-default" type="button" onClick="addNovoItem();"><i class="fa fa-plus"> Add</i></button></span>\
			<div id="wrapper">\
			  <div id="page-wrapper">\
			  	<div class="container-fluid">\
		           <div class="row">\
		                <div class="col-lg-12">\
		                </div>\
		           </div>\
				</div>\
			  </div>\<!-- fim page-wrapper -->\
			</div> <!-- fim wrapper -->\
			</div> <!-- fim panelPrincipal -->\
		</div>';
		$('.container-fluid').append( html );
		var btn = $(".fa-html5");
		btn.html(" HTML");
		
		var p = $("#wrapper").find(".col-lg-12");
		p.html( corpo );
	}
	console.log('idAcao-> '+idAcao );
	$('#identificador').val(idAcao);
}
function moduloExclusao(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	isAcaoDeleteModel = true;
	
	var content = $('.panel-title');
	
	var html =
    	'\
		<button class="btn btn-default pull-right trash" type="button" onClick="removeItem(this)"><i class="fa fa-trash"></i></button>\
    	';
	content.append( html );
}
function removeItem(me){
	var p = me.parentElement.parentElement.parentElement;
	
	if( !isAcaoEditModel ){
		var trash = $('.trash');
		trash.remove();
	}
	
	$(p).remove();
}

function moduloEdicao(){
	var id = $('#idAcaoAtual').val();
	isAcaoEditModel = true;
	if( !id ){
		$('#myModal').modal('show');
	}else{
		//abre cadastro ação
		novaAcao(id);
	}
}

function limpaConteudo(){
	var panel = $(".panel-body");
	panel.attr("style", "display: none");
	$('.trash').remove();
}
function salvaAcao(){
	var nomeAcao = $('#nomeAcao').val();
	var idAcao = $('#identificador').val();
	if( nomeAcao.length == 0 ){
		alert("Nome da acao deve ser informado");
		return;
	}
	var html = "";
	if( $(".row").length >0 ){ //modulo vormulario
		var p = $("#wrapper").find(".col-lg-12");
		limpaConteudo();
		html = p.html().trim();
	}else{
		console.log('nao implementado...xxxx');
		html = myCodeMirror.getValue();
	}
	$.post( "/acao",  {idAcao:idAcao, nomeAcao:nomeAcao, conteudo:html} )
	.done(function( json ) {
		
		if( json.sucesso ){
			$('#myModal .modal-title').html("Sucesso!");
		}else{
			$('#myModal .modal-title').html("Problema!");
		}
		$('#myModal .modal-body').html( json.dado);
		$('#myModal').modal('show')
	  });
}
function addNovoItem(){
	var p = $("#page-wrapper").find(".col-lg-12:last");
	
	var nm = $('#nomeItem');
	var titulo = nm.val();
	var element = document.querySelector("trix-editor")
	var corpo = $('#x')[0].value;//element.editor.getDocument().toString()
	if( titulo.length == 0 ){
		alert("Informe no nome do item a ser inserido");
		nm.focus();
		return;
	}
	if( corpo.length == 0 ){
		alert("Informe corpo do item.");
		return;
	}
	//var div = document.createElement('div');
	//div.className = 'panel panel-primary';
	
	var qtd = p[0].children.length;
	
	var html =
    	'\
		<div class="panel panel-primary">\
			<div class="panel-heading">\
	        <h3 class="panel-title"><i class="fa fa-check-square-o"></i>'+qtd+' - '+titulo+
	        	'<button class="btn btn-default" type="button" onClick="showAtividade(this)"><i class="fa fa-check-square-o"></i></button>\
	        	<button class="btn btn-default pull-right trash" type="button" onClick="removeItem(this)"><i class="fa fa-trash"></i></button>\
	        </h3>\
		    </div>\
		    <div class="panel-body" >'+
		    corpo+
		    '</div>\
        </div>\
    	';
    p.append(html);
	//p.first().before(html);

    nm.val("");
    element.editor.setSelectedRange([0, corpo.length ]);
    element.editor.deleteInDirection("forward");

    nm.focus();
}

function novaAcao(id){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	var nomeAcao = $('#nomeAcao').html();
	$.get( "app/acao/novo.html", function( data ) {
		  $( "body" ).html( data );
		  if( id ){
			  var url = "./acao/"+id+"/index.html";				
			  var p = $("#page-wrapper").find(".col-lg-12");
			  $('#identificador').val(id);
			  $.get( url, function( data ) {
				  
				  $('#nomeAcao').val(nomeAcao);
				  p.html( data );
				  var content = $('.panel-title');
				  var html =
			    	'\
					<button class="btn btn-default pull-right trash" type="button" onClick="removeItem(this)"><i class="fa fa-trash"></i></button>\
			    	';
				  content.append( html );
			  });
		  }
	});
}

function showAtividade(me){
	var p = me.parentElement.parentElement.parentElement;
	p = $(p).find('.panel-body');
	var cn = p.attr('style');
	if( cn.indexOf('none') >= 0 ){
		p.show();
	}else{
		p.hide();
	}
}

function openListaAcao(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/acao/acao.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaAcao();
		  
		});
}

function montaListaAcao(){
	isAcaoEditModel = false;
	
	wrapper.getAcoes(function( data ) {
		  $.each( data, function (index, acao){
			  var html = "<a href='#' onClick=\"showAcao(\'"+acao.id+"\', '"+acao.nome+"'); return false\"><h4>"+acao.nome+"</h4></a>";
			  $( "#idAcao" ).append(html);
		  });
		}
	);
}

function showAcao(id, nomeAcao){
	var url = "./base/acao/"+id+"/index.html";
	if( isAcaoEditModel ){
		novaAcao(id);
	}else{
		$('#idAcaoAtual').val(id);
		$('#nomeAcao').html(nomeAcao);
		
		$.get( url, function( data ) {
			  $( "#acaoContainer" ).html( data );		  
		});
	}
}