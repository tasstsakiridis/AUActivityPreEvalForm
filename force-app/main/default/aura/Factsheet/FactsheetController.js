({
	doInit : function(component, event, helper) {
        console.log('[Factsheet.controller.doInit]');
		helper.getFactsheet(component);
	},
    
    handleBuildFactsheetChange : function(component, event, helper) {
        var newVal = event.getParam("value");
        if (newVal == true) {
            component.set("v.buildFactsheet", false);
            helper.buildFactsheet(component);
        }
    }
})