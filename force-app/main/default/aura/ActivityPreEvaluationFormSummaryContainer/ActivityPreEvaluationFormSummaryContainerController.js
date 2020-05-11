({
	doInit : function(component, event, helper) {
        var myPageRef = component.get("v.pageReference");
        var activityId = myPageRef.state.c__activityId;
        component.set("v.activityId", activityId);
        console.log('[activitypreevaluationformsummarycontainer.doInit] activityId', component.get("v.activityId"));
	}
})