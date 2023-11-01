({
	doInit : function(component, event, helper) {
        console.log('[FactsheetRelatedItem.controll.doInit]');
        /*
        var container = component.find("datatable_container");
        if ($A.get('$Browser.isDesktop')) {
            $A.util.removeClass(container, "slds-max-medium-table_stacked-horizontal");
        } else {
            $A.util.addClass(container, "slds-max-medium-table_stacked-horizontal");            
        }
        */
		helper.getObjectLabel(component);
        helper.getFieldset(component);
	},
    
    handleLightningEvent : function(component, event, helper) {
        var eventName = event.getParam("eventName");
        var parentId = event.getParam("parentId");
        if (eventName == 'recordIdChange') {
            component.set("v.parentId", parentId);
        }
    },

    handleGetRelatedDataChange : function(component, event, helper) {
        var newVal = event.getParam("value");
        console.log('[FactsheetRelatedItem.controller.handleGetRelateddataChange] new record', newVal);
        if (newVal == true) {
            component.set("v.getRelatedData", false);
            helper.getRelatedData(component);
        }
    },
    
    handleBuildFormChange : function(component, event, helper) {
        var newVal = event.getParam("value");
        console.log('[FactsheetRelatedItem.controller.handleBuilFormChange] buildForm', newVal);
        if (newVal == true) {
            component.set("v.buildForm", false);
            helper.buildForm(component);
        }
    },
    
    toggleSection : function(component, event, helper) {
        console.log('[FactsheetRelatedItem.controller.toggleSection]');
        var objectname = component.get("v.objectName");
        var view = component.find("section_panel");
        $A.util.toggleClass(view, "slds-is-open");

        view = component.find("section_content");
        $A.util.toggleClass(view, "slds-hide");
        console.log('[FactsheetRelatedItem.controller.toggleSection] content', view);
    },
    
})