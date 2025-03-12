function defineStructure() { 
	//Cria as colunas
	addColumn("RETORNO");
    setKey(["RETORNO"]);
}

function onSync(lastSyncDate) {
	var dataset = DatasetBuilder.newDataset();

	log.info("DEVDEBUG => #01 Start Dataset");
    var dataSource = "/jdbc/AppDS";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);

    var myQuery = null;

//    myQuery = "UPDATE ML001103  " +
//		  "INNER JOIN PROCES_WORKFLOW ON ML001103.DOCUMENTID = PROCES_WORKFLOW.NR_DOCUMENTO_CARD " +
//		  "SET ML001103.STATUS = 'Fechado' " +
//		  "WHERE " +
//		  "ML001103.STATUS != 'Fechado' " +
//		  "AND PROCES_WORKFLOW.COD_DEF_PROCES = 'wf_sistema_chamados' " +
//		  "AND PROCES_WORKFLOW.STATUS = 2";
   
    myQuery = "UPDATE ML001103 SET TELEFONE = '(65) 3324-9292' WHERE DOCUMENTID = '14078'"
    	
    try {
        log.info("##################### " + myQuery)
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
//      var rs = stmt.executeQuery(myQuery);
//      var rs = stmt.execute(query);
        var rs = stmt.executeUpdate(myQuery);
		dataset.addRow(['UPDATE EXECUTADO COM SUCESSO!']);
        
    } catch (e) {
        log.error("DEVDEBUG => #11 ERROR DATASET: " + e.message);
    } finally {
		log.info("==================>FINALLY<===============");
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();

        }
    }
	return dataset;

}
