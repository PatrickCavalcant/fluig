function createDataset(fields, constraints, sortFields) { 
	var dataset = DatasetBuilder.newDataset(); 
	dataset.addColumn('retorno'); 
	
	try {
	    // Obtém o serviço de usuário
	    var userService = fluigAPI.getUserService();
	    
	    // Busca o usuário pelo login
	    var user = userService.getUser("LOGIN"); 
	    
	    // Atualiza os campos extras (ExtraData)
	    user.setExtraData("UserProjects", "PROJETO");

	    // Salva as alterações
	    userService.updateUser(user);
	    
	    log.info("Campos extras atualizados com sucesso!");
	    
	} catch(e) {
	    log.error("Erro ao atualizar ExtraData: " + e.message);
	}
	
	dataset.addRow([user.getExtraData("UserProjects")]); 
	return dataset;
}