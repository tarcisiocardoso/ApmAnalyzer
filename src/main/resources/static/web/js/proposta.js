var isPropostaDeleteModel = false;

function removeProposta(me){
	console.log('>>>nao implementado<<<<', me.parentElement);
}
function moduloExclusaoProposta(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	isPropostaDeleteModel = !isPropostaDeleteModel;
	
	console.log('isPropostaDeleteModel: '+isPropostaDeleteModel);

	if( isPropostaDeleteModel ){
		var content = $('.class-proposta');
		console.log( content  );
		
		var html =
	    	'\
			<button class="btn btn-default pull-right trash" type="button" onClick="removeProposta(this)"><i class="fa fa-trash"></i></button>\
	    	';
		content.append( html );	
	}else{
		console.log('>>>>>>removendo<<<<<<<<');
		$('.trash').remove();
	}
}

function salvaNovaProposta(){
	var data = $( "#formulario" ).serialize();
	
	$.post( "/proposta",  data )
		.done(function( json ) {
		    //alert( "Data Loaded: " + data );
			console.log(json);
			
			if( json.sucesso ){
				$('#myModal .modal-title').html("Sucesso!");
			}else{
				$('#myModal .modal-title').html("Problema!");
			}
			$('#myModal .modal-body').html( json.dado);
			$('#myModal').modal('show')
	});
}

function novaProposta(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/proposta/novo.html", function( data ) {
	  $( "body" ).html( data );	  
	  montaListaComoFazer();
	});
}
function isPropostaAnaliseChecke(propostas, id){
	console.log('isPropostaAnaliseChecke', propostas);
	if( !propostas || propostas.length == 0 ) return false;
	var retorno = false;
	$.each(propostas, function(index, pro){
		console.log(pro);
		if( $(pro).attr('name') == id){
			retorno = true;
			return true;
		}
	} );
	return retorno;
}
function listaPropostaAnalise(propostas){
	var me = this;
	$.get( "app/proposta/index.html", function( data ) {
		  //$( "body" ).html( data );
		  wrapper.getPropostas(function( data ) {
			  $( ".modal-body" ).html("");
			  $.each( data, function (index, proposta){
				  var checkeName = (isPropostaAnaliseChecke(propostas, proposta.id ) )?'checked':'';
				  
				  var html = "<p><input type='checkbox' onClick='propostaEscolhida(this)' name='"+proposta.id+"\' "+checkeName+">"+proposta.nome+"</p>";
				  $( ".modal-body" ).append(html);
			  });
			}
		);
	});
}
function openListaProposta(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "app/proposta/index.html", function( data ) {
		  $( "body" ).html( data );
		  montaListaProposta();
	});
}
function showPropostaAnalise(id, component){
	var url = "./base/proposta/"+id+"/index.html";
	
	$.get( url, function( data ) {
		var div = document.createElement('div');
		div.className='panel-proposta';
		div.innerHTML = data;
		$(div).attr("name", id);
		
		$( component ).append( div );		  
	});
}
function showProposta(id){
	var url = "./base/proposta/"+id+"/index.html";
	
	$.get( url, function( data ) {
		  $( "#propostaContainer" ).html( data );		  
	});
}
function montaListaProposta(){
	wrapper.getPropostas(function( data ) {
		  console.log("-->"+data);
		  
		  $.each( data, function (index, proposta){
			  var html = "<div class='class-proposta'><a href='#' onClick=\"showProposta(\'"+proposta.id+"\'); return false\"><h4>"+proposta.nome+"</h4></a></div>";
			  console.log( '===>'+html );
			  $( "#idProposta" ).append(html);
		  });
		}
	);
}
