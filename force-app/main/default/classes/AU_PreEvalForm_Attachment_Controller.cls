public with sharing class AU_PreEvalForm_Attachment_Controller {
    public Promotion_Activity__c theEvalForm;
    public void setTheEvalForm(Promotion_Activity__c pa) {
        //theEvalForm = pa;
        theEvalForm = [SELECT Id, Name, RecordTypeId, RecordType.Name, Status__c, Promotion_Activity_Number__c, Channel__c, Market__c, Market_Filter__c, 
                        CreatedById, CreatedBy.Name, Promo_Brands__c, Type_of_Spend__c, Segment_Type__c, Banner_Group__c, Projected_AP_Spend__c, Consumer_Driver__c,
                        Strategic_Pillar__c, Begin_Date__c, End_Date__c, Activity_Mechanic_Comments__c, Description__c, Is_Approved__c, Publish_Activity__c,
                        (SELECT Id, Brand__c, Brand__r.Name, Brand__r.Primary_Logo__c, Banner_Group__c, Banner_Group__r.Name, RecordTypeId, RecordType.Name, Number_of_Outlets__c, Percentage_of_Customer_Universe__c,
                                Incremental_Distribution_Points__c, Baseline_Sales_Volume_9L__c, Baseline_SNS__c, Baseline_GP__c, Baseline_Brand_Profit__c,
                                Projected_Sales_Volume__c, Projected_SNS__c, Projected_GP__c, Projected_Brand_Profit__c, Incremental_Brand_Profit__c,
                                ROI_Percent__c, Reach__c, ESOV__c, Engagement_Rates__c, Penetration__c, Awareness_Increases__c, Purchase_Intent__c,
                                Meaningful_Difference__c, Cost_per_Engagement__c, Reach_Premium__c, Brand_GP_Rate__c, Brand_SNS_Rate__c, Amount_Split__c,
                                Percent_Split__c, Split_Manually_Set__c, Rate_of_Sale__c
                        FROM Promotion_Activity_Related_Data__r)
                  FROM Promotion_Activity__c 
                 WHERE Id =:pa.Id];

        isBroadreach = theEvalForm.Type_of_Spend__c == 'Broadreach';
        isActivation = theEvalForm.Type_of_Spend__c == 'Activation';

        brandData = new List<Promotion_Activity_Related_Data__c>();
        bannerGroups = '';
        if (theEvalForm.Promotion_Activity_Related_Data__r != null && theEvalForm.Promotion_Activity_Related_Data__r.size() > 0) {
            for(Promotion_Activity_Related_Data__c pard : theEvalForm.Promotion_Activity_Related_Data__r) {
                if (pard.RecordType.Name == 'Banner Group') {
                    bannerGroups += pard.Banner_Group__r.Name + ',';
                } else {
                    brandData.add(pard);
                }
            }
        }

    }
    public Promotion_Activity__c getTheEvalForm() {
        return theEvalForm;
    }

    public List<Promotion_Activity_Related_Data__c> brandData { get; set; }
    
    public Boolean isBroadreach { get; set; }
    public Boolean isActivation { get; set; }
    public String bannerGroups { get; set; }
}