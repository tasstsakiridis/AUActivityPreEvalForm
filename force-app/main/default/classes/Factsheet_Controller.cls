public class Factsheet_Controller {

    public static String getCustomLabel(String labelName) {
        Component.Apex.OutputText output = new Component.Apex.OutputText();
		output.expressions.value = '{!$Label.' + labelName + '}';
	    return String.valueOf(output.value);        
    }
    
    @AuraEnabled
    public static String getLabelForObject(String objectName, Boolean plural) {
        System.debug('[getObjectLabel] objectName: ' + objectName);
        System.debug('[getObjectLabel] plural: ' + plural);
        String lbl = '';
        if (objectName != null && objectName.length() > 0) {
	        if (plural == null) { plural = false; }
            Map<String, Schema.SObjectType> m_Schemas = Schema.getGlobalDescribe();
            if (m_Schemas.containsKey(objectName)) {
                if (plural == true) {
	                lbl = m_Schemas.get(objectName).getDescribe().getLabelPlural();                    
                } else {
	                lbl = m_Schemas.get(objectName).getDescribe().getLabel();                    
                }
            } else if (objectName == 'SalesProposal') {
                lbl = Label.SalesProposal; 
            } else {
                System.debug('[getObjectLabel] cannot find ' + objectName + ' in global describe');
            }
        }
        
        return lbl;
    }
    
    @AuraEnabled
    public static Factsheet__c getFactsheetFromRecord(String recordId, String objectName, String recordTypeName, String market, String channel) {
        if (recordId == null || recordId.length() == 0) { return null; }
        System.debug('recordId: ' + recordId);
        System.debug('objectName: ' + objectName);
        System.debug('recordTypeName: ' + recordTypeName);
        System.debug('channel: ' + channel);
        System.debug('market: ' + market);

        List<Factsheet__c> l_Factsheets = [SELECT Id, Name, Object__c, Fieldset_Name__c, Show_Attachment_Section__c, Show_Detail_View__c, Channel__c, RecordType__c, (SELECT Id, Name, Object__c, Fieldset_Name__c, Custom_Filter__c, Custom_Title__c, Is_Related_To_Parent__c, Parent_Field_Name__c FROM Factsheet_Items__r WHERE Is_Active__c = true ORDER BY Position__c) FROM Factsheet__c WHERE Object__c =:objectName AND Market__c =:market AND Is_Active__c = true AND (RecordType__c = null OR RecordType__c = '' OR RecordType__c =:recordTypeName) AND (Channel__c = null OR Channel__c = '' OR Channel__c =:channel)];

        Factsheet__c theFactsheet;
        if (l_Factsheets != null && l_Factsheets.size() > 0) {
            if (l_Factsheets.size() > 1) {
                for(Factsheet__c f : l_Factsheets) {
                    if (channel != 'ALL' && f.Channel__c == channel) { theFactsheet = f; break; }
                    if (recordTypeName != 'ALL' && f.RecordType__c == recordTypeName) { theFactsheet = f; break; }
                }
            } else {
				theFactsheet = l_Factsheets.get(0);                            
            }
        }
        return theFactsheet;
    }
    
    @AuraEnabled
    public static Factsheet__c getFactsheet(String factsheetName) {
        if (factsheetName == null || factsheetName.length() == 0) { return null; }
        
        List<Factsheet__c> l = [SELECT Id, Name, Object__c, Fieldset_Name__c, Show_Attachment_Section__c, Show_Detail_View__c, (SELECT Id, Name, Object__c, Fieldset_Name__c, Custom_Filter__c, Custom_Title__c, Is_Related_To_Parent__c, Parent_Field_Name__c FROM Factsheet_Items__r) FROM Factsheet__c WHERE Name =:factsheetName];
        Factsheet__c theFactsheet;        
        if (l != null && l.size() > 0) {
            theFactsheet = l.get(0);
        }
        
        return theFactsheet;
    }
    
    @AuraEnabled
    public static SObject getRecordDetails(String objectAPIName, String recordId, String[] fieldnames) {
        String soql = 'SELECT Id ';
        if (fieldnames.indexOf('Name') < 0) { soql += ', Name'; }
        if (fieldnames != null && fieldnames.size() > 0) {
            soql += ',';
            for(String c : fieldnames) {
                soql += c + ', ';
            }
            
            soql = soql.substring(0, soql.length()-2);
        }
        soql += ' FROM ' + objectAPIName + ' WHERE Id = \'' + recordId + '\'';
        System.debug('[FactsheetController.getRecordDetails] soql: ' + soql);
        List<SObject> l = Database.query(soql);
        if (l != null && l.size() > 0) {
            return l.get(0);
        }
        
        return null;
    }
    
    @AuraEnabled
    public static List<bfColumn> getFieldsetDetails(String objectName, String fieldsetName) {
        System.debug('[getFieldsetDetails] objectName: ' + objectName + ', fielsetName: ' + fieldsetName);
        List<bfColumn> l = null;
        if (objectName == null || objectName.length() == 0) { return l; }
                
        Map<String, Schema.SObjectType> m_Schemas = Schema.getGlobalDescribe();
        if (m_Schemas.containsKey(objectName)) {
            bfObjectDescribe bfod = new bfObjectDescribe(objectName);
            bfod.getDescribe(true, true, true);
            
            if (fieldsetName == null || fieldsetName.length() == 0) { fieldsetName = 'default'; }
            System.debug('[Factsheet_Controller.getFieldsetDetails] fieldsetName: ' + fieldsetName);
            if(bfod.fieldSets.containsKey(fieldsetName)) {
                l = bfod.fieldSets.get(fieldsetName);
            }
        }
        
        return l;
    }
    
    @AuraEnabled
    public static List<List<bfColumn>> getRelatedData(String objectAPIName, String parentFieldName, String parentId, String[] fieldnames, String customFilter) {
        List<List<bfColumn>> relatedData = new List<List<bfColumn>>();
        
        if (objectAPIName == null || objectAPIName.length() == 0) { return relatedData; }
        if (parentFieldName == null || parentFieldName.length() == 0) { return relatedData; }
        if (parentId == null || parentId.length() == 0) { return relatedData; }
        if (customFilter == null || customFilter.length() == 0) { customFilter = ''; }
        
        Map<String, Schema.SObjectType> m_Schemas = Schema.getGlobalDescribe();
		Schema.DescribeSObjectResult theSObject = m_Schemas.get(objectAPIName).getDescribe();
        Map<String, Schema.SObjectField> theFields = theSObject.fields.getMap();
        
        String soql = 'SELECT Id ';
        if (fieldnames != null && fieldnames.size() > 0) {
            soql += ',';
            for(String c : fieldnames) {
                soql += c + ', ';
            }
            
            soql = soql.substring(0, soql.length()-2);
        }
        soql += ' FROM ' + objectAPIName;
        String whereClause = '';
        if (customFilter.length() > 0) {
            if (customFilter.indexOf('{parentId}') >= 0) {
                customFilter = customFilter.replace('{parentId}', parentId);
            } else {
	            customFilter = parentFieldName + ' = \'' + parentId + '\' AND ' + customFilter;                
            }
    		whereClause = ' WHERE ' + customFilter;        
        } else {
            whereClause = ' WHERE ' + parentFieldName + ' = \'' + parentId + '\' LIMIT 5';
        }
        System.debug('[FactsheetController.getRecordDetails] where: ' + whereClause);
        System.debug('[FactsheetController.getRecordDetails] soql: ' + soql);

        soql += whereClause;
        List<SObject> l = Database.query(soql);
        String fldValue = '';
        Schema.DescribeFieldResult dfr;
        if (l != null && l.size() > 0) {            
            for(SObject s : l) {
                List<bfColumn> columns = new List<bfColumn>();
                for(String c : fieldnames) {
                    if (c.indexOf('__r') >= 0) {
    					fldValue = getReferencedFieldValue(c);                    
                    } else {
	                    dfr = theFields.get(c).getDescribe();                        
	                    fldValue = getFieldValue(s, c, dfr);
                    }
                    bfColumn column = new bfColumn(c, c, fldValue);
                    columns.add(column);
                }
                
                relatedData.add(columns);
                
            }
        }
        return relatedData;
    }
    private static String getReferencedFieldValue(String fldName) {
        if (fldName == null || fldName.length() == 0) { return ''; }
        /*
        String[] parts = fldName.split('.');
        Map<String, Schema.SObjectType> m_Schemas = Schema.getGlobalDescribe();
		Schema.DescribeSObjectResult theSObject = m_Schemas.get(parts[0]).getDescribe();
        Map<String, Schema.SObjectField> theFields = theSObject.fields.getMap();
        
        
        Schema.DescribeFieldResult dfr = theFields.get(c).getDescribe();
        String fldValue = getFieldValue(fld, parts[1], dfr);
		*/
        return '';
    }
    private static String getFieldValue(SObject fld, String fldName, Schema.DescribeFieldResult dfr) {
        String fldValue = '';
        
        Object f = fld.get(fldName);
        if (f == null) { return fldValue; }
        
        DateTime dt;              
        System.debug('[getFieldValue] f type: ' + dfr.type);
        
		if (dfr.type == Schema.DisplayType.REFERENCE) {
            List<String> relParts = fldName.split('.');
            String relName = relParts[0].replace('__r', '__c');
            SObject f2 = fld.getSObject(relName);
            if (f2 == null) { return ''; }

            f = f2.get(relParts[1]);                
        }
        if (dfr.type == Schema.DisplayType.DATE) {
            // convert for date
            /*
            Date d = Date.valueOf(f);
            dt = DateTime.valueOf(d);
            fldValue = dt.format('dd-MM-yyyy');
			*/
            Date d = Date.valueOf(f);
            fldValue = d.format();
        } else if (dfr.type == Schema.DisplayType.DATETIME) {
            dt = DateTime.valueOf(f);
            fldValue = dt.format('dd-MM-yyyy HH:mm a');
        } else if (dfr.type == Schema.DisplayType.TIME) {
            dt = DateTime.valueOf(f);
            fldValue = dt.format('HH:mm:ss a');            
        } else {            
            fldValue = String.valueOf(f);  
        }
        
        return fldValue;
    }
    
    @AuraEnabled
    public static List<FactsheetImage> getAttachmentsForRecord(String recordId) {
        if (recordId == null || recordId.length() == 0) { return null;}
        
        List<Attachment> attachments = [SELECT Id, Name, Description, Body, BodyLength, ContentType, CreatedDate FROM Attachment WHERE ParentId=:recordId];
        List<FactsheetImage> l = new List<FactsheetImage>();
        for(Attachment a : attachments) {
            l.add(new FactsheetImage(a));
        }
        
        List<FeedItem> items = [SELECT Id, RelatedRecordId FROM FeedItem WHERE ParentId =:recordId];
        List<String> ids = new List<String>();
        for(FeedItem fi : items) {
            ids.add(fi.RelatedRecordId);
        }
//        List<ContentVersion> feedItems = [SELECT Id, Title, FileExtension, FileType, Origin, FirstPublishLocationId, PathOnClient, VersionData FROM ContentVersion WHERE ID In (SELECT RelatedRecordId FROM FeedItem WHERE ParentId =:recordId)];
		List<ContentVersion> files = [SELECT Id, Title, FileExtension, FileType, Origin, FirstPublishLocationId, PathOnClient, VersionData FROM ContentVersion WHERE Id =:ids];      
        for(ContentVersion cv : files) {
            l.add(new FactsheetImage(cv));
        }
        return l;
    }

}