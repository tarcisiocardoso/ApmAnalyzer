/**
 * statusDraw:
 * 0 - veiw arvore
 * 1 - popumenu
 * 2 - Quadrado de seleção
 */
var mm = {
	valor: 'Teste',
	canvas: null,
	ctx: null,
	nodes: [],
	currentNode: null,
	raf: null,
	isDrag: false,
	isMouseDown: false,
	isEditMode: true,
	dragX: 0,
	dragY: 0,
	popX: 0,
	popY: 0,
	popItem: 0,
	popW: 0,
	popH: 50,
	mousePos: null,
	statusDraw: 0, //0 - normal
	flag: false,
	flagNodeLeft: true,
	flagDebug: false,
	time: 0,
	clicktime: 0,
	outBoundary: 0,
	
	addNewNode:function(pai) {
		var me = this;
		var node = {
			x:450,
			y:100,
			w: 60,
			h: 35,
			borderLine: 1,
			selected: false,
			txt: 'Papel',
			html: null,
			pai: pai,
			hide: false,
			nodes:[],
			drawLine: function(){
				if( node.hide ) return;
				me.ctx.beginPath();
				
				if( this.pai ){
					var cpx1 = this.x; //Math.abs((this.pai.x + this.y))/2;
					var cpy1 = this.y; //Math.abs((this.pai.y + this.y))/2;
					var cpx2 = cpx1; //this.pai.x /2;
					var cpy2 = cpy1; //this.pai.y / 2;
					var curvax = 0;//(this.pai.x - this.x)/2;
					var curvay = 0;//(this.y - this.pai.y)/2;
					me.ctx.beginPath();
					me.ctx.lineWidth= this.borderLine;
					me.ctx.moveTo(this.pai.x+ (this.pai.w/2), this.pai.y + (this.pai.h/2));
					//me.ctx.bezierCurveTo(cpx1+curvax,cpy1+curvay,cpx2,cpy2, this.x + (this.w/2), this.y+(this.h/2));
					me.ctx.lineTo( this.x + (this.w/2), this.y+(this.h/2) );
					me.ctx.stroke();
				}
				me.ctx.closePath();
			},
			draw : function() {
				if( this.hide ) return;
				
				me.ctx.font = '18pt Calibri';
				
				this.w = me.ctx.measureText(this.txt).width+20;
				
				me.ctx.beginPath();
				if( node.pai == null ){
					me.ctx.fillStyle = 'gray';
				}else if( node.nodes.length == 0 ){
					me.ctx.fillStyle = 'green';
				}else{
					me.ctx.fillStyle = 'blue';
				}
				me.ctx.lineWidth= this.borderLine;
				
				me.ctx.fillRect( this.x, this.y, this.w, this.h );
				
				me.ctx.fillStyle = 'black';
				if( this.selected ){
					me.ctx.fillStyle = 'gray';
					me.ctx.lineWidth= 3;
				}
				me.ctx.fillText(this.txt, this.x+5, this.y+(this.h/2)+2);

				if( me.flagDebug ){
					me.ctx.font = '8pt Calibri';
					me.ctx.fillText("["+parseInt(this.x)+", "+ parseInt(this.y)+"]", this.x-15, this.y-5);
					me.ctx.fillText("["+parseInt((this.x+this.w))+", "+parseInt((this.y+this.h))+"]", this.x+45, this.y+45);
				}

				//me.ctx.strokeStyle="darkgray";

				me.ctx.rect(this.x/*-5*/, this.y /*- (this.h/2+5)*/, this.w, this.h);
				me.ctx.stroke();

				me.ctx.closePath();
				//me.ctx.fillStyle = this.color;
			}
		}
		node.pai = pai;
		if( pai ){
			node.txt = 'Ativ';
			pai.nodes.push( node );
		}else{
			node.txt = 'Papel';
		}
		this.montaNodePos(node);
		
		this.nodes.push(node);
		return node;
	},
	
	montaNodePos:function(no){
		if( no.pai){
			var pulo = 60;
			if(!no.pai.pai){
				if(this.flagNodeLeft){
					no.x = no.pai.x +(pulo+no.pai.w);// - (no.w/2);
				}else{
					no.x = no.pai.x - (pulo+no.w);
				}
				this.flagNodeLeft = !this.flagNodeLeft;
			}else{
				if( no.pai.x > no.pai.pai.x ){
					no.x = no.pai.x + (pulo+no.w);
				}else{
					no.x = no.pai.x - (no.w + pulo);
				}
			}
			no.y = no.pai.y;
		}else{
			no.x = this.canvas.width/2 - (no.w/2);
			no.y = this.canvas.height/2 - (no.h/2);
		}
		if( no.x+no.w > this.canvas.width ){
			this.outBoundary = -3;
		}else if( no.x+no.w < 0 ){
			this.outBoundary = +3;
		}
	},
	checkPopItem: function(){
		var pos = this.mousePos;
		if( pos.x > this.popX && pos.y+15 > this.popY && pos.x < (this.popX+this.popW) && pos.y < (this.popY +this.popH) ){
			
			//document.getElementById("myP").style.cursor = "pointer";
			this.canvas.style.cursor = "pointer";
			
			var h1 = this.popH;//(this.popY-this.popH);
			var h2 = (this.popY+ this.popH) - pos.y;
			return parseInt( (h1/h2)+0.6 );
		}else{
			this.canvas.style.cursor = "default";
		}
		return 0;
	},
	checkInside: function(){
		var pos = this.mousePos;
		var nodes = this.nodes;
		var i=0;
		for(i=0; i< this.nodes.length; i++){
			var node = nodes[i];
			if( pos.x > node.x && pos.y > node.y && pos.x < (node.x+node.w) && pos.y < (node.y+node.h)){
				return node;
			}
		}
		return null;
	},
	setAllBorderLine: function(no){
		no.borderLine = 6;
		if( no.pai != null ){
			this.setAllBorderLine(no.pai);
		}
	},
	make:function(){
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		var me = this;
		canvas.addEventListener('mousemove', function(e) {
			me.mousePos = me.getMousePos(e);
			if ( me.flagDebug ){
				me.posXY();
			}
			if( me.statusDraw == 0 ){
				if(!me.isDrag){
					me.currentNode = me.checkInside();
				}
			}else if( me.statusDraw == 1 ){
				me.popItem = me.checkPopItem();
			}
		}, false);
		this.canvas.addEventListener('mouseover', function(e) {
			me.raf = window.requestAnimationFrame(draw);
		});
		
		this.canvas.addEventListener('keypress', function(e) {
			if( e.keyCode == 127 ){
				if( me.currentNode ){
					me.removeNo( me.currentNode );
				}
			}
		});
		
		this.canvas.addEventListener("mouseout", function(e) {
			window.cancelAnimationFrame(me.raf);
			me.isDrag= false;
		});
		this.canvas.addEventListener("mousedown", function(e) {
			if( me.time - me.clicktime < 300 ){
				me.doubleClick();
				return;
			}
			me.clicktime = me.time;
			if(e.button === 0){
				if(me.statusDraw == 1 ){
					me.popupClick();
				}
				
				if( me.statusDraw != 2){
					me.statusDraw = 0;
				}
				var pos = me.mousePos;
				var i=0;
				for(i=0; i< me.nodes.length; i++){
					var no1 = me.nodes[i];
					if (no1.selected ) {
						no1.drag = {
								x: pos.x - no1.x, y: pos.y - no1.y
						}
					}
				}
				if( !me.isDrag && me.currentNode){
					me.dragX = (pos.x - me.currentNode.x);
					me.dragY = (pos.y - me.currentNode.y);
				}else if( !me.isMouseDown ){
					me.dragX = (pos.x);
					me.dragY = (pos.y);
				}
				me.isDrag = true;
				me.isMouseDown = true;
		    }
			if( me.statusDraw == 2 ){
				if( me.checkInside() == null ){
					me.statusDraw = 0;
				}
			}
		});
		this.canvas.addEventListener("mouseup", function(e) {
			if( me.isMouseDown && me.currentNode == null ){
				me.marcaNodeInside();
			}else{
				for(i=0; i< me.nodes.length; i++){
					var no1 = me.nodes[i];
					no1.selected = false;
				}
			}
			me.isDrag= false;
			me.isMouseDown = false;
		});
		this.canvas.oncontextmenu = function (e) {
		    e.preventDefault();
		    if( !me.currentNode ){
		    	me.statusDraw = 0;
		    	return;
		    }
		    me.statusDraw = 1;
		    var pos = me.getMousePos(e);
		    me.popX =pos.x;
		    me.popY =pos.y;
		};
		this.collisionAnimate();
		
	},
	marcaNodeInside:function(){
		var pos = this.mousePos;
		var rect1 = {x: this.dragX, y: this.dragY, width: pos.x - this.dragX, height: pos.y - this.dragY};
		if( rect1.width < 0 ){
			rect1.x = rect1.x + rect1.width;
			rect1.width = -1 * rect1.width;
		}
		if( rect1.height < 0 ){
			rect1.y = rect1.y + rect1.height;
			rect1.height = -1 * rect1.height;
		}
		console.log( rect1 );
		
		for(i=0; i< this.nodes.length; i++){
			var no1 = this.nodes[i];
			no1.selected = false;
			var rect2 = {x: no1.x-5, y: no1.y-5, width: no1.w+5, height: no1.h+5};
			if (rect1.x < rect2.x + rect2.width &&
					   rect1.x + rect1.width > rect2.x &&
					   rect1.y < rect2.y + rect2.height &&
					   rect1.height + rect1.y > rect2.y) {
				no1.selected = true;
			}
		}
		
	},
	
	doubleClick: function(){
		if( this.currentNode ){
			this.showDetalhe();
		}
	},
	collisionAnimate: function(){
		var me = this;
		var i=0, j=0;
		for(i=0; i< this.nodes.length; i++){
			var no1 = this.nodes[i];
			if( no1.hide ) return;
			for(j=i+1; j < this.nodes.length; j++){
				var no2 = this.nodes[j];
				if( no2.hide ) return;
				var rect1 = {x: no1.x-5, y: no1.y-5, width: no1.w+5, height: no1.h+5}
				var rect2 = {x: no2.x-5, y: no2.y-5, width: no2.w+5, height: no2.h+5}
				
				if (rect1.x < rect2.x + rect2.width &&
						   rect1.x + rect1.width > rect2.x &&
						   rect1.y < rect2.y + rect2.height &&
						   rect1.height + rect1.y > rect2.y) {
					
					this.reajustaNo(no1, no2);
				}
				
			}
		}
	},
	reajustaNo: function(no1, no2){
		if( no1.pai == no2 ){
			if( no1.x < no1.pai.x){
				d1 = 3;
			} else{
				d1 = -3;
			}
			no1.x = no1.x + d1;
			return;
		}else if( no2.pai == no1 ){
			if( no2.x < no2.pai.x){
				d1 = -3;
			}else{
				d1 = 3;
			}
			no2.x = no2.x + d1;
			return;
		}
		
		if( !no1.pai) return;
		
		var d1= 3; d2=-3;
		if( no1.pai.y < no2.pai.y ){
			d1=-3;
			d2=3;
		}
		
		no1.y = no1.y + d1;
		no2.y = no2.y + d2;
		
		var i = 0;
		no1.pai.y = no1.pai.y + d1/2;
		no2.pai.y = no2.pai.y + d2/2;
		if( this.isDrag) return;
		
		for(i=0; i< no1.nodes.length; i++){
			var no = no1.nodes[i];
			no.y = no.y+d1;
		}
		
		for(i=0; i< no2.nodes.length; i++){
			var no = no2.nodes[i];
			no.y = no.y+d2;
		}
	},
	
	init: function(){
		var me = this;
		if( this.nodes.length == 0 ){
			this.addNewNode();
		}
		var i=0;
		for(i=0; i< this.nodes.length; i++){
			this.nodes[i].draw();
		}
	},
	exec: function(){
		this.time = Date.now();
		var me = this;
		if( this.nodes.length == 0 ){
			this.addNewNode();
		}
		if(this.flagDebug ){
			this.ctx.clearRect(0, 0, canvas.width, canvas.height-20);
		}else{
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		}


		var i=0;
		for(i=0; i< this.nodes.length; i++){
			this.nodes[i].drawLine();
		}
		for(i=0; i< this.nodes.length; i++){
			this.nodes[i].borderLine = 1;
			if(me.currentNode == this.nodes[i] ){
				me.setAllBorderLine( me.currentNode );
				if( me.isDrag ){
					if( me.currentNode  ){
						var pos = me.mousePos;
						me.currentNode.x = pos.x- me.dragX;//pos.x + (me.currentNode.x - pos.x);
						me.currentNode.y = pos.y- me.dragY;//pos.y + (me.currentNode.y - pos.y );
					}
				}
			}else if( this.nodes[i].selected ){
				if( me.isDrag ){
					var pos = me.mousePos;
					this.nodes[i].x =  (pos.x - this.nodes[i].drag.x);
					this.nodes[i].y =  (pos.y - this.nodes[i].drag.y);
				}
			}
			this.nodes[i].draw();
		}
		
		
		if( this.statusDraw ==1){
			this.popupMenuDraw();
		}
		if( this.outBoundary  != 0){
			var max = this.canvas.width;
			var min = 0;
			for(i=0; i< this.nodes.length; i++){
				var no1 = this.nodes[i];
				if( max < (no1.x+no1.w)){
					max = no1.x+no1.w;
				}
				if( min > (no1.x) ){
					min = no1.x;
				}
				no1.x = no1.x + this.outBoundary;
			}
			if( max <= this.canvas.width && min >= 0){
				this.outBoundary = 0;
			}
			if( this.outBoundary < 0 && min < 0){
				this.outBoundary = 0;
			}
			if( this.outBoundary > 0 && max > this.canvas.width){
				this.outBoundary = 0;
			}
			
		}
		me.collisionAnimate();
		if( me.isMouseDown && me.currentNode == null){
			var pos = me.mousePos;
			me.ctx.beginPath();
			me.ctx.rect(me.dragX, me.dragY, pos.x - me.dragX, pos.y- me.dragY);
			me.ctx.stroke();
			me.ctx.closePath();
		}
		
	},
	
	popupMenuDraw: function (){
		var pos = this.mousePos;
		var txt = "Nova atividade";
		this.ctx.font = '12pt Calibri';
		if( this.popItem == 1){
			this.ctx.font = '14pt bold Calibri';
		}
		
		this.popW = this.ctx.measureText(txt).width+20;
		
		this.ctx.beginPath();
		this.ctx.lineWidth="1";
		this.ctx.fillStyle="darkgray";
		this.ctx.rect(this.popX, this.popY-20, this.popW, this.popH);
		this.ctx.fill();
		
		this.ctx.fillStyle = 'black';
		this.ctx.fillText(txt, this.popX, this.popY);
		if( this.popItem == 2){
			this.ctx.font = '14pt bold Calibri';
		}else{
			this.ctx.font = '12pt Calibri';
		}
		this.ctx.fillText("Colapsar", this.popX, this.popY+25);
		
		if( !this.flag){
			this.flag = true;
		}
	},
	popupClick: function(){
		if( this.popItem == 2){
			this.hideFilho( this.currentNode );
		}else if( this.popItem == 1){
			this.addNewNode( this.currentNode );
		}
	},
	removeNo: function(node){
		if( node.pai == null ){
			$('#myModal .modal-title').html("Não pode remover nó.");
			$('#myModal .modal-body').html("Nó raiz não pode ser removido");
			
			
			$('#myModal').modal('show');
			return;
		}
		
		var i=0, index=-1;
		for(i=0; i< this.nodes.length; i++){
			if( this.nodes[i] == node ){
				index = i;
				break;
			}
		}
		if( index > 0 ){
			for(i=0; i< node.nodes.length; i++){
				this.removeNo(node.nodes[i] );
			}
			node.nodes = [];
			this.nodes.splice( index, 1 );
		}
	},
	
	hideFilho: function( no){
		var i=0;
		for(i=0; i< no.nodes.length; i++){
			no.nodes[i].hide = !no.nodes[i].hide;
			if( no.nodes[i].nodes.length > 0 ){
				this.hideFilho(no.nodes[i]);
			}
		}
	},
	getMousePos: function (evt) {
		var rect = this.canvas.getBoundingClientRect();
		return {
			x : evt.clientX - rect.left,
			y : evt.clientY - rect.top
		};
	},
	posXY: function() {
		var pos = this.mousePos;
		var x = this.canvas.width-55, y = this.canvas.height -5;
		this.ctx.clearRect(x, y-20, this.canvas.width, this.canvas.height);
		//this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ctx.font = '10pt Calibri';
		this.ctx.fillStyle = 'black';
		var text = "["+pos.x+","+pos.y+"]";
		this.ctx.fillText(text, x, y);
	},
	showDetalhe: function(){
		$('#detalheModal .modal-title').html( this.currentNode.txt );
		
		if( this.isEditMode ){
			$('#detalheModal #view-container').hide();
			$('#detalheModal #formulario').show();
			$('#detalheModal #nodeName').val( this.currentNode.txt );
			
			var element = document.querySelector("trix-editor");
			element.editor.setSelectedRange([0, element.editor.getDocument().toString().length ]);
			element.editor.deleteInDirection("backward");
			
			element.editor.setSelectedRange([0, element.editor.getDocument().toString().length ]);
		    element.editor.deleteInDirection("forward");
			if( this.currentNode.html != null ){
				element.editor.insertHTML( this.currentNode.html );
			}

			
		}else{
			$('#formulario').hide();
			$('#detalheModal #view-container').html( this.currentNode.html);
			$('#detalheModal #view-container').show();
		}
		$('#detalheModal').on('shown.bs.modal', function () {
			$('#detalheModal #nodeName').focus();
		})  
		
		$('#detalheModal').modal('show');
		
		
	},
	atualizaNo: function(){
		this.currentNode.txt = $('#detalheModal #nodeName').val();
		this.currentNode.html = $('#detalheModal #x')[0].value;
	},
	
	montaArvore: function(node){
		var itens = [];
		var i =0;
		for(i=0; i< node.nodes.length; i++){
			var no = node.nodes[i];
			itens.push({
				nome: no.txt,
				x: no.x,
				y: no.y,
				html: no.html,
				filhos: this.montaArvore(no)
			});
		}
		return itens;
	},
	getNome: function(){
		var root = null;
		var i = 0;
		for(i=0; i< this.nodes.length; i++){
			var no = this.nodes[i];
			if( no.pai == null ){
				root = no;
				break;
			}
		}
		return root.txt;
	},
	getMMJson:function(){
		var itens = [];
		var root = null;
		var i = 0;
		for(i=0; i< this.nodes.length; i++){
			var no = this.nodes[i];
			if( no.pai == null ){
				root = no;
				break;
			}
		}
		itens.push({
			nome: no.txt,
			x: no.x,
			y: no.y,
			html: no.html,
			filhos: this.montaArvore(root)
		});
		
		var js = JSON.stringify( itens );
		return js;
	},
	novo: function(){
		this.nodes = [];
		
		this.addNewNode();
		
		this.exec();
	},
	open: function(json){
		this.nodes = [];
		var item = JSON.parse(json);
		if (item.length > 0 ){
			var novo = this.addNewNode();
			
			this.parseItens(item[0], novo);
		}
		this.exec();
	},
	parseItens: function(item, no){
		no.txt = item.nome;
		no.x = item.x;
		no.y = item.y;
		no.html = item.html;
		var i=0;
		for(i=0; i< item.filhos.length; i++){
			var node = item.filhos[i];
			var novo = this.addNewNode();
			novo.pai = no;
			no.nodes.push(novo);
			this.parseItens(node, novo);
		}
	}
}
function draw() {	
	mm.exec();
	mm.raf = window.requestAnimationFrame(draw);
}