public with sharing class bfLookup_Controller {
    @AuraEnabled 
    public static List<Object> doSearch(String queryTerm, String objectName, Boolean showImages, Boolean limitToMarket, String marketId, String marketName, String marketFieldName, Boolean useMarketId, String isActiveFieldName) {
        if (queryTerm == null || objectName == null) { return null; }
        String soql = 'SELECT Id, Name';
        String sanitizedQueryTerm = '';
        if (queryTerm != null && queryTerm.length() > 0) {
            sanitizedQueryTerm = String.escapeSingleQuotes(queryTerm);
        }

        String sanitizedObjectName = '';
        if (objectName != null && objectName.length() > 0) {
            sanitizedObjectName = String.escapeSingleQuotes(objectName);
        }
        if (showImages && objectName == 'User') {
            soql += ', FullPhotoUrl, SmallPhotoUrl ';
        }


        soql += ' FROM ' + objectName;
        soql += ' WHERE Name LIKE \'%' + queryTerm + '%\'';

        if (String.isNotEmpty(isActiveFieldName)) {
            soql += ' AND ' + isActiveFieldName + ' = TRUE';
        }
        if (limitToMarket) {
            if (useMarketId) {
                soql += ' AND ' + marketFieldName + ' = \'' + marketId + '\'';
            } else {
                soql += ' AND ' + marketFieldName + ' = \'' + marketName + '\'';
            }
        }
        System.debug('soql: ' + soql);
        List<Object> results = Database.query(soql);
        return results;
    }
}