({
	doInit : function(component, event, helper) {
		helper.getObjectLabel(component);
        helper.getFieldset(component);
	},
    
    handleLightningEvent : function(component, event, helper) {
        var eventName = event.getParam("eventName");
        var recordId = event.getParam("recordId");
        if (eventName == 'recordIdChange') {
            component.set("v.recordId", recordId);
        }
    },
    
    handleGetRecordChange : function(component, event, helper) {
        var newVal = event.getParam("value");
        console.log('[FactsheetDetailItem.controller.handleGetRecordChange] new record', newVal);
        if (newVal == true) {
            component.set("v.getRecord", false);
            helper.getRecordDetail(component);
        }
    },
    
    handleBuildFormChange : function(component, event, helper) {
        var newVal = event.getParam("value");
        console.log('[FactsheetDetailItem.controller.handleBuilFormChange] buildForm', newVal);
        if (newVal == true) {
            component.set("v.buildForm", false);
            helper.buildForm(component);
        }
    },
    
    toggleSection : function(component, event, helper) {
        var view = component.find("section_panel");
        $A.util.toggleClass(view, "slds-is-open");

        view = component.find("section_content");
        $A.util.toggleClass(view, "slds-hide");
    }
    
})