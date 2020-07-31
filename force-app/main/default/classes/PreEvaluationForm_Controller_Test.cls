@isTest(SeeAllData=true)
private class PreEvaluationForm_Controller_Test {
    static testMethod void unitTest1() {
        INFW_TestHelper helper = new INFW_TestHelper();

        Map<String, RecordTypeInfo> pRecordTypes = Schema.SObjectType.Product__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> paRecordTypes = Schema.SObjectType.Promotion_Activity__c.getRecordTypeInfosByName();
        Map<String, RecordTypeInfo> bgRecordTypes = Schema.SObjectType.Banner_Groups__c.getRecordTypeInfosByName();
                
        String rtCRMAustralia = paRecordTypes.get('CRM - Australia').getRecordTypeId();
        String rtWetGoods = pRecordTypes.get('Wet Goods').getRecordTypeId();
        String rtAUBanners = bgRecordTypes.get('AUD - Banner Groups').getRecordTypeId();

        User manager = helper.createUser('System Administrator', 'Test', 'Manager', 'Australia');
        insert manager;

        User projectManager = helper.createUser('System Administrator', 'Project', 'Manager', 'Australia');
        projectManager.ManagerId = manager.Id;
        
        User marketingContact = helper.createUser('System Administrator', 'Marketing', 'Contact', 'Australia');
        User salesContact = helper.createUser('System Administrator', 'Sales', 'Contact', 'Australia');
        User[] l_Users = new User[]{projectManager,marketingContact,salesContact};        
        insert l_Users;

        System.runAs(projectManager) {

            Market__c mAU = helper.createMarket('Australia');
            mAU.Country_ISO_Code_2__c = 'AU';
            mAU.Country_ISO_Code_3__c = 'AUS';
            insert mAU;

            Brand__c brand = new Brand__c(Name='Brand');
            insert brand;
            
            List<Product__c> products = helper.createProducts(3, 'Wet Goods', mAU.Id, brand.Id, false);
            insert products;
            
            Banner_Groups__c bg = new Banner_Groups__c();
            bg.RecordTypeId = rtAUBanners;
            bg.Name = 'AU Banner';
            bg.Market__c = mAU.Id;
            bg.Management_Group_State_Level__c = 'BAN_NAT';
            insert bg;

            Promotion_Activity__c pa1 = new Promotion_Activity__c();
            pa1.Name = 'Test Eval 1';
            pa1.RecordTypeId = rtCRMAustralia;
            insert pa1;

            pa1.Market__c = mAU.Id;
            pa1.Begin_Date__c = Date.today();
            pa1.End_Date__c = pa1.Begin_Date__c.addMonths(12);
            pa1.PreAlignment_Deadline__c = pa1.Begin_Date__c.addDays(14);
            pa1.PreEvaluation_Deadline__c = pa1.Begin_Date__c.addDays(20);
            pa1.Market_Filter__c = 'Australia';
            pa1.Active__c = true;
            pa1.Promotion_Type__c = 'Sales Promo';
            pa1.Project_Manager__c = projectManager.Id;
            pa1.Marketing_Manager__c = marketingContact.Id;
            pa1.Sales_Manager__c = salesContact.Id;
            
            pa1.Customer_Contact__c = 'Test Customer Contact';
            pa1.Agency_Contact__c = 'Test Agency Contact';
            pa1.Number_of_Stores_in_Banner_Group__c = 100;
            pa1.No_of_Stores_in_Banner_Running_Activity__c = 90;
            pa1.Was_Activity_Running_Last_Year__c = false;
            pa1.Last_Year_Activity_Details__c = 'Last year activity details';
            pa1.State_MP__c = 'NSW;VIC;';
            pa1.Smartsheet_Link__c = 'www.smartsheet.com';
            pa1.Channel__c = 'On';
            pa1.Customer_Type__c = 'All';
            pa1.Channel_Comments__c = 'Channel comments';
            pa1.Proposal_Mechanics__c = 'Proposal Mechanics';
            pa1.Activity_Mechanic__c = 'ATL';
            pa1.Activity_Comments__c = 'Activity Comments';
            pa1.Business_Opportunity__c = 'Business Oppt';
            pa1.Proposal_Objectives__c = 'Activity Objectives';
            pa1.Brand_Strategy_Index__c = 5;
            pa1.Commercial_Return_Index__c = 7;
            pa1.Customer_Relationship_Index__c = 8;
            pa1.New_Experiential_Index__c = 1;
            pa1.Activity_Budget__c = 100000.00;
            pa1.Total_Budgeted_Cost_AP__c = 50000;
            pa1.Total_Budgeted_Cost_COGS__c = 30000;
            pa1.Total_Budgeted_Cost_PA__c = 0;
            pa1.Total_Budgeted_Cost_LumpSum__c = 20000;
            pa1.Nature_of_Cost_Details__c = 'Nature of cost details';
            pa1.Incremental_Discounts_Provided__c = false;        
            pa1.Forecasted_Reach_Coverage__c = 1000000;
            pa1.Total_Customer_AP_Budget__c = 2000000;
            pa1.Total_Customer_SNS__c = 20000000;
            pa1.Incremental_Gross_Profit__c = 125000;
            pa1.Incremental_Gross_Profit_Sales__c = 115000;
            pa1.Incremental_9L_Uplift__c = '';
            pa1.Evaluation_Comments__c = 'sales comments';
            pa1.Evaluation_BPA_Comments__c = 'bpa comments';
            pa1.Status__c = 'New';
            pa1.Promo_Brands__c = 'Brand';            
            pa1.Promo_Products__c = '';
            pa1.Promo_Banner_Groups__c = 'Banner;';

            Activity_Product__c pap = new Activity_Product__c();
            pap.Activity__c = pa1.Id;
            pap.Product_NoFilter__c = products[0].Id;
            List<Activity_Product__c> l_PAP = new List<Activity_Product__c>();
            l_PAP.add(pap);

            Promotion_Activity_Related_Data__c pard1 = new Promotion_Activity_Related_Data__c();
            pard1.Activity__c = pa1.Id;
            pard1.Banner_Group__c = bg.Id;
            List<Promotion_Activity_Related_Data__c> l_PARD_Banners = new List<Promotion_Activity_Related_Data__c>();
            l_PARD_Banners.add(pard1);

            Promotion_Activity_Related_Data__c pard2 = new Promotion_Activity_Related_Data__c();
            pard2.Primary__c = true;
            pard2.Reach__c = 1000000;
            List<Promotion_Activity_Related_Data__c> l_PARD_Comms = new List<Promotion_Activity_Related_Data__c>();
            l_PARD_Comms.add(pard2);


            Test.startTest();
            
            Promotion_Activity__c pa2 = PreEvaluationForm_Controller.getActivity(pa1.Id);
            
            UserDetailWrapper udw = PreEvaluationForm_Controller.getUserDetails();

            Boolean isAdminUser = PreEvaluationForm_Controller.getIsAdminUser();

            List<Banner_Groups__c> bannerGroups = PreEvaluationForm_Controller.getBannerGroups(mAU.Id);

            List<Product__c> l_products = PreEvaluationForm_Controller.getProducts(null);

            String msg = PreEvaluationForm_Controller.save(pa1, l_PAP, l_PARD_Comms, l_PARD_Banners, null);

            msg = PreEvaluationForm_Controller.submitForApproval(pa1.Id);
            msg = PreEvaluationForm_Controller.recallApproval(pa1.Id);
           
            Test.stopTest();
        }
    }
}