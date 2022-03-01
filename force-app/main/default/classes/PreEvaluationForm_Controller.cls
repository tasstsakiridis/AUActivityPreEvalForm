public with sharing class PreEvaluationForm_Controller {
    @AuraEnabled(cacheable=true) 
    public static Promotion_Activity__c getActivity(String activityId) {
        return [SELECT Id, Name, RecordTypeId, RecordType.Name, Status__c, Promotion_Activity_Number__c, Channel__c, Market__c, Market_Filter__c, 
                       Customer_Type__c, National_Banner__c, National_Banner__r.Name, Project_Manager__c, Project_Manager__r.Name,
                       Project_Manager__r.SmallPhotoUrl, Marketing_Manager__c, Marketing_Manager__r.Name, Marketing_Manager__r.SmallPhotoUrl,
                       Sales_Manager__c, Sales_Manager__r.Name, Sales_Manager__r.SmallPhotoUrl, Customer_Contact__c, Agency_Contact__c, Number_of_Stores_in_Banner_Group__c,
                       No_of_Stores_in_Banner_Running_Activity__c, Was_Activity_Running_Last_Year__c, Last_Year_Activity_Details__c,
                       State_MP__c, Channel_Comments__c, Proposal_Mechanics__c, Activity_Mechanic__c, Activity_Mechanic_Comments__c,
                       Begin_Date__c, End_Date__c, PreAlignment_Deadline__c, PreEvaluation_Deadline__c, Date_Approved__c,
                       Business_Opportunity__c, Proposal_Objectives__c, Brand_Strategy_Index__c, Commercial_Return_Index__c,
                       Customer_Relationship_Index__c, New_Experiential_Index__c, Activity_Communication_Methods__c,
                       Evaluation_Comments__c, Activity_Budget__c, Nature_of_Cost_Details__c, Incremental_Discounts_Provided__c,
                       Smartsheet_Link__c, Promo_Brands__c, Promo_Banner_Groups__c, Forecasted_Reach_Coverage__c, Total_Customer_AP_Budget__c, Total_Customer_SNS__c,
                       Incremental_Gross_Profit__c, Incremental_Gross_Profit_Sales__c, Incremental_Profit_Loss__c, Incremental_Profit_Loss_Sales__c,
                       Incremental_ROI__c, Incremental_ROI_Sales__c, Activity_Spend_of_Customer_Budget__c, Total_Customer_Spend_of_SNS__c,
                       Forecasted_Cost_per_Thousand__c, Total_Budgeted_Cost_AP__c, Total_Budgeted_Cost_PA__c, Total_Budgeted_Cost_LumpSum__c,
                       Total_Budgeted_Cost_COGS__c, Incremental_9L_Uplift__c, Evaluation_BPA_Comments__c, Activity_Comments__c,
                       CreatedById, Publish_Activity__c, Is_Rejected__c, Commercial_Lead_Review_Entered_By__c, Commercial_Lead_Review_Entered_By_Name__c,
                       Incremental_Gross_Profit_Previous__c, Incremental_Gross_Profit_Sales_Previous__c, 
                       (SELECT Id, Activity__c, RecordTypeId, RecordType.Name, Name, Primary__c, Secondary__c, Reach__c, Banner_Group__c
                          FROM Promotion_Activity_Related_Data__r),
                       (SELECT Id, RecordTypeId, Activity__c, Product_NoFilter__c, Product_NoFilter__r.Name, Product_NoFilter__r.Image_Name__c,
                               Product_NoFilter__r.Brand__c, Product_NoFilter__r.Brand__r.Name, Product_NoFilter__r.Brand__r.Primary_Logo__c 
                          FROM Activity_Products__r),
                       (SELECT Id, ContentDocumentId, ContentDocument.Title, ContentDocument.FileType, ContentDocument.FileExtension,
                                ContentDocument.LatestPublishedVersionId 
                          FROM ContentDocumentLinks) 

                  FROM Promotion_Activity__c 
                 WHERE Id =:activityId];
    }

    @AuraEnabled(cacheable=true) 
    public static UserDetailWrapper getUserDetails() {
        User u = [SELECT Id, Name, Market__c FROM User WHERE Id =:UserInfo.getUserId()];
        String market = u.Market__c;
        if (u.Market__c == null) {
            market = 'Austalia';
        }

        Market__c m = [SELECT Id, Name FROM Market__c WHERE Name =:market LIMIT 1];

        UserDetailWrapper w = new UserDetailWrapper();
        w.userId = u.Id;
        w.userName = u.Name;
        w.marketId = m.Id;
        w.marketName = market;
    
        return w;
    }

    @AuraEnabled(cacheable=true) 
    public static Boolean getIsAdminUser() {
        List<GroupMember> groups = [SELECT Id, Group.Name FROM GroupMember WHERE UserOrGroupId =:UserInfo.getUserId() AND Group.DeveloperName ='AU_Commercial_Analytics_Approvers'];
        Boolean isAdminUser = groups == null ? false : groups.size() > 0;
        System.debug('# of groups: ' + groups == null ? 0 : groups.size());

        return isAdminUser;
    }

    @AuraEnabled(cacheable=true) 
    public static List<Banner_Groups__c> getBannerGroups(String market) {
        return [SELECT Id, Name, Customer_Number__c, Image_Name__c 
                  FROM Banner_Groups__c 
                 WHERE Market__c =: market
                   AND Management_Group_State_Level__c = 'BAN_NAT'];
    }

    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProducts(String marketId) {
        if (marketId == null) {
            String marketName = 'Australia';
            User u = [SELECT Id, Market__c FROM User WHERE Id =:UserInfo.getUserId()];
            if (u.Market__c != null) {
                marketName = u.Market__c;
            }
            Market__c m = [SELECT Id FROM Market__c WHERE Name =:marketName LIMIT 1];
            marketId = m.Id;
        }

        return [SELECT Id, Name, Brand__c, Brand_Name__c, Brand__r.Primary_Logo__c, Image_Name__c 
                  FROM Product__c 
                 WHERE IsActive__c = true 
                   AND RecordType.Name = 'Wet Goods'
                   AND Is_Wombat_Product__c = true
                   AND Market__c =:marketId
              ORDER BY Name];

    }

    @AuraEnabled 
    public static String save(Promotion_Activity__c activity, List<Activity_Product__c> products, List<Promotion_Activity_Related_Data__c> relatedData, List<Promotion_Activity_Related_Data__c> bannerGroups, List<Promotion_Activity_Related_Data__c> bannerGroupsToDelete) {
        String msg = 'OK';
        try {
            System.debug('status: ' + activity.Status__c);
            if (activity.Incremental_Gross_Profit_Sales__c > 0 && (activity.Status__c == 'Draft' || activity.Status__c == 'Commercial Lead Review' || activity.Status__c == 'Commercial Lead Reviewed')) {
                activity.Commercial_Lead_Review_Entered_By__c = UserInfo.getUserId();
                activity.Commercial_Lead_Review_Entered_By_Name__c = UserInfo.getName();
            }
            update activity;

            String rtCRMAU = '';

            Map<String, Schema.RecordTypeInfo> rtiList = Activity_Product__c.SObjectType.getDescribe().getRecordTypeInfosByName();
            if (rtiList.containsKey('CRM - Australia')) {
                rtCRMAU = rtiList.get('CRM - Australia').getRecordTypeId();
            }
    
            for(Activity_Product__c product : products) {
                if (product.RecordTypeId == null) {
                    product.RecordTypeId = rtCRMAU;
                }
            }
            if (products.size() > 0) {
                upsert products;
            }

            String rtCommMethod = '';
            Map<String, Schema.RecordTypeInfo> rtPARDList = Promotion_Activity_Related_Data__c.SObjectType.getDescribe().getRecordTypeInfosByName();
            if (rtPARDList.containsKey('Communication Method')) {
                rtCommMethod = rtPARDList.get('Communication Method').getRecordTypeId();
            }
            for(Promotion_Activity_Related_Data__c pard : relatedData) {
                if (pard.Activity__c == null) {
                    pard.Activity__c = activity.Id;
                }
                if (pard.RecordTypeId == null) {
                    pard.RecordTypeId = rtCommMethod;
                }
                System.debug('pard: ' + pard);
            }
            String rtBannerGroup = '';
            if (rtPARDList.containsKey('Banner Group')) {
                rtBannerGroup = rtPARDList.get('Banner Group').getRecordTypeId();
            }
            if (relatedData == null) { relatedData = new List<Promotion_Activity_Related_Data__c>(); }
            for(Promotion_Activity_Related_Data__c pard : bannerGroups) {
                if (pard.Activity__c == null) {
                    pard.Activity__c = activity.Id;
                }
                if (pard.RecordTypeId == null) {
                    pard.RecordTypeId = rtBannerGroup;
                }
                relatedData.add(pard);
            }
            if (relatedData.size() > 0) {
                upsert relatedData;
            }
            if (bannerGroupsToDelete != null && bannerGroupsToDelete.size() > 0) {
                delete bannerGroupsToDelete;
            }
            
        } catch(Exception ex) {
            msg = ex.getMessage();
        }

        return msg;
    }

    @AuraEnabled 
    public static String submitForApproval(String activityId) {
        String msg = 'OK';
        try {
            Promotion_Activity__c theActivity = [SELECT Id, Status__c, Is_Rejected__c FROM Promotion_Activity__c WHERE Id =:activityId];
            if (theActivity != null) {
                theActivity.Status__c = 'Submitted';
                theActivity.Is_Rejected__c = false;
                update theActivity;

                /*
                *  Note.  By setting the Status to Submitted will trigger the Promotion Activity - Australia process
                *  which will submit the record for approval
                */
            }
        } catch(Exception ex) {
            msg = ex.getMessage();
        }

        return msg;
    }
    @AuraEnabled 
    public static String recallApproval(String activityId) {
        String msg = 'OK';
        try {
            List<ProcessInstanceWorkitem> workItems = [SELECT Id FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId =: activityId];
            if (workItems != null && workItems.size() > 0) {
                Approval.ProcessWorkitemRequest pwr = new Approval.ProcessWorkitemRequest();
                pwr.setAction('Removed');
                pwr.setWorkitemId(workItems[0].Id);
                Approval.ProcessResult result = Approval.process(pwr);
                if (!result.isSuccess()) {
                    List<Database.Error> errors = result.getErrors();
                    for(Database.Error de : errors) {
                        msg += de.getMessage();
                    }                    
                }
            }
        } catch(Exception ex) {
            msg = ex.getMessage();
        }

        return msg;
    }

}