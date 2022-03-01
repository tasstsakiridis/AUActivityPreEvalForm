public with sharing class AU_PreEvalForm_Attachment_Controller {
    public Promotion_Activity__c theEvalForm;
    public void setTheEvalForm(Promotion_Activity__c pa) {
        //theEvalForm = pa;
        theEvalForm = [SELECT Id, Name, RecordTypeId, RecordType.Name, Status__c, Promotion_Activity_Number__c, Channel__c, Market__c, Market_Filter__c, 
        Customer_Type__c, National_Banner__c, National_Banner__r.Name, Project_Manager__c, Project_Manager__r.Name,
        Project_Manager__r.SmallPhotoUrl, Marketing_Manager__c, Marketing_Manager_Name__c, Marketing_Manager__r.SmallPhotoUrl,
        Sales_Manager__c, Sales_Manager_Name__c, Sales_Manager__r.SmallPhotoUrl, Customer_Contact__c, Agency_Contact__c, Number_of_Stores_in_Banner_Group__c,
        No_of_Stores_in_Banner_Running_Activity__c, Was_Activity_Running_Last_Year__c, Last_Year_Activity_Details__c,
        State_MP__c, Channel_Comments__c, Proposal_Mechanics__c, Activity_Mechanic__c, Activity_Mechanic_Comments__c,
        Begin_Date__c, End_Date__c, PreAlignment_Deadline__c, PreEvaluation_Deadline__c, Date_Approved__c,
        Business_Opportunity__c, Proposal_Objectives__c, Brand_Strategy_Index__c, Commercial_Return_Index__c,
        Customer_Relationship_Index__c, New_Experiential_Index__c, Activity_Communication_Methods__c,
        Evaluation_Comments__c, Activity_Budget__c, Nature_of_Cost_Details__c, Incremental_Discounts_Provided__c,
        Smartsheet_Link__c, Promo_Brands__c, Promo_Products__c, Promo_Banner_Groups__c, Forecasted_Reach_Coverage__c, Total_Customer_AP_Budget__c, Total_Customer_SNS__c,
        Incremental_Gross_Profit__c, Incremental_Gross_Profit_Sales__c, Incremental_Profit_Loss__c, Incremental_Profit_Loss_Sales__c,
        Incremental_ROI__c, Incremental_ROI_Sales__c, Activity_Spend_of_Customer_Budget__c, Total_Customer_Spend_of_SNS__c,
        Forecasted_Cost_per_Thousand__c, Total_Budgeted_Cost_AP__c, Total_Budgeted_Cost_PA__c, Total_Budgeted_Cost_LumpSum__c,
        Total_Budgeted_Cost_COGS__c, Incremental_9L_Uplift__c, Evaluation_BPA_Comments__c, Activity_Comments__c,
        CreatedById,
        (SELECT Id, Activity__c, RecordTypeId, RecordType.Name, Name, Primary__c, Secondary__c, Reach__c, Banner_Group__c
           FROM Promotion_Activity_Related_Data__r)
           FROM Promotion_Activity__c 
           WHERE Id =:pa.Id];

        /*
        List<Promotion_Activity_Related_Data__c> items = [SELECT Id, Name, RecordType.Name, Reach__c, Primary__c
                                                    FROM Promotion_Activity_Related_Data__c
                                                    WHERE Activity__c =:pa.Id];
        */
        communicationMethods = new List<Promotion_Activity_Related_Data__c>();
        bannerGroups = new List<Promotion_Activity_Related_Data__c>();
        if (theEvalForm != null && theEvalForm.Promotion_Activity_Related_Data__r != null) {
            for(Promotion_Activity_Related_Data__c item : theEvalForm.Promotion_Activity_Related_Data__r) {
                if (item.RecordType.Name == 'Communication Method') {
                    communicationMethods.add(item);
                } else if (item.RecordType.Name == 'Banner Group') {
                    bannerGroups.add(item);
                }
            }
        }
    }
    public Promotion_Activity__c getTheEvalForm() {
        return theEvalForm;
    }

    public List<Promotion_Activity_Related_Data__c> communicationMethods { get; set; }
    
    public List<Promotion_Activity_Related_Data__c> bannerGroups { get; set; }

}
