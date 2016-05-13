var usuario = new TUsuario;

$(document).ready(function(){
	if (usuario.isSesionIniciada()){
		getPanel();
		getMenu();
	}else{
		loadLogin();
	}
	
	function getMenu(){
		$.get("vistas/menu.html", function(resp){
			$("#menu").html(resp);
			$("body").addClass("conmenu");
			
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

});