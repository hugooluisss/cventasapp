function ventas(){
	$.get("vistas/ventas/panel.html", function(resp){
		$("#modulo").html(resp);
		
		$("#frmAdd #txtFecha").datepicker( "option", "dateFormat", "yyyy-mm-dd" );
		$("#frmAddPago #txtFecha").datepicker( "option", "dateFormat", "yyyy-mm-dd" );
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAddProductos")[0].reset();
			$("#frmAdd #id").val("");
			var fecha = new Date;
			
			$("#frmAdd #txtFecha").val(fecha.getFullYear() + '-' + fecha.getMonth() + '-' + fecha.getDay());
			showDetalle();
		});
		
		$("#btnBuscarClientes").click(function(){
			$.get("vistas/ventas/listaClientes.html", function(plt){
				$("#winClientes .modal-body").html(plt);
				var plantilla = $("#winClientes .modal-body").find("table tbody tr");
				$("#winClientes .modal-body").find("table tbody").html("");
				
				$.post(server + 'cclientes', {
					"empresa": usuario.getEmpresa(),
					"action": "lista"
				}, function(clientes){
					$.each(clientes, function(){
						var cliente = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=nombre]").html(cliente.nombre);
						
						pl.find("button[action=seleccionar]").attr("datos", JSON.stringify(cliente)).click(function(){
							var el =  jQuery.parseJSON($(this).attr("datos"));
					
							$("#txtCliente").val(el.nombre);
							$("#txtCliente").attr("idCliente", el.idCliente);
							$("#winClientes").modal("hide");
						});
						
						$("#winClientes .modal-body table tbody").append(pl);
					});
					
					$("#tblClientes").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true
					});
				}, "json");
			});
			
			$("#winClientes").modal();
		});
		
		
		$("#frmAdd").validate({
			debug: false,
			rules: {
				txtFecha: "required",
				txtCliente: "required"
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			submitHandler: function(form){
				var obj = new TVenta;
				obj.guardar(
					$("#id").val(), 
					$("#txtCliente").attr("idCliente"), 
					$("#selPagos").val(),
					$("#txtFecha").val(),
					{
						before: function(){
							$("#frmAdd").prop("disabled", true);
						},
						after: function(datos){
							$("#frmAdd").prop("disabled", false);
							
							if (datos.band){
								alert("Listo... puedes ingresar los artículos vendidos");
								$("#frmAdd #id").val(datos.id);
								showDetalle();
								getLista();
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	    
	    function showDetalle(){
			if($("#frmAdd #id").val() == ''){
				$("#frmAddProductos").hide();
				$("#frmAddProductos").hide();
				$("#lstMovimiento").hide();
			}else{
				$("#frmAddProductos").show();
				$("#lstMovimiento").show();
				getListaMovimientos();
			}
		}
		
		function getListaMovimientos(){
			$.get("vistas/ventas/listaMovimientos.html", function(html){
				//{"venta": $("#frmAdd #id").val()}
				$("#lstMovimiento").html(html);
				
				$("#lstMovimiento [action=eliminar]").click(function(){
					if(confirm("¿Seguro?")){
						var obj = new TVenta;
						obj.delMovimiento($(this).attr("movimiento"), {
							after: function(data){
								if (data.band == false)
									alert("Ocurrió un error al eliminar el artículo");
								getListaMovimientos();
							}
						});
					}
				});
				
				$("#tblMovimientos").DataTable({
					"responsive": true,
					"language": espaniol,
					"paging": false,
					"lengthChange": false,
					"ordering": true,
					"info": true,
					"autoWidth": true
				});
			});
			
			getLista();
		}
	});
}