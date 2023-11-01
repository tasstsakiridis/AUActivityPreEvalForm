({
	getObjectLabel : function(component) {
        var objectName = component.get("v.objectName");
        var action = component.get("c.getLabelForObject");
        action.setParams({
            "objectName": objectName,
            "plural": false
        });
        console.log("[FactsheetDetailItem.helper.getObjectLabel] action", action);
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetDetailItem.helper.getObjectLabel] getObjectLabel action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var objLabel = response.getReturnValue();
                        component.set("v.objectLabel", objLabel);
	                    console.log('[FactsheetDetailItem.helper.getObjectLabel] returnmsg', objLabel);

                    } catch(ex1) {
                        console.log('[FactsheetDetailItem.helper.getObjectLabel] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetDetailItem.helper.getObjectLabel] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetDetailItem.helper.getObjectLabel] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);		
	},

    getFieldset : function(component) {
        var objectName = component.get("v.objectName");
        var fieldsetName = component.get("v.fieldsetName");
        
        console.log('[FactsheetDetailItem.helper.getFieldset] objectname', objectName);
        console.log('[FactsheetDetailItem.helper.getFieldset] fieldsetName', fieldsetName);
        var action = component.get("c.getFieldsetDetails");
        action.setParams({
            "objectName"  : objectName,
            "fieldsetName": fieldsetName
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetDetailItem.helper.getFieldset] getFieldset action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var fieldset = response.getReturnValue();
	                    console.log('[FactsheetDetailItem.helper.getFieldset] returnmsg', fieldset);
                        component.set("v.fieldset", fieldset);
                        if (fieldset && fieldset.length > 0) {
	                        component.set("v.getRecord", true);                            
                        }

                    } catch(ex1) {
                        console.log('[FactsheetDetailItem.helper.getFieldset] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetDetailItem.helper.getFieldset] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetDetailItem.helper.getFieldset] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
        
    },

    getRecordDetail : function(component) {
        var objectName = component.get("v.objectName");
        var recordId = component.get("v.recordId");
        var fieldset = component.get("v.fieldset");
        var action = component.get("c.getRecordDetails");
        var fieldNames = [];
        for(var i = 0; i < fieldset.length; i++) {
            fieldNames.push(fieldset[i].name);
        }
        action.setParams({
            "objectAPIName" : objectName,
            "recordId"      : recordId,
            "fieldnames"    : fieldNames
        });
        console.log('[FactsheetDetailItem.helper.getRecordDetail] objectName', objectName);
        console.log('[FactsheetDetailItem.helper.getRecordDetail] recordId', recordId);
        console.log('[FactsheetDetailItem.helper.getRecordDetail] fieldset', fieldset);
        console.log('[FactsheetDetailItem.helper.getRecordDetail] fieldnames', fieldNames);
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[FactsheetDetailItem.helper.getRecordDetail] getRecordDetail action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var theRecord = response.getReturnValue();
	                    console.log('[FactsheetDetailItem.helper.getRecordDetail] returnmsg', theRecord);
                        component.set("v.theRecord", theRecord);
                        component.set("v.buildForm", true);

                    } catch(ex1) {
                        console.log('[FactsheetDetailItem.helper.getRecordDetail] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[FactsheetDetailItem.helper.getRecordDetail] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[FactsheetDetailItem.helper.getRecordDetail] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
    },    
    
    buildForm : function(component) {
        var fieldset = component.get("v.fieldset");
        var theRecord = component.get("v.theRecord");
        console.log('[FactsheetDetailItem.helper.buildForm] fieldset', fieldset);
        console.log('[FactsheetDetailItem.helper.buildForm] theRecord', theRecord);

        var numberOfFields = fieldset.length;
               
        var fld;
        var fld2;
        var items = [];
        var componentsToBuild = [];
        var cmp;
        
        for(var i = 0; i < numberOfFields; i++) {
            fld = fieldset[i];
	        console.log('[FactsheetDetailItem.helper.buildForm] fld', fld);
            fld.value = this.getFieldValue(fld, theRecord);
            items = [fld];
            if (fld.type != 'TextArea' && (i + 1) < numberOfFields && (fieldset[i+1].type != 'TextArea')) {
                i++;
                fld2 = fieldset[i];
                console.log('[FactsheetDetailItem.helper.buildForm] fld2', fld2);
                fld2.value = this.getFieldValue(fld2, theRecord);
                items.push(fld2);                    
            }
            
            cmp = ["c:FactsheetFormElement", {
                "aura:id" : "fe_section" + i,
                "items"   : items
            }];
            componentsToBuild.push(cmp);
            
        }
		
        console.log('[FactsheetDetailItem.helper.buildForm] componentsToBuild', componentsToBuild);
        $A.createComponents(componentsToBuild, function(components, status, errorMessage) {
            if (status === 'SUCCESS') {
                console.log('[FactsheetDetailItem.helper.buildForm] new components', components);
                var body = component.get("v.body");
                var numberOfNewComponents = components.length;
                for(var j = 0; j < numberOfNewComponents; j++) {
                    body.push(components[j]);
                }
                component.set("v.body", body);             
            } else if (status === 'INCOMPLETE') {
                console.log('[FactsheetDetailItem.helper.createComponent] callback state is incomplete');    
            } else if (status === 'ERROR') {
                console.log('[FactsheetDetailItem.helper.createComponent] callback state is error. ' + errorMessage);    
            }            
        });      
    },
    
    getFieldValue : function(fld, theRecord) {
        var fldValue = '';
        if (fld.name.indexOf('__r') < 0) {
            if (theRecord[fld.name]) {
                fldValue = theRecord[fld.name];                                    
            }
        } else {
            var relatedFld = fld.name.split('.');
            if(theRecord[relatedFld[0]]) {
                var relatedValue = theRecord[relatedFld[0]];
                fldValue = relatedValue[relatedFld[1]];                    
            }
        }
        
        return fldValue;
    }
})