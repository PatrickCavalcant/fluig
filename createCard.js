function createDataset(fields, constraints, sortFields) {
	
	var dataset = DatasetBuilder.newDataset();

	try {
		
		// Lista com os campos e valores do formulário
        var ficha = new java.util.ArrayList();
		
		// Percorre os campos e valores enviados através das contraints
		 for (i in constraints) {
			var item = constraints[i]
			var cardFieldDto = new com.fluig.sdk.api.cardindex.CardFieldVO();
			cardFieldDto.setFieldId(item.getFieldName().trim()); // Nome do campo
			cardFieldDto.setValue(item.getInitialValue()); // Valor do campo
			// Adiciona o campo no array de fichas
			ficha.add(cardFieldDto)
			
		}

		// Chama o serviço e guarda o retorno na variável result
		var result = fluigAPI.getCardAPIService().create(437, ficha)
		
		dataset.addColumn('documentId');
		dataset.addRow([result.getCardId()]);

	} catch (ex) {
		dataset = DatasetBuilder.newDataset();
		dataset.addColumn('ERRO');
		dataset.addRow([ex.toString()]);
		log.error(ex.toString())
	} finally {
		return dataset;
	}
}