var usuario = new TUsuario;

$(document).ready(function(){
	if (usuario.isSesionIniciada()){
		getPanel();
		getMenu();
		
		checkSuscripcion();
	}else{
		loadLogin();
	}
	
	function getMenu(){
		$.get("vistas/menu.html", function(resp){
			$("#menu").html(resp);
			$("body").addClass("conmenu");
			
			$("#fotoPerfil").attr("src", server + "repositorio/imagenesUsuarios/img_" + usuario.getId() + ".jpg?" + Math.random());
			
			$("#menuPrincipal a").click(function(){
				$('#menuPrincipal').parent().removeClass("in");
				$('#menuPrincipal').parent().attr("aria-expanded", false);
			});
			
			var objUsuario = new TUsuario;
			
			$("[vista=nombreUsuario]").html(objUsuario.getNombre());
			
			$("#menuPrincipal [liga=miEmpresa]").click(function(){
				miEmpresaPanel();
			});
			
			$("#menuPrincipal [liga=usuarios]").click(function(){
				usuarios();
			});
			
			$("#menuPrincipal [liga=categorias]").click(function(){
				categorias();
			});
			$("#menuPrincipal [liga=productos]").click(function(){
				productos();
			});
			
			$("#menuPrincipal [liga=clientes]").click(function(){
				clientes();
			});
			
			$("#menuPrincipal [liga=ventas]").click(function(){
				ventas();
			});
			
			$("#menuPrincipal [liga=pedidos]").click(function(){
				pedidos();
			});
			
			//Opciones del menú
			$("#menuPrincipal [liga=salir]").click(function(){
				if(confirm("¿Seguro?")){
					objUsuario.logout({
						after: function(){
							location.reload(true);
						}
					});
				}
			});
			
			
			$("#fotoPerfil").click(function(){
				if (navigator.camera != undefined){
					navigator.camera.getPicture(function(imageData) {
							$("#fotoPerfil").attr("src", imageData);
							subirFotoPerfil(imageData);
						}, function(message){
							alert("Ocurrió un error al subir la imagen");
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
					        }, 5000);
						}, { 
							quality: 20,
							destinationType: Camera.DestinationType.FILE_URI,
							targetWidth: 250,
							targetHeight: 250,
							allowEdit: true
						});
				}else{
					console.log("No se pudo inicializar la cámara");
				}
			});
		});
	}
	
	function getPanel(){
		$.get("vistas/panel.html", function(resp){
			$("#modulo").html(resp);
			
			$.post(server + "panelPrincipal_JSON", {
				"empresa": usuario.getEmpresa()
			}, function(resp){
				$("[campo=montoVentas]").html(resp.montoVentas);
				$("[campo=pagosVentas]").html(resp.pagosVentas);
				$("[campo=saldoVentas]").html(resp.saldoVentas);
				$("[campo=totalClientes]").html(resp.totalClientes);
				$("[campo=anio]").html(resp.anio);
				
				$("[campo=mensajePedidos]").html(resp.ventasPedidos == 0?"Todos los artículos ya fueron entregado":("Tienes "+ resp.ventasPedidos + " ventas sin entregar"));
					
			}, "json");
			
			var objVenta = new TVenta;
			objVenta.getHistorial("",{
				after: function(result){
					var datos = new Array();
					datos = [["Dia", "Ventas totales"]];
					
					$.each(result, function(i, v){
						datos.push(new Array(v.dia, parseFloat(v.total)));
					});
					
					console.log(datos);
				
					google.charts.load('current', {'packages':['corechart']});
					google.charts.setOnLoadCallback(function(){
						var data = google.visualization.arrayToDataTable(datos);
		
						var options = {
							title: '',
							hAxis: {title: 'Dia',  titleTextStyle: {color: '#333'}},
							vAxis: {minValue: 0}
						};
		
						var chart = new google.visualization.AreaChart($('#chart_div')[0]);
						chart.draw(data, options);
					});
				}
			});
		});
	}
	
	function subirFotoPerfil(imageURI){
		var usuario = new TUsuario;
		var options = new FileUploadOptions();
		
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";
		
		var params = new Object();
		params.identificador = usuario.getId();
		
		options.params = params;
		
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(server + "?mod=cusuarios&action=uploadImagenPerfil"), function(r){
				console.log("Code = " + r.responseCode);
		        console.log("Response = " + r.response);
		        console.log("Sent = " + r.bytesSent);
		        
		        alert("La fotografía se cargó con éxito");
			}, function(error){
		        alert("No se pudo subir la imagen al servidor " + error.target);

			    console.log("upload error source " + error.source);
			    console.log("upload error target " + error.target);
			}, options);
	}
	
	function checkSuscripcion(){
		$.post(server + "cempresa", {
			"action": "getSuscripcion",
			"id": usuario.getId()
		}, function(resp){
			if (resp.band == "true"){
				console.log("Suscripcion OK");
				setTimeout(checkSuscripcion, 360000);
			}else{
				navigator.app.loadUrl('http://cventas.cpymes.com.mx/planes', { openExternal:true });
				usuario.logout();
			}
		}, "json");
	}
});