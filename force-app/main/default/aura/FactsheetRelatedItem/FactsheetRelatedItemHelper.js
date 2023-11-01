({
	getObjectLabel : function(component) {
        var objectName = component.get("v.objectName");
        var action = component.get("c.getLabelForObject");
        action.setParams({
            "objectName": objectName,
            "plural" : true
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetRelatedItem.helper.getObjectLabel] getObjectLabel action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var objLabel = response.getReturnValue();
                        var title = objLabel;
                        component.set("v.objectLabel", objLabel);
                        var label = component.get("v.label");
                        if (label != null && label.length > 0) {
                            title = label;
                        }
                        component.set("v.title", title);
	                    console.log('[FactsheetRelatedItem.helper.getObjectLabel] returnmsg', objLabel);

                    } catch(ex1) {
                        console.log('[FactsheetRelatedItem.helper.getObjectLabel] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetRelatedItem.helper.getObjectLabel] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetRelatedItem.helper.getObjectLabel] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);		
	},

    getFieldset : function(component) {
        var objectName = component.get("v.objectName");
        var fieldsetName = component.get("v.fieldsetName");
        
        console.log('[FactsheetRelatedItem.helper.getFieldset] objectname', objectName);
        console.log('[FactsheetRelatedItem.helper.getFieldset] fieldsetName', fieldsetName);
        var action = component.get("c.getFieldsetDetails");
        action.setParams({
            "objectName"    : objectName,
            "fieldsetName"  : fieldsetName
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetRelatedItem.helper.getFieldset] getFieldset action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var fieldset = response.getReturnValue();
	                    console.log('[FactsheetRelatedItem.helper.getFieldset] returnmsg', fieldset);
                        component.set("v.fieldset", fieldset);
                        if (fieldset) {
	                        component.set("v.getRelatedData", true);                            
                        }

                    } catch(ex1) {
                        console.log('[FactsheetRelatedItem.helper.getFieldset] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetRelatedItem.helper.getFieldset] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetRelatedItem.helper.getFieldset] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
        
    },

    getRelatedData : function(component) {
        var objectName = component.get("v.objectName");
        var parentFieldName = component.get("v.parentFieldName");
        var parentId = component.get("v.parentId");
        var fieldset = component.get("v.fieldset");
        var customFilter = component.get("v.customFilter");
        var action = component.get("c.getRelatedData");
        var fieldNames = [];
        var columns = [];
        for(var i = 0; i < fieldset.length; i++) {
            fieldNames.push(fieldset[i].name);
            columns.push(fieldset[i].label);
        }        
        component.set("v.columns", columns);
        action.setParams({
            "objectAPIName"  : objectName,
            "parentFieldName": parentFieldName,
            "parentId"       : parentId,
            "fieldnames"     : fieldNames,
            "customFilter"   : customFilter
        });
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] objectName', objectName);
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] parentFieldName', parentFieldName);
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] parentId', parentId);
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] fieldset', fieldset);
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] fieldnames', fieldNames);
        console.log('[FactsheetRelatedItem.helper.getRecordDetail] customFilter', customFilter);
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetRelatedItem.helper.getRecordDetail] getRelatedData action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var relatedData = response.getReturnValue();
                        var objName = component.get("v.objectName");
                        console.log('[FactsheetRelatedItem.helper.getRelatedData] objectName', objName);
	                    console.log('[FactsheetRelatedItem.helper.getRelatedData] relatedData', relatedData);
                        component.set("v.theRelatedData", relatedData);

                    } catch(ex1) {
                        console.log('[FactsheetRelatedItem.helper.getRelatedData] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetRelatedItem.helper.getRelatedData] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetRelatedItem.helper.getRelatedData] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
    },    
    
})