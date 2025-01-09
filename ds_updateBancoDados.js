function createDataset(fields, constraints, sortFields) {
	log.info("DEVDEBUG => #01 Start Dataset");
    var dataSource = "/jdbc/AppDS";
    var ic = new javax.naming.InitialContext();
    var ds = ic.lookup(dataSource);
    

    var myQuery = null;

    
    myQuery = "UPDATE TAR_PROCES " +
		  "SET CD_MATRICULA = '7403652' " +
		  "WHERE  NUM_PROCES = '41761' AND NUM_SEQ_MOVTO = '12'";
   
    
    try {
        log.info("##################### " + myQuery)
        var conn = ds.getConnection();
        var stmt = conn.createStatement();
//      var rs = stmt.executeQuery(myQuery);
//      var rs = stmt.execute(query);
        var rs = stmt.executeUpdate(myQuery);
        
    } catch (e) {
        log.info("DEVDEBUG => #11 ERROR DATASET: " + e.message);
    } finally {
        if (rs != null) {
            rs.close();
        }
        if (stmt != null) {
            stmt.close();
        }
        if (conn != null) {
            conn.close();
        }
    }
    return 0;
}