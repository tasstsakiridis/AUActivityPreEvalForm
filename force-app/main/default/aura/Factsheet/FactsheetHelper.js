({
	getFactsheet : function(component) {
        var recordId = component.get("v.recordId");
        var objectName = component.get("v.objectName");
        var marketId = component.get("v.marketId");
        var recordType = component.get("v.recordTypeName");
        var channel = component.get("v.channel");
        console.log("[Factsheet.helper.getFactsheet] recordid", recordId);
        console.log("[Factsheet.helper.getFactsheet] objectName", objectName);
        var action = component.get("c.getFactsheetFromRecord");
        action.setParams({
            "recordId"       : recordId,
            "objectName"     : objectName,
            "recordTypeName" : recordType,
            "market"         : marketId,
            "channel"        : channel
        });
        action.setCallback(this, function(response){
            var callState = response.getState();
            console.log('[Factsheet.helper.getFactsheet] getFactsheet action callback returned with state', callState);
            
            if (component.isValid()) {
                if (callState === "SUCCESS") {
                    try {                        
    	                var theFactsheet = response.getReturnValue();
                        component.set("v.theFactsheet", theFactsheet);
	                    console.log('[Factsheet.helper.getFactsheet] returnmsg', theFactsheet);
                        if (theFactsheet) {
	                        component.set("v.buildFactsheet", true);                            
                            $A.util.addClass(msgContainer, 'slds-hide');
                        } else {
                            var msgContainer = component.find("userMessageContainer");
                            var msg = component.get("v.noFactsheetMessage");
                            var objectName = component.get("v.objectName");
                            var recordType = component.get("v.recordTypeName");
                            var market = component.get("v.market");
                            var channel = component.get("v.channel");
                            console.log('objectname: ' + objectName);
                            msg = msg.replace('{0}', 'Object: ' + objectName);
                            if (recordType.length > 0) { msg += ', RecordType: ' + recordType; }
                            if (market.length > 0) { msg += ', Market: ' + market; }
                            if (channel.length > 0) { msg += ', Channel: ALL or ' + channel; }
                            
                            component.set("v.noFactsheetMessage", msg);
                            $A.util.removeClass(msgContainer, 'slds-hide');
                        }

                    } catch(ex1) {
                        console.log('[Factsheet.helper.getFactsheet] exception', ex1);
                    }
                    
                } else if (callState === "INCOMPLETE") {
                    console.log('[Factsheet.helper.getFactsheet] callback state is incomplete');    
                } else if (callState === "ERROR") {
                    var errors = response.getError();
                    console.log('[Factsheet.helper.getFactsheet] callback returned errors. ', errors);                    
                    component.set("v.errors", errors);                    
                }
            }
            
        });
        $A.enqueueAction(action);
	},
    
    buildFactsheet : function(component) {
    	var theFactsheet = component.get("v.theFactsheet");
        var recordId = component.get("v.recordId");
        
        var componentsToBuild = [];
        var headerComponent = ["c:FactsheetHeader", {
            "aura:id"    : "factsheet_header",
            "objectName" : theFactsheet.Object__c,
            "recordId"   : recordId
        }];
        componentsToBuild.push(headerComponent);
        
        if (theFactsheet.Show_Attachment_Section__c) {
            // build carousel object
            var carouselComponent = ["c:FactsheetCarousel", {
                "aura:id"    : "factsheet_carousel",
                "objectName" : theFactsheet.Object__c,
                "recordId"   : recordId
            }];
            componentsToBuild.push(carouselComponent);
        }
        
        if (theFactsheet.Show_Detail_View__c) {
            console.log('[Factsheet.helper.buildFactsheet] show detail view. fieldsetname', theFactsheet.Fieldset_Name__c);
            var detailComponent = ["c:FactsheetDetailItem", {
                "aura:id"      : "factsheet_detail_item",
                "objectName"   : theFactsheet.Object__c,
                "fieldsetName" : theFactsheet.Fieldset_Name__c,
                "recordId"     : recordId
            }];
            
            componentsToBuild.push(detailComponent);
        }
        
        if (theFactsheet.Factsheet_Items__r && theFactsheet.Factsheet_Items__r.length > 0) {
            console.log('[Factsheet.helper.buildFactsheet] # of items', theFactsheet.Factsheet_Items__r.length);
        
            var fsi;
            var relatedComponent;
            var customFilter, customTitle, isRelatedToParent;
            for (var i = 0; i < theFactsheet.Factsheet_Items__r.length; i++) {
                fsi = theFactsheet.Factsheet_Items__r[i];
                console.log('[Factsheet.helper.buildFactsheet] fsi', fsi);
                isRelatedToParent = fsi.Is_Related_To_Parent__c == null ? true : fsi.Is_Related_To_Parent__c;
                customFilter = fsi.Custom_Filter__c == null ? '' : fsi.Custom_Filter__c;
                customTitle = fsi.Custom_Title__c == null ? '' : fsi.Custom_Title__c;
                    
                relatedComponent = ["c:FactsheetRelatedItem", {
                    "aura:id" : "factsheet_related_item_" + fsi.Object__c,
                    "objectName" : fsi.Object__c,
                    "isRelatedToParent" : isRelatedToParent,
                    "fieldsetName"      : fsi.Fieldset_Name__c,
                    "parentFieldName"   : fsi.Parent_Field_Name__c,
                    "parentId"			: recordId,
                    "customFilter"      : customFilter,
                    "label"             : customTitle
                }];
                console.log('[Factsheet.helper.buildFactsheet] relatedComponent', relatedComponent);
                componentsToBuild.push(relatedComponent);                
            }
            
        }
        
        console.log('[Factsheet.helper.buildFactsheet] componentsToBuild', componentsToBuild);
        $A.createComponents(componentsToBuild, function(components, status, errorMessage) {
            if (status === 'SUCCESS') {
                console.log('[Factsheet.helper.buildFactsheet] new components', components);
                var body = component.get("v.body");
                var numberOfNewComponents = components.length;
                for(var j = 0; j < numberOfNewComponents; j++) {
                    body.push(components[j]);
                }
                component.set("v.body", body);             
            } else if (status === 'INCOMPLETE') {
                console.log('[Factsheet.helper.createComponent] callback state is incomplete');    
            } else if (status === 'ERROR') {
                console.log('[Factsheet.helper.createComponent] callback state is error. ' + errorMessage);    
            }            
        });              
	}
})