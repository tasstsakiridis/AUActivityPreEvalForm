public class UserDetailWrapper {
    @AuraEnabled 
    public String userId { get; set; }

    @AuraEnabled 
    public String userName { get; set; }

    @AuraEnabled 
    public String marketId { get; set; }

    @AuraEnabled 
    public String marketName { get; set; }

    public UserDetailWrapper() {
        this.userId = '';
        this.userName = '';
        this.marketId = '';
        this.marketName = '';
    }
}
