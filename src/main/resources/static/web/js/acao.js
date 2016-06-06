function comoFazer(me){
	console.log('.....');
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
                 <h1>Siga os passoa a seguir para intalar</h1>\
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

function showAtividade(me){
	console.log('.....');
	var nodes = me.parentElement.parentElement.parentElement.childNodes;
	
	var i=0;
	for(i=0; i< nodes.length; i++){
		if( nodes[i].className == "panel-body" ){
			p = nodes[i] 
		}
	}
	console.log( p );
	var cn = p.lastChild.className
	if( cn == 'panel-body'){
		console.log('remover...');
		p.removeChild(p.lastChild);
	}else{
		var div = document.createElement('div');
		div.className = 'panel-body';
		
		var html =
	    	'\
             <strong>Buscar senarios que peguem o nucleo da aplicação, na maxima dos 20% que representa 80% mais usado</strong>\
             <ul>\
               <li>Assim mesmo, o entendimento das metas propostas talvez venha a ressaltar a relatividade do sistema de formação de quadros que corresponde às necessidades.</li>\
               <li>pontos bbb</li>\
               <li>pontos ccc<button class="btn btn-default" type="button" onClick="comoFazer(this)"><i class="fa fa-life-ring"></i></button></li>\
             </ul>\
	    	';
            
        div.innerHTML = html; 
	    p.appendChild(div);
	}
}

function openListaAcao(){
	$("nav").removeClass( "cbp-spmenu-open" );
	$("body").removeClass( "cbp-spmenu-push-toleft" );
	
	$.get( "acao.html", function( data ) {
		  $( "body" ).html( data );
		  
		  montaListaAcao();
		  
		});
}

function montaListaAcao(){
	wrapper.getAcoes(function( data ) {
		  console.log("-->"+data);
		  
		  $.each( data, function (index, acao){
			  var html = "<a href='#' onClick=\"showAcao(\'"+acao.id+"\'); return false\"><h4>"+acao.nome+"</h4></a>";
			  console.log( '===>'+html );
			  $( "#idAcao" ).append(html);
		  });
		}
	);
}

function showAcao(id){
	var url = "./acao/"+id+"/index.html";
	console.log(url);
	$.get( url, function( data ) {
		  $( "#acaoContainer" ).html( data );		  
	});
}