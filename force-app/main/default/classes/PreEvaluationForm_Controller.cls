public with sharing class PreEvaluationForm_Controller {
    @AuraEnabled(cacheable=true) 
    public static Promotion_Activity__c getActivity(String activityId) {
        return [SELECT Id, Name, RecordTypeId, RecordType.Name, Status__c, Promotion_Activity_Number__c, Channel__c, Market__c, Market_Filter__c, 
                        CreatedById, CreatedBy.Name, Promo_Brands__c, Type_of_Spend__c, Segment_Type__c, Banner_Group__c, Projected_AP_Spend__c, Consumer_Driver__c,
                        Strategic_Pillar__c, Begin_Date__c, End_Date__c, Activity_Mechanic_Comments__c, Description__c, Is_Approved__c, Publish_Activity__c,
                        STI_Relevant__c,
                        (SELECT Id, Brand__c, Brand__r.Name, Brand__r.Primary_Logo__c, Banner_Group__c, Banner_Group__r.Name, RecordTypeId, RecordType.Name, Number_of_Outlets__c, Percentage_of_Customer_Universe__c,
                                Incremental_Distribution_Points__c, Baseline_Sales_Volume_9L__c, Baseline_SNS__c, Baseline_GP__c, Baseline_Brand_Profit__c,
                                Projected_Sales_Volume__c, Projected_SNS__c, Projected_GP__c, Projected_Brand_Profit__c, Incremental_Brand_Profit__c,
                                ROI_Percent__c, Reach__c, ESOV__c, Engagement_Rates__c, Penetration__c, Awareness_Increases__c, Purchase_Intent__c,
                                Meaningful_Difference__c, Cost_per_Engagement__c, Reach_Premium__c, Brand_GP_Rate__c, Brand_SNS_Rate__c, Amount_Split__c,
                                Percent_Split__c, Split_Manually_Set__c, Rate_of_Sale__c, Actual_Sales_Volume__c, Actual_Brand_Profit__c, Actual_GP__c, Actual_SNS__c
                        FROM Promotion_Activity_Related_Data__r)
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
                   AND Management_Group_State_Level__c = 'BAN_NAT'
                ORDER BY Sort_Order__c, Name];
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getProducts(String marketId) {
        if (marketId == null) {
            String marketName = 'Australia';
            User u = [SELECT Id, Market__c FROM User WHERE Id =:UserInfo.getUserId()];
            if (u.Market__c != null) {
                marketName = u.Market__c;
            }
            Market__c m = [SELECT Id FROM Market__c WHERE Name =:marketName LIMIT 1];
            marketId = m.Id;
        }

        List<Product__c> products = [SELECT Id, Name, Brand__c, Brand_Name__c, Brand__r.Primary_Logo__c, Image_Name__c 
                                       FROM Product__c 
                                      WHERE IsActive__c = true 
                                        AND RecordType.Name = 'Wet Goods'
                                        AND Is_Wombat_Product__c = true
                                        AND Market__c =:marketId
                                    ORDER BY Name];

        List<Pricebook2> prices = [SELECT Id, Brand__c, SNS_Rate__c, GP_Rate__c
                                     FROM Pricebook2 
                                     WHERE RecordType.Name = 'Australia' 
                                       AND IsActive = true];

        Map<String, Object> result = new Map<String, Object>();
        result.put('products', products);
        result.put('brandPrices', prices);
        return result;
    }

    @AuraEnabled 
    public static String save(Promotion_Activity__c activity, List<Promotion_Activity_Related_Data__c> relatedData, List<Promotion_Activity_Related_Data__c> brands, List<String> bannerGroups, Boolean publish) {
        String msg = 'OK';
        try {
            System.debug('status: ' + activity.Status__c);
            System.debug('brands: ' + brands);
            System.debug('bannerGroups: ' + bannerGroups);
            System.debug('relatedData: ' + relatedData);
            update activity;
                        
            List<Promotion_Activity_Related_Data__c> existingRelatedData = [SELECT Id FROM Promotion_Activity_Related_Data__c WHERE Activity__c =:activity.Id];
            if (existingRelatedData != null && existingRelatedData.size() > 0) {
                delete existingRelatedData;
            }

            Map<String, Schema.RecordTypeInfo> rtPARDList = Promotion_Activity_Related_Data__c.SObjectType.getDescribe().getRecordTypeInfosByName();
            List<Promotion_Activity_Related_Data__c> items = new List<Promotion_Activity_Related_Data__c>();
            System.debug('# of brands: ' + brands.size());
            if (brands != null && brands.size() > 0) {
                System.debug('processing brands');
                String rtRelatedData;
                if (activity.Type_of_Spend__c == 'Broadreach') {
                    rtRelatedData = rtPARDList.get('Broadreach').getRecordTypeId();
                } else if (activity.Type_of_Spend__c == 'Activation') {
                    rtRelatedData = rtPARDList.get('Activation').getRecordTypeId();                    
                }

                for(Promotion_Activity_Related_Data__c pard : brands) {
                    System.debug('pard.Id: ' + pard.Id);
                    //if (pard.Id == 'new') { pard.Id = null; }
                    pard.Id = null;
                    if (String.isEmpty(pard.Activity__c)) {
                        pard.Activity__c = activity.Id;
                    }
                    if (String.isEmpty(pard.RecordTypeId)) {
                        pard.RecordTypeId = rtRelatedData;
                    }
                    
                    System.debug('pard: ' + pard);

                    //items.add(pard);
                }

                System.debug('items: ' + brands);
                upsert brands;
            }

            if (bannerGroups != null && bannerGroups.size() > 0) {
                List<Promotion_Activity_Related_Data__c> relatedBannerGroups = new List<Promotion_Activity_Related_Data__c>();
                String rtRelatedBanner = rtPARDList.get('Banner Group').getRecordTypeId();
                for(String bg : bannerGroups) {
                    Promotion_Activity_Related_Data__c pBanner = new Promotion_Activity_Related_Data__c();
                    pBanner.Activity__c = activity.Id;
                    pBanner.RecordTypeId = rtRelatedBanner;
                    pBanner.Banner_Group__c = bg;

                    relatedBannerGroups.add(pBanner);
                }

                upsert relatedBannerGroups;
            }

            if (publish) {
                sendPDFEmail(activity, true);
            }
        } catch(Exception ex) {
            msg = ex.getMessage();
        }

        return msg;
    }

    @AuraEnabled 
    public static Map<String, Object> publishActivity(String activityId) {
        Map<String, Object> result = new Map<String, Object>();
        try {
            Promotion_Activity__c theActivity = [SELECT Id, Name, Promotion_Activity_Number__c, Status__c, Is_Approved__c, Market__r.Name, Owner.Name,
                                                        (SELECT Id, Brand__c, Brand__r.Name FROM Promotion_Activity_Related_Data__r WHERE RecordType.Name = 'Activation' OR RecordType.Name = 'Broadreach')
                                                   FROM Promotion_Activity__c 
                                                   WHERE Id =:activityId];
            if (theActivity != null) {
                theActivity.Status__c = 'Approved';
                theActivity.Is_Approved__c = true;
                update theActivity;

                sendPDFEmail(theActivity, true);

                result.put('status', 'OK');
            } else {
                result.put('status', 'ERROR');
                result.put('message', 'No activity found with record id : ' + activityId);
            }
        } catch(Exception ex) {
            result.put('status', 'ERROR');
            result.put('message', ex.getMessage());
        }

        return result;
    }

    @AuraEnabled 
    public static Map<String, Object> sendPDF(String activityId) {
        Map<String, Object> result = new Map<String, Object>();

        try {
            Promotion_Activity__c theActivity = [SELECT Id, Name, Promotion_Activity_Number__c, Status__c, Is_Approved__c, Market__r.Name, Owner.Name, Owner.Email
                                                    FROM Promotion_Activity__c 
                                                    WHERE Id =:activityId];
            if (theActivity != null) {
                EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'AU_PreEvaluation_Form'];
                sendPDFEmail(theActivity, false);
            }

            result.put('status', 'OK');
        } catch(Exception ex) {
            result.put('status', 'ERROR');
            result.put('message', ex.getMessage());
        }

        return result;
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

    private static void sendPDFEmail(Promotion_Activity__c theActivity, Boolean notifyBrandManagers) {
        EmailTemplate et = [SELECT Id FROM EmailTemplate WHERE DeveloperName = 'AU_PreEvaluation_Form'];

        List<Messaging.SingleEmailMessage> msgs = new List<Messaging.SingleEmailMessage>();

        /* Send to Owner */
        Messaging.SingleEmailMessage msg = new Messaging.SingleEmailMessage();
        msg.setTargetObjectId(theActivity.OwnerId);
        msg.setSenderDisplayName(theActivity.Owner.Name);
        msg.setSaveAsActivity(false);
        msg.setTemplateId((et.Id));
        msg.setUseSignature(false);
        msg.setWhatId(theActivity.Id);
        msgs.add(msg);

        if (notifyBrandManagers && theActivity.Promotion_Activity_Related_Data__r != null && theActivity.Promotion_Activity_Related_Data__r.size() > 0) {
            String brandString = '';
            for(Promotion_Activity_Related_Data__c pard : theActivity.Promotion_Activity_Related_Data__r) {
                brandString += '\'' + String.escapeSingleQuotes(pard.Brand__r.Name) + '\',';
            }
            brandString = brandString.removeEnd(',');
            System.debug('brandString: ' + brandString);
            String marketName = theActivity.Market__r.Name;
            System.debug('marketName: ' + marketName);
            String soql = 'SELECT Id, Name, Email, Manages_Brand__c FROM User WHERE Market__c = \'' + theActivity.Market__r.Name + '\'';
            soql += ' AND Manages_Brand__c INCLUDES (' + brandString + ')';
            List<User> brandManagers = Database.query(soql);
            if (brandManagers != null && brandManagers.size() > 0) {
                for(User mgr : brandManagers) {
                    msg = new Messaging.SingleEmailMessage();

                    msg.setTargetObjectId(mgr.Id);
                    msg.setSenderDisplayName(theActivity.Owner.Name);
                    msg.setUseSignature(false);
                    msg.setTemplateId(et.Id);
                    msg.setWhatId(theActivity.Id);
                    msg.setSaveAsActivity(false);

                    msgs.add(msg);
                }

            }
        }

        Messaging.sendEmail(msgs);
    }
}