@isTest
public class bfLookup_Controller_Test {
    static testMethod void unitTest1() {
        Market__c mAU = new Market__c();
        mAU.Name = 'Australia';
        mAU.Vistex_Clearing_Account__c = '0123456789';
        insert mAU;
        
        INFW_TestHelper helper = new INFW_TestHelper();
        User manager = helper.createUser('System Administrator', 'Test', 'Manager', 'Australia');
        
        String searchString = 'Test';
        String sObjectAPIName = 'User';
        List<Object> l = bfLookup_Controller.doSearch(searchString, sObjectAPIName, false, true, mAU.Id, 'Australia', 'Market__c', true, 'IsActive');
        System.assertNotEquals(null, l, 'Some list was returned from lookup method and not null');
        
        
    }
}