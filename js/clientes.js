function clientes(){
	$.get("vistas/clientes/panel.html", function(resp){
		$("#modulo").html(resp);
		
		getLista();
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAdd #id").val("");
		});
		
		$("#frmAdd").validate({
			debug: true,
			rules: {
				txtNombre: "required",
				txtTelefono: {
					digits: true,
					minlength: 5,
					maxlength: 12
				},
				txtEmail: {
					email: true,
				}
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			debug: true,
			messages: {
				txtEmail: {
					email: "No es un correo válido"
				},
				txtTelefono: {
					digits: "Solo números",
					minlength: "Solo números y deben ser minimamente 5",
					minlength: "Solo números y deben ser máximo 12"
				},
				txtNombre: "Este campo es necesario"
			},
			submitHandler: function(form){
				var obj = new TCliente;
				obj.add(
					$("#id").val(), 
					$("#txtNombre").val(), 
					$("#selSexo").val(),
					$("#txtTelefono").val(),
					$("#txtEmail").val(),
					$("#txtDireccion").val(),
					{
						after: function(datos){
							if (datos.band){
								getLista();
								
								$("#frmAdd").get(0).reset();
								$('.nav a[href="#lista"]').tab('show');
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	});
	
	function getLista(){
		var objUsuario = new TUsuario;
		
		$.get("vistas/clientes/lista.html", function(resp){
			$("#dvLista").html(resp);
			var plantilla = $("#dvLista").find("table tbody tr");
			$("#dvLista").find("table tbody").html("");
			
			$.post(server + 'cclientes', {
					"empresa": objUsuario.getEmpresa(),
					"action": "lista"
				}, function(clientes){
					$.each(clientes, function(){
						var cliente = this;
						var pl = plantilla.clone();
						
						
						pl.find("[campo=identificador]").html(cliente.idCliente);
						pl.find("[campo=nombre]").html(cliente.nombre);
						pl.find("[campo=telefono]").html(cliente.telefono);
						pl.find("button[action=modificar]").attr("datos", JSON.stringify(cliente)).click(function(){
							var el = jQuery.parseJSON($(this).attr("datos"));
				
							$("#id").val(el.idCliente);
							$("#txtNombre").val(el.nombre);
							$("#txtTelefono").val(el.telefono);
							$("#txtSexo").val(el.sexo);
							$("#txtEmail").val(el.email);
							$("#txtDireccion").val(el.direccion);
							
							$('.nav a[href="#add"]').tab('show');
						});
						
						pl.find("button[action=eliminar]").attr("cliente", cliente.idCliente).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TCliente;
								obj.del($(this).attr("cliente"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar la cliente");
											
										getLista();
									}
								});
							}
						});
						
						pl.find("button[action=estado]").attr("cliente", cliente.idCliente).click(function(){
							$("#winVentas").modal();
							
							$.post(server + "estadoCuenta", {
								"cliente": $(this).attr("cliente")
							}, function(html){
								$("#winVentas").find(".modal-body").html(html);
								
								$("#tblEstado").DataTable({
									"responsive": true,
									"language": espaniol,
									"paging": true,
									"lengthChange": false,
									"ordering": true,
									"info": true,
									"autoWidth": true
								});
			
							});
						});
						
						$("#dvLista table tbody").append(pl);
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
				},
				"json"
			);
		});
	}
}