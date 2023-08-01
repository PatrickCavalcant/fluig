function createDataset(fields, constraints, sortFields) {
    //Cria as colunas
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("NumFormulario");
    dataset.addColumn("Unidade");
    dataset.addColumn("Contrato");
    dataset.addColumn("Servico");



    //Cria a constraint para buscar os formulários ativos
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST));

    var datasetPrincipal = DatasetFactory.getDataset("DSCadastroCliente", null, constraints, null);

    for (var i = 0; i < datasetPrincipal.rowsCount; i++) {
        var documentId      = datasetPrincipal.getValue(i, "metadata#id");
        var documentVersion = datasetPrincipal.getValue(i, "metadata#version");

        //Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
        var constraintsFilhos = new Array();
        constraintsFilhos.push(DatasetFactory.createConstraint("tablename", "tabelaItens" ,"tabelaItens", ConstraintType.MUST));
        constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
        constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));

        //Busca o dataset
        var datasetFilhos = DatasetFactory.getDataset("DSCadastroCliente", null, constraintsFilhos, null);

        for (var j = 0; j < datasetFilhos.rowsCount; j++) {
            //Adiciona os valores nas colunas respectivamente.
            dataset.addRow(new Array(
                    documentId,
                    datasetFilhos.getValue(j, "txtUnidade"), 
                    datasetFilhos.getValue(j, "txtContrato"),
                    datasetFilhos.getValue(j, "txtLinhaServico")));
        }
    }

    return dataset;
}
  