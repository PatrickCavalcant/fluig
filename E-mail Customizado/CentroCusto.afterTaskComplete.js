function afterTaskComplete(colleagueId,nextSequenceId,userList){
    log.info('===========>AFTERTASKCOMPLETE<=============');
	var atividade = getValue("WKNumState");
	var numProcess = getValue("WKNumProces");
	
	if(atividade == 62) {
		log.info("###AFTERTASK_CENTROCUSTO###" + atividade)
//    	hAPI.setTaskComments(colleagueId, numProcess, 0, message);
	
		try{
			var params = new java.util.HashMap();
			var server = "https://fluight.spdmafiliadas.org.br:8143/";
			params.put("SERVER_URL", server);
			params.put("subject", "CENTRO DE CUSTO");
			params.put("TIPO_SOLI", hAPI.getCardValue("ccTipoSolicitacao2")); // tipo solicitação
			params.put("CENTRO_CUSTO", hAPI.getCardValue("ccCodigo")); // centro de custo
			params.put("DESCRICAO", hAPI.getCardValue("ccDescricao")); // descrição centro de custo
	        params.put("WDK_ProcessNumber", getValue("WKNumProces")); // número da solicitação
	        log.info(params);
		
			var destinatarios = new java.util.ArrayList();		
			
	        log.info("================DESTINATARIOS===============");
	
	    	var dataset = DatasetFactory.getDataset("ds_notificaCentroCusto", null, null, null); //Dataset chama grupo
	    	for (i = 0; i < dataset.rowsCount; i++) {
	    		var dsColMail = dataset.getValue(i, "EMAIL");
	    		destinatarios.add(dsColMail);
	    		log.info("=============> Destinatario: " + destinatarios);
	
	    	}
	                
	        notifier.notify("noreply", "cc_email", params, destinatarios, "text/html");
	
			
		}
		catch(e){
			log.info("==================>CATCH<===============");
			log.info(e);
		}
	}
}




