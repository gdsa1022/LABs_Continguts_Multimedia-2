
$( document ).ready(function(){

	//Punt 2 practica 6
	function startTimer(durada, desplegament) {

	var inici = Date.now(),
        difer,
        minuts,
        segons;

	function timer() {
        // obté el numero de segons que han transcorregut desde que 
        // startTimer() fou trucada.
        difer = durada - (((Date.now() - inici) / 1000) | 0);

        // fa el mateix treball que 'parseInt' [trunca el float].
        minuts = (difer / 60) | 0;
        segons = (difer % 60) | 0;

        minuts = minuts < 10 ? "0" + minuts : minuts;
        segons = segons < 10 ? "0" + segons : segons;

        desplegament.textContent = minuts + ":" + segons; 

		if (difer <= 0) {
		    // afegim un segon de manera que el compte enrere comença en la durada completa.
		    // exemple 01:00, no 00:59.
		    inici = Date.now() + 1000;
		}
	    };
	    // No volem esperar un segon sencer abans que el comptador començi.
	    timer();
	    setInterval(timer, 1000);
	}

	window.onload = function () {
	    var oneMinute = 60 * 1,
		desplegament = document.querySelector('#time');
	    startTimer(oneMinute, desplegament);
	};

	// Punt 3 Práctica 6

		var imatges = ['Simbolo_COG.png','Simbolo_Locust.png'];
		var ImatgesCargades = {};
		var ArrayPromeses = imatges.map(function(imgurl){
	   	var promesa = new Promise(function(resol,refusa){
	       	var imag = new Image();
	       		imag.onload = function(){
		   	ImatgesCargades[imgurl] = imag;
		   	resol();
	       		};
	       	imag.src = imgurl;
	   	});
	   return promesa;
	});

	Promise.all(ArrayPromeses).then(ImatgesCargades);

	function render_camp(ctx){
	ctx.beginPath();
	ctx.lineWidth="5";
	ctx.strokeStyle="white";
	ctx.moveTo(300,400);
	ctx.lineTo(300,0);
	ctx.stroke();
	ctx.rect(7,7,600,400);
	ctx.fillStyle = "#F0E68C";
	ctx.fillRect(0,0,600,400);
	ctx.drawImage(ImatgesCargades['Simbolo_COG.png'],20,10,100,50);
	ctx.drawImage(ImatgesCargades['Simbolo_Locust.png'],180,10,100,50);
	}

	function nombres_equipos(ctx){
	ctx.font = "14px Arial";
	ctx.fillStyle = "#2F4F4F";
	ctx.textAlign="left";
	ctx.fillText("COG Team",20,80);
	ctx.textAlign="right";
	ctx.fillText("Locust Team",280,80);
	}

	// Punt 4 Práctica 6
	var Marcador = function() {
		this.color_nums = "#FF0000";
		this.pos_num_i = {x:50, y:140};
		this.pos_num_d = {x:250, y:140};
		this.font_nums = "12px Lucida Console";
	}

	function goles(campo) {
		if (campo == "Izquierda") {
			num_d++;
		}
		else  {
			num_i++;
		}
	}
	
	Marcador.prototype.render = function(ctx) {
		ctx.fillStyle = this.color_nums;
		ctx.font = this.font_nums;
		ctx.textAlign="left";
		ctx.fillText(num_i,this.pos_num_i.x,this.pos_num_i.y);
		ctx.textAlign="right";
		ctx.fillText(num_d,this.pos_num_d.x,this.pos_num_d.y);	
	}
	
	// Punt 5 Práctica 6
	var Pala = function(x_start,y_end){
	this.color_pala = "#696969"; 
	this.position ={x:x_start,y:0};
	this.size = {w:3, h:30};
	this.y_end = y_end;
	};
	Pala.prototype.render = function(ctx){
		ctx.fillStyle = this.color_pala;
		ctx.fillRect(	this.position.x, 
				this.position.y,
				this.size.w,
				this.size.h);
	};  
	Pala.prototype.goUp = function() {
		if(this.position.y >= 0) this.position.y -= 5;
	}
	Pala.prototype.goDown = function() {
		if(this.position.y+this.size.h <= this.y_end) this.position.y += 5;
	}
	Pala.prototype.setKeys = function(keyUp,keyDown){
		var _this = this;
		$(window).keydown(function(event) {
		//console.log("Key pressed is: "+event.which);
		if (event.which == keyUp) {
			_this.goUp();
		}else if(event.which == keyDown){
			_this.goDown();
		}
	    });
	}

	var Bola = function (start_pos_x,start_pos_y,angle) {  // --> Afegir com a paràmetres canvas.width i canvas.height
		this.position = {x:start_pos_x,y:start_pos_y};
		this.color_bola = "#FFFFFF";
		this.size = {w:5,h:5};
		this.angle = 90;
	}
	Bola.prototype.render = function(ctx) {
		ctx.fillStyle = this.color_bola;
		ctx.fillRect(	this.position.x,
				this.position.y,
				this.size.w,
				this.size.h);
	}
	function updateBola(){	
		if(bola.position.y < 0) {
			bola.angle -=180.0;
		} 
		else if(bola.position.y+bola.size.h > canvas.height) {
			bola.angle -=180.0;
		}
		
		else if(bola.position.x <= pala_L.position.x+pala_L.size.w && bola.position.y <= pala_L.position.y+pala_L.size.h){
			bola.angle -=180.0;
		}
		else if(bola.position.x >= pala_R.position.x+pala_R.size.w && bola.position.y <= pala_R.position.y+pala_R.size.h){
			bola.angle -=180.0;
		}
		else if (bola.position.x + bola.size.w < 0) { 
			goles("Derecha"); 
			bola = new Bola(canvas.width/2, canvas.height/2, 65); 
		} 
		else if (bola.position.x > canvas.width){ 
			goles("Izquierda"); 
			bola = new Bola(canvas.width/2, canvas.height/2, 20); 
		}	
		bola.position.x += Math.sin(bola.angle*Math.PI/180.0)*5;
		bola.position.y += Math.cos(bola.angle*Math.PI/180.0)*5;	
	}

	var canvas = document.getElementById("mycanvas");
	var ctx = canvas.getContext("2d");
	var pala_L = new Pala(10,canvas.height);
	var pala_R = new Pala(canvas.width-20,canvas.height);
	pala_L.setKeys(81,65); // Tecles Q i A
	pala_R.setKeys(69,68); // Tecles E i D
	var bola = new Bola(canvas.width/2,canvas.height/2);
	var scorer = new Marcador();
	
	// Funció 'render' on incorporem tots els punts de la práctica.
	function render(){
	updateBola();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	render_camp(ctx);
	nombres_equipos(ctx);
	pala_L.render(ctx);
	pala_R.render(ctx);
	bola.render(ctx);
	scorer.render(ctx);
        };

	setInterval(render,100);
});
