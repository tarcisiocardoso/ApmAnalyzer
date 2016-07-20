var isAcaoEditModel = false;
var isAcaoDeleteModel = false;
var myCodeMirror = null;
var idAcaoAtual = null;
var itemAcaoEditado = null;

//-------ROTA----
//Path.root("#/home");
Path.map("#/listaAcao").to(openListaAcao);
Path.map("#/acao/:id/:nome").to(function(){
    var id = this.params['id'];
    var nome = this.params['nome'];
    console.log(id, nome);
    
    $.get( "app/acao/acao.html", function( data ) {
		  $( "body" ).html( data );
		  showAcao(id, nome);
	});
});
//Path.map("#/acao/:id").to( function(){
//	console.log('.x.x.x.x');
//	showAcao(this.params['id'], "teste");
//});
//----FIM ROTA----

function addLink(){
	var nomeLink = $('#nomeLink').val();
	var endLink = $('#endLink').val();
	
	$('#nomeLink').val("");
	$('#endLink').val("");
	console.log( nomeLink+ " - "+endLink );
	
	var html = "<p><a href='"+endLink+"' >"+nomeLink+"</a></p>";
	
	console.log( $('.link-content') );
	$('.link-content').append(html);
	
	var p = $("#page-wrapper").find(".col-lg-12:last");
	$("#page-wrapper").find(".link").remove();
	html = '<div class="link">\
		'+$('.link-content').html()+'</div>';

	p.append( html );

	$('#nomeLink').focus();
}

function cadastrarRef(){
	var idAcao = $('#idAcaoAtual').val();
	
	$('#myModal .modal-title').html("Referencia");
	
	var url = "./app/acao/refs.html";
	
	$.get( url, function( data ) {
		$('#myModal .modal-body').html( data);
		var link = $("#page-wrapper").find(".link");
		if( link ){
			var html = link.first().html();
			console.log( html );
			$('.link-content').append(html);
		}
	  });
	
	$('#myModal').modal('show');
}

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
			<textarea class="conteudo-textarea" rows="40" cols="100"></textarea>\
			  </div>';
		$('.container-fluid').append( html );
		
		var id = $('#idAcaoAtual').val();
		limpaConteudo();
		conteudo = formatXml(conteudo);
		
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
function excluiAcao(){
	if( idAcaoAtual ){
		$.post( "/acao/remove",  {idAcao:idAcaoAtual} ).done(function( json ) {
			openListaAcao();
		 });
	}
}

function moduloExclusao(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	if( idAcaoAtual ){
		var idAcao = $('#idAcaoAtual').val();
		
		$('#myModal .modal-title').html("Exclusão da ação");
		
		$('#myModal .modal-body').html("<h3>Confirma exclusão?</h3>");
		var btn = $('#myModal').find(".btn-ok");
		
		btn.show();
		
		btn.attr("onclick", "excluiAcao()");
	
		$('#myModal').modal('show');
	}else {
		console.log( idAcaoAtual );
		isAcaoDeleteModel = true;
		
		var content = $('.panel-title');
		
		var html =
	    	'\
			<button class="btn btn-default pull-right trash" type="button" onClick="removeItem(this)"><i class="fa fa-trash"></i></button>\
	    	';
		content.append( html );
	}
}
function removeItem(me){
	var p = me.parentElement.parentElement.parentElement;
	
//	if( !isAcaoEditModel ){
//		var trash = $('.trash');
//		trash.remove();
//	}
	console.log( $('.modulo-edicao') );
	$('.modulo-edicao').show();
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
function salvaRapido(){
	var nomeAcao = $('#nomeAcao');
	nomeAcao = nomeAcao.html();
	limpaConteudo();
	var html = $('#acaoContainer').html();
	
	console.log( html );
	
	return;
	
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
function salvaAcao(){
	var nomeAcao = $('#nomeAcao').val();
	var idAcao = $('#identificador').val();
	
	
	if( nomeAcao.length == 0 ){
		alert("Nome da acao deve ser informado");
		return;
	}
	var html = "";
	if( $(".row").length >0 ){ //modulo formulario
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
function salvaItem(){
	console.log('salvaItem...');
	var corpo = $('#x')[0].value;
	
	var p = itemAcaoEditado.parentElement.parentElement.parentElement;
	var titulo = $(p).find(".panel-title span");
	p = $(p).find('.panel-body');
	
	p.html( corpo );
	
	$("#panelPrincipal .fa-plus").html("Add");
	$("#panelPrincipal").find(".btn-default:first").attr("onclick","addNovoItem()");
	$("#panelPrincipal label").html("Novo item");
	
	var element = document.querySelector("trix-editor");
	element.editor.setSelectedRange([0, corpo.length ]);
    element.editor.deleteInDirection("forward");
    
    $('#myModal .modal-title').html("Conteudo modificado");
	
	$('#myModal .modal-body').html( corpo );
	titulo.html( $("#panelPrincipal #nomeItem").val() );
	$("#panelPrincipal #nomeItem").val("");
	$('#myModal').modal('show');
}
function addNovoItem(){
	var p = $("#page-wrapper").find(".col-lg-12:last");
	
	var nm = $('#nomeItem');
	var titulo = nm.val();
	var element = document.querySelector("trix-editor");
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
	        <h3 class="panel-title"><i class="fa fa-check-square-o"></i><span>'+qtd+' - '+titulo.trim()+
	        	'</span><button class="btn btn-default" type="button" onClick="showAtividade(this)"><i class="fa fa-check-square-o"></i></button>\
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
			  var url = "./base/acao/"+id+"/index.html";				
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
	itemAcaoEditado = me;
	
	console.log('isAcaoEditModel: '+isAcaoEditModel );
	var p = me.parentElement.parentElement.parentElement;
	var titulo = $(p).find(".panel-title span").html();
	
	p = $(p).find('.panel-body');
	
	if( isAcaoEditModel ){
		console.log( $("#panelPrincipal .fa-plus") );
		$("#panelPrincipal .fa-plus").html("Salva");
		$("#panelPrincipal").find(".btn-default:first").attr("onclick","salvaItem()");
		
		$("#panelPrincipal label").html("Nome do item");
		$("#panelPrincipal #nomeItem").val(titulo);
		
		
		var element = document.querySelector("trix-editor");
		var corpo = $('#x')[0].value;
		element.editor.setSelectedRange([0, corpo.length ]);
	    element.editor.deleteInDirection("forward");
		element.editor.insertHTML( p.html() );
	}else{
		
		var cn = p.attr('style');
		if( cn && cn.indexOf('none') >= 0 ){
			p.show();
		}else{
			p.hide();
		}
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
			  //var html = "<a href='#/acao' onClick=\"/*showAcao(\'"+acao.id+"\', '"+acao.nome+"'); return false;*/\"><h4>"+acao.nome+"</h4></a>";
			  var html = "<a href='#/acao/"+acao.id+"/"+acao.nome+"' onClick=\"/*showAcao(\'"+acao.id+"\', '"+acao.nome+"'); return false;*/\"><h4>"+acao.nome+"</h4></a>";
			  $( "#idAcao" ).append(html);
		  });
		}
	);
}

function showAcao(id, nomeAcao){
	idAcaoAtual = id;
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

function formatXml (xml) {
    //var reg = /(>)(<)(\/*)/g;
    var reg = /(>)\s*(<)(\/*)/g;
    var wsexp = / *(.*) +\n/g;
    var contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    var pad = 0;
    var formatted = '';
    var lines = xml.split('\n');
    var indent = 0;
    var lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    var transitions = {
        'single->single'    : 0,
        'single->closing'   : -1,
        'single->opening'   : 0,
        'single->other'     : 0,
        'closing->single'   : 0,
        'closing->closing'  : -1,
        'closing->opening'  : 0,
        'closing->other'    : 0,
        'opening->single'   : 1,
        'opening->closing'  : 0, 
        'opening->opening'  : 1,
        'opening->other'    : 1,
        'other->single'     : 0,
        'other->closing'    : -1,
        'other->opening'    : 0,
        'other->other'      : 0
    };

    for (var i=0; i < lines.length; i++) {
        var ln = lines[i];
        var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
        var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
        var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
        var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
        var fromTo = lastType + '->' + type;
        lastType = type;
        var padding = '';

        indent += transitions[fromTo];
        for (var j = 0; j < indent; j++) {
            padding += '    ';
        }

        formatted += padding + ln + '\n';
    }

    return formatted;
};