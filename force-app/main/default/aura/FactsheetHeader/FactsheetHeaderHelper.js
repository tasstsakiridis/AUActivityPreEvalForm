({
	init : function(component) {
        var objectName = component.get("v.objectName");
        var action = component.get("c.getLabelForObject");
        action.setParams({
            "objectName": objectName,
            "plural"    : false
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetHeader.helper.init] getObjectLabel action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var objLabel = response.getReturnValue();
                        component.set("v.objectLabel", objLabel);
	                    console.log('[FactsheetHeader.helper.init] returnmsg', objLabel);

                    } catch(ex1) {
                        console.log('[FactsheetHeader.helper.init] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetHeader.helper.init] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetHeader.helper.init] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
		
	},
    
    getRecordDetails : function(component) {
        var objectName = component.get("v.objectName");
    	var recordId = component.get("v.recordId");
        var fields = component.get("v.fields");
        var action = component.get("c.getRecordDetails");
        action.setParams({
            "objectAPIName": objectName,
            "recordId"     : recordId,
            "fieldnames"   : fields
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetHeader.helper.getRecordDetails] getRecordDetails action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var theRecord = response.getReturnValue();
                        component.set("v.theRecord", theRecord);
	                    console.log('[FactsheetHeader.helper.getRecordDetails] returnmsg', theRecord);

                    } catch(ex1) {
                        console.log('[FactsheetHeader.helper.getRecordDetails] getRecordDetails', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetHeader.helper.getRecordDetails] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetHeader.helper.getRecordDetails] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
        
    },
    
    getFieldsetDetails : function(component) {
        var helper = this;
    	var objectAPIName = component.get("v.objectAPIName");
        var fieldsetName = component.get("v.fieldSetName");
        var action = component.get("c.getFieldsetDetails");
        action.setParams({
            "objectAPIName": objectAPIName,
            "fieldsetName": fieldsetName
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetHeader.helper.getFieldset] getFieldset action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var fields = response.getReturnValue();
                        component.set("v.fields", fields);
	                    console.log('[FactsheetHeader.helper.getFieldset] returnmsg', fields);
                        
                        helper.getRecordDetails(component);
                    } catch(ex1) {
                        console.log('[FactsheetHeader.helper.getFieldset] getRecordDetails', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetHeader.helper.getFieldset] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetHeader.helper.getFieldset] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
    },
    
    notifyFactsheetDetailItems : function(component) {
        var recordId = component.get("v.recordId");
        var action2 = $A.get("e.c:bfLightningEvent");
        action2.setParams({
            "eventName": "recordIdChange",
            "recordId": recordId
        });
        action2.fire();
        
    }
    /* helper routines */
})