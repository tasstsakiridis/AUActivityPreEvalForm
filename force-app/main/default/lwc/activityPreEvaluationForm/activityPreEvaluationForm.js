import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';

import { fireEvent } from 'c/pubsub';

import CLIENT_FORM_FACTOR from '@salesforce/client/formFactor';

import OBJECT_ACTIVITY from '@salesforce/schema/Promotion_Activity__c';

import FIELD_ID from '@salesforce/schema/Promotion_Activity__c.Id';
import FIELD_STATUS from '@salesforce/schema/Promotion_Activity__c.Status__c';

import getActivity from '@salesforce/apex/PreEvaluationForm_Controller.getActivity';
import getUserDetails from '@salesforce/apex/PreEvaluationForm_Controller.getUserDetails';
import getBannerGroups from '@salesforce/apex/PreEvaluationForm_Controller.getBannerGroups';
import getIsAdminUser from '@salesforce/apex/PreEvaluationForm_Controller.getIsAdminUser';
import getProducts from '@salesforce/apex/PreEvaluationForm_Controller.getProducts';
import saveActivity from '@salesforce/apex/PreEvaluationForm_Controller.save';
import submitForApproval from '@salesforce/apex/PreEvaluationForm_Controller.submitForApproval';
import recallApproval from '@salesforce/apex/PreEvaluationForm_Controller.recallApproval';

import LABEL_APPROVAL_SUBMITTED from '@salesforce/label/c.Approval_Submitted';
import LABEL_ACTIVITY_APPROVAL_DATE from '@salesforce/label/c.Activity_Approval_Date';
import LABEL_ACTIVITY_BRAND_STRATEGY_OBJECTIVE from '@salesforce/label/c.Activity_Brand_Strategy_Objective';
import LABEL_ACTIVITY_COMMERCIAL_OBJECTIVE from '@salesforce/label/c.Activity_Commercial_Objective';
import LABEL_ACTIVITY_RELATIONSHIP_OBJECTIVE from '@salesforce/label/c.Activity_Relationship_Objective';
import LABEL_ACTIVITY_NEW_TRIAL_OBJECTIVE from '@salesforce/label/c.Activity_New_Trial_Objective';
import LABEL_ACTIVITY_DETAILS from '@salesforce/label/c.Activity_Details';
import LABEL_ACTIVITY_MECHANIC from '@salesforce/label/c.Activity_Mechanic';
import LABEL_ACTIVITY_MECHANICS from '@salesforce/label/c.Activity_Mechanics';
import LABEL_ACTIVITY_OBJECTIVES_DESCRIPTION from '@salesforce/label/c.Activity_Objectives_Description';
import LABEL_ACTIVITY_SPEND_VS_BUDGET from '@salesforce/label/c.Activity_Spend_as_a_perc_of_total_Customer_Budget';
import LABEL_ADDITIONAL_COGS from '@salesforce/label/c.Additional_COGS';
import LABEL_AGENCY_SUPPLIER_CONTACT from '@salesforce/label/c.Agency_Supplier_Contact';
import LABEL_APPROVED from '@salesforce/label/c.Approved';
import LABEL_AVAILABLE from '@salesforce/label/c.Available';
import LABEL_BANNER_GROUPS from '@salesforce/label/c.Banner_Groups';
import LABEL_BRAND from '@salesforce/label/c.Brand';
import LABEL_BRANDS from '@salesforce/label/c.Brands';
import LABEL_BRANDS_AND_TIMINGS from '@salesforce/label/c.Brands_and_Timings';
import LABEL_BPA_REVIEW from '@salesforce/label/c.BPA_Review';
import LABEL_BPA_TEAM_TO_COMPLETE from '@salesforce/label/c.BPA_Team_to_complete';
import LABEL_CANCEL from '@salesforce/label/c.Cancel';
import LABEL_CHANGES_SAVED_SUCCESSFULLY from '@salesforce/label/c.Changes_Saved_Successfully';
import LABEL_CHANNEL from '@salesforce/label/c.Channel';
import LABEL_COMMENTS from '@salesforce/label/c.Comments';
import LABEL_COMMERCIAL_LEAD_REVIEW from '@salesforce/label/c.Commercial_Lead_Review';
import LABEL_COST_DETAILS from '@salesforce/label/c.Cost_Details';
import LABEL_COST_PER_THOUSAND from '@salesforce/label/c.Cost_per_Thousand';
import LABEL_CUSTOMER_BANNER from '@salesforce/label/c.Customer_Banner';
import LABEL_CUSTOMER_CONTACT from '@salesforce/label/c.Customer_Contact';
import LABEL_CUSTOMER_TYPE from '@salesforce/label/c.Customer_Type';
import LABEL_DESELECT_ALL from '@salesforce/label/c.DeSelect_All';
import LABEL_DETACH_FILE from '@salesforce/label/c.Detach_File';
import LABEL_DETACH_FILE_CONFIRMATION from '@salesforce/label/c.Detach_File_Confirmation';
import LABEL_DETACH_FILE_SUCCESS from '@salesforce/label/c.Detach_File_Success';
import LABEL_DETAILS_ON_NATURE_OF_COST from '@salesforce/label/c.Details_on_Nature_of_Cost';
import LABEL_DRAFT from '@salesforce/label/c.Draft';
import LABEL_FOCUS_BRANDS from '@salesforce/label/c.Focus_Brands';
import LABEL_FOCUS_PRODUCTS from '@salesforce/label/c.Focus_Products';
import LABEL_FORECASTED_COMMERCIAL_RETURN from '@salesforce/label/c.Forecasted_Commercial_Return';
import LABEL_FORECASTED_REACH_COVERAGE from '@salesforce/label/c.Forecasted_Reach_Coverage';
import LABEL_FORMINSTRUCTIONS from '@salesforce/label/c.PreEvaluationFormInstructions';
import LABEL_HELP from '@salesforce/label/c.Help';
import LABEL_KEYDATES_TIMING from '@salesforce/label/c.Key_Dates_Timings';
import LABEL_INCREMENTAL_GROSS_PROFIT from '@salesforce/label/c.Incremental_Gross_Profit';
import LABEL_INCREMENTAL_PROFIT_LOSS from '@salesforce/label/c.Incremental_Profit_Loss';
import LABEL_INCREMENTAL_PA from '@salesforce/label/c.Incremental_PA';
import LABEL_INFO from '@salesforce/label/c.Info';
import LABEL_INSTRUCTIONS from '@salesforce/label/c.Instructions';
import LABEL_LEAD_CHANNEL from '@salesforce/label/c.Lead_Channel';
import LABEL_LUMP_SUM_DISCOUNT from '@salesforce/label/c.Lump_Sum_Discount';
import LABEL_MARKETING_CONTACT from '@salesforce/label/c.Marketing_Contact';
import LABEL_NEXT from '@salesforce/label/c.Next';
import LABEL_NO from '@salesforce/label/c.No';
import LABEL_NUMBER_OF_STORES_IN_BANNER_GROUP from '@salesforce/label/c.Number_of_Stores_in_Banner_Group';
import LABEL_NUMBER_OF_STORES_IN_BANNER_GROUP_RUNNING_ACTIVITY from '@salesforce/label/c.Number_of_Stores_in_Banner_Group_Running_Activity';
import LABEL_OK from '@salesforce/label/c.OK';
import LABEL_PENDING_APPROVAL from '@salesforce/label/c.Pending_Approval';
import LABEL_PRE_ALIGNMENT_DEADLINE from '@salesforce/label/c.Pre_Alignment_Deadline';
import LABEL_PRE_EVALUATION_DEADLINE from '@salesforce/label/c.Pre_Evaluation_Deadline';
import LABEL_PREV from '@salesforce/label/c.PrevAbbrev';
import LABEL_PRODUCT from '@salesforce/label/c.Product';
import LABEL_PRODUCTS from '@salesforce/label/c.Products';
import LABEL_PROJECT_LEADS from '@salesforce/label/c.Project_Leads';
import LABEL_PROJECT_MANAGER from '@salesforce/label/c.Project_Manager';
import LABEL_PROJECT_OR_SALES_MGT_TO_COMPLETE from '@salesforce/label/c.Project_or_Sales_Manager_to_Complete'
import LABEL_PROPOSED_IN_MARKET_END_DATE from '@salesforce/label/c.Proposed_In_Market_End_Date';
import LABEL_PROPOSED_IN_MARKET_START_DATE from '@salesforce/label/c.Proposed_In_Market_Start_Date';
import LABEL_RECALL from '@salesforce/label/c.Recall';
import LABEL_RECALL_SUCCESS from '@salesforce/label/c.Recall_Success';
import LABEL_REVIEWED from '@salesforce/label/c.Reviewed';
import LABEL_ROI_PERCENTAGE from '@salesforce/label/c.ROI_Percentage';
import LABEL_SALES_CONTACT from '@salesforce/label/c.Sales_Contact';
import LABEL_SAVE from '@salesforce/label/c.Save';
import LABEL_SELECT_ALL from '@salesforce/label/c.Select_All';
import LABEL_SELECT_ACTIVITY_FOCUS_ITEMS from '@salesforce/label/c.Select_Activity_Focus_Items';
import LABEL_SELECTED from '@salesforce/label/c.Selected';
import LABEL_SMARTSHEET from '@salesforce/label/c.Smartsheet';
import LABEL_STATE from '@salesforce/label/c.State';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';
import LABEL_SUBMIT_FOR_APPROVAL from '@salesforce/label/c.Submit_For_Approval';
import LABEL_SUBMIT_FOR_REVIEW from '@salesforce/label/c.Submit_for_Review';
import LABEL_SUBMIT_FOR_REVIEW_SUCCESS from '@salesforce/label/c.Submit_for_Review_Success';
import LABEL_TOTAL_BUDGETED_COST from '@salesforce/label/c.Total_Budgeted_Cost';
import LABEL_TOTAL_COST_A_P_HELP from '@salesforce/label/c.Total_Cost_A_P_Help';
import LABEL_TOTAL_COST_ADDITIONAL_COGS_HELP from '@salesforce/label/c.Total_Cost_Additional_COGS_Help';
import LABEL_TOTAL_COST_INCREMENTAL_PA_HELP from '@salesforce/label/c.Total_Cost_Incremental_PA_Help';
import LABEL_TOTAL_COST_LUMP_SUM_HELP from '@salesforce/label/c.Total_Cost_Lump_Sum_Help';
import LABEL_TOTAL_CUSTOMER_AP_SPEND_VS_SNS from '@salesforce/label/c.Total_Customer_A_P_Spend_as_perc_of_SNS';
import LABEL_TOTAL_CUSTOMER_AP_BUDGET from '@salesforce/label/c.Total_Customer_A_P_Budget_for_the_financial_year';
import LABEL_TOTAL_CUSTOMER_SNS from '@salesforce/label/c.Total_Customer_SNS_for_the_financial_year';
import LABEL_YES from '@salesforce/label/c.Yes';
import LABEL_WAS_ACTIVITY_RUNNING_LAST_YEAR from '@salesforce/label/c.Was_Activity_Running_Last_Year';
import LABEL_WORKING_PLEASEWAIT from '@salesforce/label/c.Working_PleaseWait';

import userId from '@salesforce/user/Id';

const yesNoOptions = [
    {label: 'Yes (Provide details below)', value: 'yes' },
    { label: 'No', value: 'no' }
];
const stateOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'New South Wales', value: 'NSW' },
    { label: 'Victoria', value: 'VIC' },
    { label: 'Queensland', value: 'QLD' },
    { label: 'South Australia', value: 'SA' },
    { label: 'Western Australia', value: 'WA' },
    { label: 'Tasmania', value: 'TAS' },
    { label: 'Aust. Capital Territory', value: 'ACT' },
    { label: 'Northern Territory', value: 'NT' }
];

const maxNumberOfSteps = 3;

export default class ActivityPreEvaluationForm extends NavigationMixin(LightningElement) {
    labels = {
        activityApprovalDate    : { label: LABEL_ACTIVITY_APPROVAL_DATE },
        activityBrandStrategyObjective : { label: LABEL_ACTIVITY_BRAND_STRATEGY_OBJECTIVE },
        activityCommercialObjective : { label: LABEL_ACTIVITY_COMMERCIAL_OBJECTIVE },
        activityRelationshipObjective : { label: LABEL_ACTIVITY_RELATIONSHIP_OBJECTIVE },
        activityNewTrialObjective : { label: LABEL_ACTIVITY_NEW_TRIAL_OBJECTIVE },
        activityDetails         : { label: LABEL_ACTIVITY_DETAILS },
        activityMechanic        : { label: LABEL_ACTIVITY_MECHANIC, labelPlural: LABEL_ACTIVITY_MECHANICS },
        activityObjectives      : { label: LABEL_ACTIVITY_OBJECTIVES_DESCRIPTION },
        activitySpendVSBudget   : { label: LABEL_ACTIVITY_SPEND_VS_BUDGET },        
        agencyContact           : { label: LABEL_AGENCY_SUPPLIER_CONTACT },
        approved                : { label: LABEL_APPROVED },
        available               : { label: LABEL_AVAILABLE },
        bannerGroup             : { labelPlural: LABEL_BANNER_GROUPS },
        brand                   : { label: LABEL_BRAND, labelPlural: LABEL_BRANDS },
        brandsAndTimings        : { label: LABEL_BRANDS_AND_TIMINGS },
        bpaReview               : { label: LABEL_BPA_REVIEW },
        bpaTeamToComplete       : { label: LABEL_BPA_TEAM_TO_COMPLETE },
        businessOpportunity     : { label: 'What is the Business Opportunity or Challenge?' },
        cancel                  : { label: LABEL_CANCEL },
        channel                 : { label: LABEL_CHANNEL },
        commercialLeadReview    : { label: LABEL_COMMERCIAL_LEAD_REVIEW },
        comments                : { label: LABEL_COMMENTS },
        costDetails             : { label: LABEL_COST_DETAILS },
        costPerThousand         : { label: LABEL_COST_PER_THOUSAND },
        customerBanner          : { label: LABEL_CUSTOMER_BANNER },
        customerContact         : { label: LABEL_CUSTOMER_CONTACT },
        customerType            : { label: LABEL_CUSTOMER_TYPE },
        deselectAll             : { label: LABEL_DESELECT_ALL },
        detachFile              : { label: LABEL_DETACH_FILE, successMessage: LABEL_DETACH_FILE_SUCCESS, confirmation: LABEL_DETACH_FILE_CONFIRMATION},
        detailsOnNatureOfCost   : { label: LABEL_DETAILS_ON_NATURE_OF_COST },
        draft                   : { label: LABEL_DRAFT },
        focusBrands             : { label: LABEL_FOCUS_BRANDS },
        focusProducts           : { label: LABEL_FOCUS_PRODUCTS },
        forecastedCommercialReturn : { label: LABEL_FORECASTED_COMMERCIAL_RETURN },
        forecastedReachCoverage : { label: LABEL_FORECASTED_REACH_COVERAGE },
        help                    : { label: LABEL_HELP },
        incrementalGrossProfit  : { label: LABEL_INCREMENTAL_GROSS_PROFIT },
        incrementalProfitLoss   : { label: LABEL_INCREMENTAL_PROFIT_LOSS },
        info                    : { label: LABEL_INFO },
        inMarketStartDate       : { label: LABEL_PROPOSED_IN_MARKET_START_DATE },
        inMarketEndDate         : { label: LABEL_PROPOSED_IN_MARKET_END_DATE },
        instructions            : { label: LABEL_INSTRUCTIONS, message: LABEL_FORMINSTRUCTIONS },
        keyDates                : { label: LABEL_KEYDATES_TIMING },
        leadChannel             : { label: LABEL_LEAD_CHANNEL },
        marketingContact        : { label: LABEL_MARKETING_CONTACT },
        next                    : { label: LABEL_NEXT },
        no                      : { label: LABEL_NO },
        numberOfStoresInBanner  : { label: LABEL_NUMBER_OF_STORES_IN_BANNER_GROUP },
        numberOfStoresInBannerRunningActivity  : { label: LABEL_NUMBER_OF_STORES_IN_BANNER_GROUP_RUNNING_ACTIVITY },
        objectives              : { label: 'Activity Objectives / Qualitative Considerations' },
        ok                      : { label: LABEL_OK },
        pendingApproval         : { label: LABEL_PENDING_APPROVAL },
        preAlignmentDeadline    : { label: LABEL_PRE_ALIGNMENT_DEADLINE },
        preEvaluationDeadline   : { label: LABEL_PRE_EVALUATION_DEADLINE },
        prev                    : { label: LABEL_PREV },
        product                 : { label: LABEL_PRODUCT, labelPlural: LABEL_PRODUCTS },
        projectLeads            : { label: LABEL_PROJECT_LEADS },
        projectManager          : { label: LABEL_PROJECT_MANAGER },
        projectOrSalesMgrToComplete : { label: LABEL_PROJECT_OR_SALES_MGT_TO_COMPLETE },
        provideDetailsBelow     : { label: 'Provide details below' },
        recall                  : { label: LABEL_RECALL, recalledMessage: LABEL_RECALL_SUCCESS.replace('%0', 'Pre-Evaluation Form') },
        reviewed                : { label: LABEL_REVIEWED },
        roiPercentage           : { label: LABEL_ROI_PERCENTAGE },
        salesContact            : { label: LABEL_SALES_CONTACT },        
        save                    : { label: LABEL_SAVE, message: LABEL_WORKING_PLEASEWAIT },
        saveSuccess             : { message: LABEL_CHANGES_SAVED_SUCCESSFULLY },
        selectAll               : { label: LABEL_SELECT_ALL },
        selectActivityFocusItems : { brands: LABEL_SELECT_ACTIVITY_FOCUS_ITEMS.replace('%0', LABEL_BRANDS), products: LABEL_SELECT_ACTIVITY_FOCUS_ITEMS.replace('%', LABEL_PRODUCTS) },
        selected                : { label: LABEL_SELECTED },
        smartsheet              : { label: LABEL_SMARTSHEET },
        state                   : { label: LABEL_STATE },
        submitForReview         : { label: LABEL_SUBMIT_FOR_REVIEW, submittedMessage: LABEL_SUBMIT_FOR_REVIEW_SUCCESS.replace('%0', 'Form') },
        submitForApproval       : { label: LABEL_SUBMIT_FOR_APPROVAL, submittedMessage: LABEL_APPROVAL_SUBMITTED.replace('%0', 'Pre-Evaluation Form') },
        summary                 : { label: LABEL_SUMMARY },
        totalBudgetedCost       : { label: LABEL_TOTAL_BUDGETED_COST },
        totalCostAP             : { label: 'A&P', help: LABEL_TOTAL_COST_A_P_HELP },
        totalCostAdditionalCOGS : { label: LABEL_ADDITIONAL_COGS, help: LABEL_TOTAL_COST_ADDITIONAL_COGS_HELP },
        totalCostIncrementalPA  : { label: LABEL_INCREMENTAL_PA, help: LABEL_TOTAL_COST_INCREMENTAL_PA_HELP },
        totalCostLumpSum        : { label: LABEL_LUMP_SUM_DISCOUNT, help: '' },
        totalCustomerAPBudget   : { label: LABEL_TOTAL_CUSTOMER_AP_BUDGET },
        totalCustomerAPSpendVsSNS : { label: LABEL_TOTAL_CUSTOMER_AP_SPEND_VS_SNS },
        totalCustomerSNS        : { label: LABEL_TOTAL_CUSTOMER_SNS },
        wasActivityRunningLastYear : { label: LABEL_WAS_ACTIVITY_RUNNING_LAST_YEAR },
        yes                     : { label: LABEL_YES },
    };

    isPhone = (CLIENT_FORM_FACTOR === "Small");

    @api 
    recordId;

    @track
    isEditingForm = true;

    @track
    isWorking = false;

    isSelectingBrands;
    isSelectingProducts;
    isSelectingBannerGroups;


    showInstructionDetail = true;

    get requiresBPAReview() {
        return this.totalBudgetedCost >= 100000;
    }
    get progressStep() {
        let step = "draft";
        if (this.status == 'Commercial Lead Review' || (this.status == 'Commercial Lead Reviewed' && this.totalBudgetedCost >= 100000)) {
            step = "review";
        } else if (this.status == 'BP&A Review') {
            step = "bpa";
        } else if ((this.status == 'Commercial Lead Reviewed' && this.totalBudgetedCost < 100000) || (this.status == 'BP&A Reviewed' && this.totalBudgetedCost >= 100000)) {
            step = 'reviewed';
        } else if (this.status == 'Submitted' || this.status == 'Pending Approval') {
            step = "submitted";
        } else if (this.status == 'Approved') {
            step = "approve";
        } else if (this.status == 'Published') {
            step = "publish";
        } else {
            step = "draft";
        }

        console.log('[getprogressstep] status, step', this.status, step);
        return step;
    }

    workingMessage = '';

    projectManager;
    marketingContact;
    salesContact;
    customerContact;
    agencyContact;

    proposedInMarketStartDate;
    proposedInMarketEndDate;
    preAlignmentDeadline;
    preEvaluationDeadline;
    activityApprovalDate;
    status = 'Draft';
    channel;
    channelOptions;
    channelComments;
    publishActivity = false;
    activityCommunicationIncludesOther = false;

    customerType;
    customerTypeOptions;

    customerBanner;
    banners;

    smartsheetLink;

    businessOpportunity;
    activityObjective;

    yesNoOptions = yesNoOptions;
    stateOptions = stateOptions;

    activityMechanics = [];

    brandStrategyIndex = 0;
    commercialReturnIndex = 0;
    customerRelationshipIndex = 0;
    newExperientialIndex = 0;
    
    totalBudgetedCost;
    totalBudgetedCostAP;
    totalBudgetedCostCOGS;
    totalBudgetedCostPA;
    totalBudgetedCostLumpSum;
    incrementalGrossProfit;
    incrementalGrossProfitChanged;
    incrementalGrossProfitSales;
    incrementalGrossProfitSalesChanged;
    forecastedReachCoverage;
    businessOpportunity;
    activityObjectives;
    evaluationComments;
    salesComments;
    bpaComments;
    activityComments;
    natureOfCostDescription;
    activityAdditionalComments;
    incremental9LUplift;

    totalCustomerAPBudget;
    totalCustomerSNS;

    activityCommunicationMethods = [];

    @track
    attachedFiles;
    
    @track
    wasActivityRunningLastYear;

    @track 
    incrementalDiscountsProvided;    

    focusBrands = [];
    focusProducts = [];
    focusBannerGroups = [];

    stepIndex = 1;
    get isStepOne() {
        return this.stepIndex == 1;
    }
    get isStepTwo() {
        return this.stepIndex == 2;
    }
    get isStepThree() {
        return this.stepIndex == 3;
    }
    get isLastStep() {
        return this.stepIndex == maxNumberOfSteps;
    }
    get requiresCommercialLeadReview() {
        return this.totalBudgetedCost > 20000;
    }
    get requiredBPAReview() {
        return this.totalBudgetedCost > 100000;
    }
    get canSubmitForReview() {
        //return this.theActivity && this.theActivity.Status__c == 'Draft' && this.theActivity.Activity_Budget__c > 0;
        var canSubmit = false;
        if (this.theActivity) {
            if (this.theActivity.Status__c == 'Pending Approval' || this.theActivity.Status__c == 'Approved') {
                canSubmit = false;
            } else if (this.theActivity.Project_Manager__c != userId) {
                canSubmit = false;
            } else {
                console.log('budget: ', this.theActivity.Activity_Budget__c);
                console.log('sales gp', this.theActivity.Incremental_Gross_Profit_Sales__c);
                console.log('bp&a gp', this.theActivity.Incremental_Gross_Profit__c);
                if (this.theActivity.Activity_Budget__c > 20000 && (this.theActivity.Incremental_Gross_Profit_Sales__c == undefined || this.theActivity.Incremental_Gross_Profit_Sales__c == 0)) {
                    canSubmit = true;
                } else if (this.theActivity.Activity_Budget__c >= 100000 && (this.theActivity.Incremental_Gross_Profit_Sales__c == undefined || this.theActivity.Incremental_Gross_Profit_Sales__c == 0 || this.theActivity.Incremental_Gross_Profit__c == undefined || this.theActivity.Incremental_Gross_Profit__c == 0)) {
                    canSubmit = true;
                }
            }
            /*
            if (this.theActivity.Status__c == 'Draft' && this.theActivity.Activity_Budget__c > 20000 && this.theActivity.Incremental_Gross_Profit_Sales__c == 0) {
                canSubmit = true;
            } else if (this.theActivity.Status__c == 'Review' && this.theActivity.Activity_Budget__c > 100000 && this.theActivity.Incremental_Gross_Profit_Sales__c > 0) {
                canSubmit = true;
            }
            */
        }

        return canSubmit;
    }
    get canSubmitForApproval() {
        //return this.theActivity && this.theActivity.Activity_Budget__c > 0;
        let canSubmit = false;
        if (this.theActivity && (this.theActivity.Project_Manager__c == userId || this.theActivity.CreatedById == userId)) {
            console.log('[canSubmitForApproval] budget: ', this.theActivity.Activity_Budget__c);
            console.log('[canSubmitForApproval] status', this.status);
            if (this.theActivity.Activity_Budget__c > 0 && this.theActivity.Activity_Budget__c < 20000 && this.status == 'Draft') {
                canSubmit = true;
            } else if (this.theActivity.Activity_Budget__c > 0 && this.theActivity.Activity_Budget__c < 100000 && this.theActivity.Incremental_Gross_Profit_Sales__c > 0 && (this.status == 'Draft' || this.status == 'Commercial Lead Reviewed')) {
                canSubmit = true;
            } else if (this.theActivity.Activity_Budget__c > 0 && this.theActivity.Activity_Budget__c >= 100000 && this.theActivity.Incremental_Gross_Profit__c > 0 && this.status == 'BP&A Reviewed') {
                canSubmit = true;
            }    
        }
        console.log('[canSubmitForApproval] canSubmit', canSubmit);

        return canSubmit;
        
    }
    get canRecallApproval() {
        return this.theActivity && (this.theActivity.Status__c == 'Submitted' || this.theActivity.Status__c == 'Pending Approval');
    }
    get isLocked() {
        return this.theActivity && (this.theActivity.Status__c == 'Submitted' || this.theActivity.Status__c == 'Approved');
    }
    get activityName() {
        return this.theActivity == null ? '' : this.theActivity.Name;
    }
    get panNumber() {
        return this.theActivity == null ? '' : this.theActivity.Promotion_Activity_Number__c;
    }
    get isOtherChannel() {
        return this.channel == 'Other';
    }
    get isOffChannel() {
        return this.channel == 'Off';
    }
    get isOtherBanner() {
        return this.customerBanner == 'Other';
    }
    get formattedProposedInMarketStartDate() {        
        return this.proposedInMarketStartDate == null ? null : this.proposedInMarketStartDate.toISOString();
    }
    get formattedProposedInMarketEndDate() {
        return this.proposedInMarketEndDate == null ? null : this.proposedInMarketEndDate.toISOString();
    }
    get formattedPreAlignmentDeadline() {
        return this.preAlignmentDeadline == null ? null : this.preAlignmentDeadline.toISOString();
    }
    get formattedPreEvaluationDeadline() {
        return this.preEvaluationDeadline == null ? null : this.preEvaluationDeadline.toISOString();
    }
    get formattedActivityApprovalDate() {
        return this.activityApprovalDate == null ? null : this.activityApprovalDate.toISOString();
    }
    get incrementalROISales() {
        const totalAmount = this.totalBudgetedCost == undefined ? 0 : this.totalBudgetedCost;
        if (totalAmount == 0) {
            return 0;
        } else {
            console.log('incrementalROISales', (this.incrementalProfitLossSales / totalAmount));
            return this.incrementalProfitLossSales / totalAmount;            
        }
    }
    get incrementalROI() {
        let roi = 0;
        try {
            const totalAmount = this.totalBudgetedCost == null ? 0 : this.totalBudgetedCost;
            const pl = this.incrementalProfitLoss == null ? 0 : this.incrementalProfitLoss;
            if (totalAmount != 0) {
                roi = pl / totalAmount;
            }
            console.log('incrementalROI', roi);
        }catch(ex) {
            console.log('incrementalROI exception', ex);            
        }
        return roi;
    }
    get forecastedCostPerThousand() {
        const totalAmount = this.totalBudgetedCost == null ? 0 : this.totalBudgetedCost;
        const reach = this.forecastedReachCoverage == null ? 0 : this.forecastedReachCoverage / 1000;
        let cpt = 0;
        if (reach != 0) {
            cpt = totalAmount / reach;
        }
        return cpt;
    }
    get incrementalProfitLoss() {
        console.log('budgetcost, gp', this.totalBudgetedCost, this.incrementalGrossProfit);
        return this.incrementalGrossProfit - this.totalBudgetedCost;
    }
    get incrementalProfitLossSales() {
        return this.totalBudgetedCost == undefined ? this.incrementalGrossProfitSales : this.incrementalGrossProfitSales - this.totalBudgetedCost;
    }
    get activitySpendPercentage() {
        return this.totalCustomerAPBudget == undefined || this.totalCustomerAPBudget == 0 ? 0 : this.totalBudgetedCost / this.totalCustomerAPBudget;
    }
    get totalCustomerAPSpendVSSNS() {
        return this.totalCustomerSNS == undefined || this.totalCustomerSNS == 0 ? 0 : this.totalCustomerAPBudget / this.totalCustomerSNS;
    }

    allProductsSelected = false;
    get selectAllProductsLabel() {
        return this.allProductsSelected ? this.labels.deselectAll.label : this.labels.selectAll.label;
    }

    @wire(CurrentPageReference) pageRef;

    @wire(getIsAdminUser)
    isAdminUser;

    get isNotAdminUser() {
        return this.isAdminUser.data == false;
    }
    get isProjectManager() {
        console.log('[isProjectManager] projectManager.id, userId', this.projectManager.id, userId);
        return this.projectManager == undefined ? false : this.projectManager.id == userId;
    }
    get isSalesManager() {
        return this.salesContact == undefined ? false : this.salesContact.id == userId;
    }
    get canEditSalesManagerFields() {
        console.log('[canEditSalesManagerFields] isEditable, isAdminUser, isSalesManager, isProjectManager, requiresCommercialLeadReview', this.isEditable, this.isAdminUser, this.isSalesManager, this.isProjectManager, this.requiresCommercialLeadReview);
        return this.isEditable && !this.isLocked && (this.isAdminUser.data == true || this.isSalesManager || this.isProjectManager) && this.requiresCommercialLeadReview;
    }
    get cannotEditSalesManagerFields() {
        return !this.canEditSalesManagerFields;
    }
    get canEditBPAFields() {        
        console.log('[canEditBPAFields] isEditable, isLocked, isAdminUser, requiresBPAReview', this.isEditable, this.isLocked, this.isAdminUser, this.requiresBPAReview);
        return this.isEditable && !this.isLocked && this.isAdminUser.data == true && this.requiresBPAReview;
    }
    get cannotEditBPAFields() {
        console.log('[cannotEditBPAFields] canEditBPAFields', this.canEditBPAFields);
        return !this.canEditBPAFields;
    }
    get isEditable() {
        return this.objectInfo == undefined || this.objectInfo.data == undefined ? true : this.objectInfo.data.updateable;
    }

    finishedLoadingBrandsAndProducts = false;
    finishedLoadingBannerGroups = false;
    finishedLoadingForm = false;
    finishedLoadingObjectInfo = false;

    error;
    theActivity;
    wiredActivity;
    @wire(getActivity, { activityId: '$recordId'})
    getWiredActivity(value) {
        console.log('[getWiredActivity] value', value);
        this.wiredActivity = value;
        if (value.error) {

        } else if (value.data) {
            this.error = undefined;
            this.theActivity = value.data;
            this.recordTypeId = value.data.RecordTypeId;
            this.finishedLoadingForm = true;
            if (this.finishedLoadingBannerGroups && this.finishedLoadingObjectInfo && this.finishedLoadingBrandsAndProducts) {
                this.loadPreEvaluationForm();
            }
        }
    }

    objectInfo;
    @wire(getObjectInfo, { objectApiName: 'Promotion_Activity__c'})
    wiredGetObjectInfo(value) {
        this.objectInfo = value;
        console.log('[getObjectInfo] value', value);
    }

    picklistValuesMap;
    @wire(getPicklistValuesByRecordType, { objectApiName: { objectApiName: 'Promotion_Activity__c' }, recordTypeId: '$recordTypeId' })
    wiredPicklistValues({ error, data }) {
        console.log('[getPicklistValues] data', data);
        console.log('[getPicklistValues] error', error);
        if (data) {
            this.error = undefined;
            this.picklistValuesMap = data.picklistFieldValues;
            this.setFieldOptions(data.picklistFieldValues);            
        } else if (error) {
            this.error = error;
            this.picklistValuesMap = undefined;
            this.finishedLoadingObjectInfo = true;
        }
    }

    market;
    marketName;
    userDetails;
    wiredUserDetails;
    @wire(getUserDetails)
    wiredGetUserDetails(value) {
        this.wiredUserDetails = value;
        if (value.error) {
            this.error = value.error;
            this.userDetails = undefined;
        } else if (value.data) {
            this.error = undefined;
            this.userDetails = value.data;
            this.market = value.data.marketId;
            this.marketName = value.data.marketName;
        }
    }

    bannerGroups = [];
    selectedBannerGroups = [];
    visibleBannerGroups = [];
    bannerGroupsSelected = [];
    bannerGroupsToDelete = [];
    removedBannerGroups = [];
    bannerGroupOptions = [];
    nationalBannerGroups;
    wiredNationalBannerGroups;
    @wire(getBannerGroups, { market: '$market' })
    wiredGetNationalBannerGroups(value) {
        this.wiredNationalBannerGroups = value;
        if (value.error) {
            this.error = value.error;
            this.nationalBannerGroups = undefined;
        } else if (value.data) {
            this.error = undefined;
            const groups = value.data.map(bg => ({ 
                label: bg.Name, 
                value: bg.Id,
                id: bg.Id, 
                name: bg.Name, 
                imageUrl: bg.Image_Name__c != null ? 'https://salesforce-static.b-fonline.com/images/'+ bg.Image_Name__c : '',
                isSelected: false
            }));
            groups.push({label: 'Other', value: 'Other', id: 'Other', name: 'Other', imageUrl: '', isSelected: false});
            groups.sort(function(a, b) {
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0; 
            });
            this.nationalBannerGroups = groups;
            this.bannerGroupOptions = [...groups];
            //this.visibleBannerGroups = [...groups];
            this.finishedLoadingBannerGroups = true;
            if (this.finishedLoadingForm && this.finishedLoadingObjectInfo && this.finishedLoadingBrandsAndProducts) {
                this.loadPreEvaluationForm();
            }
        }
    }

    brands;
    brandsSelected = [];
    visibleBrands = [];
    products;
    productsSelected = [];
    allProducts = [];    
    wiredProducts;
    @wire(getProducts, { market: '$market' })
    wiredGetProducts(value) {
        this.wiredProducts = value;
        if (value.error) {
            this.error = value.error;
            this.products = undefined;
            this.brands = undefined;
        } else if (value.data) {
            this.error = undefined;
            //this.products = value.data;
            this.products = [];
            this.brands = [];
            const brandIds = [];
            console.log('objActivity', OBJECT_ACTIVITY);
            value.data.forEach(p => {                
                if (brandIds.indexOf(p.Brand__c) < 0) {
                    brandIds.push(p.Brand__c);
                    this.brands.push({
                        id: p.Brand__c, 
                        name: p.Brand_Name__c, 
                        imageUrl: p.Brand__r.Primary_Logo__c != undefined ? 'https://salesforce-static.b-fonline.com/images/brand_logos/'+ p.Brand__r.Primary_Logo__c : '',
                        isSelected: false
                    });
                }
                this.allProducts.push({
                    id: p.Id,
                    name: p.Name,
                    imageUrl: p.Image_Name__c != undefined ? 'https://salesforce-static.b-fonline.com/images/'+p.Image_Name__c : '',
                    brand: p.Brand__c,
                    brandName: p.Brand_Name__c
                });
            });

            this.brands.sort(function(a, b) { 
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0; 
            });
            this.visibleBrands = [...this.brands];
            console.log('[getproducts] brands', this.brands);
            console.log('[getproducts] products', this.products);

            this.finishedLoadingBrandsAndProducts = true;
            if (this.finishedLoadingForm && this.finishedLoadingBannerGroups && this.finishedLoadingObjectInfo) {
                this.loadPreEvaluationForm();
            }
        }
    }

    /*
    constructor() {
        super();

        this.addEventListener('selected', this.handleLookupItemSelected.bind(this));
    }
    */

    handleCancelButtonClick() {
        try {
            this.isWorking = true;
            this[NavigationMixin.Navigate]({
                type: 'standard__objectPage',
                attributes: {
                    objectApiName: 'Promotion_Activity__c',
                    actionName: 'list'
                },
                state: {
                    filterName: 'Australia_All_Active_Activites'
                }
            });
        } catch(ex) {
            console.log('[cancel button click] ex', ex);
        }

    }
    handleSaveButtonClick() {
        console.log('[savebuttonclick]');
        this.save();
    }
    handleSubmitForReviewButtonClick() {
        try {
            this.isWorking = true;
            console.log('[handleSubmitForReviewButtonClick]');
            const fields = {};
            fields[FIELD_ID.fieldApiName] = this.recordId;
            
            if (this.theActivity.Incremental_Gross_Profit_Sales__c == null || parseFloat(this.theActivity.Incremental_Gross_Profit_Sales__c) == 0) {
                this.status = 'Commercial Lead Review';
            } else {
                console.log('[handleSubmitForReviewButtonClick] incremental gp sales is filled in');
                this.status = 'BP&A Review';
            }
            console.log('[handleSubmitForReviewButtonClick] status, incrementalGrossProfitSales, gp', this.status, this.theActivity.Incremental_Gross_Profit_Sales__c, parseFloat(this.theActivity.Incremental_Gross_Profit_Sales__c));
            fields[FIELD_STATUS.fieldApiName] = this.status;
            const recordInput = { fields };
            updateRecord(recordInput) 
            .then(() => {
                this.isWorking = false;
                console.log('[handleSubmitForReviewButtonClick] success. isWorking', this.isWorking);
                this.showToast('success','Success', this.labels.submitForReview.submittedMessage);
            })
            .catch(error => {
                this.error = error;
                this.isWorking = false;
                this.showToast('error','Error', error.body.message);
            });    
        } catch(ex) {
            console.log('[handleSubmitForReviewButtonClick] exception', ex);
            this.isWorking = false;
        }

    }
    handleSubmitForApprovalButtonClick() {
        this.isWorking = true;
        submitForApproval({ activityId: this.recordId })
            .then(result => {
                console.log('[submitforapproval] result', result);
                this.isWorking = false;
                if (result == 'OK') {
                    this.status = 'Pending Approval';
                    this.showToast('success','Success', this.labels.submitForApproval.submittedMessage);
                } else {
                    this.showToast('error', 'Warning', result);
                }
            })
            .catch(error => {
                console.log('[submitforapprova] error', error);
                this.isWorking = false;
                this.error = error;
                this.showToast('error', 'Warning', error);
            });

    }
    handleRecallButtonClick() {
        this.isWorking = true;
        recallApproval({activityId: this.recordId })
            .then(result => {
                this.isWorking = false;
                if (result == 'OK') {
                    this.status = 'Reviewed';
                    this.showToast('success', 'Success', this.labels.recall.recalledMessage);
                } else {
                    this.showToast('error', 'Warning', msg);
                }
            })
            .catch(error => {
                this.isWorking = false;
                this.error = error;
                this.showToast('error', 'Warning', error);
            });

    }
    handleSummaryButtonClick() {
        // navigate to Summary page
        this.isWorking = true;
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__ActivityPreEvaluationFormSummaryContainer'
            },
            state: {
                c__activityId: this.recordId
            }
        });

    }
    handlePrevButtonClick() {
        this.stepIndex = this.stepIndex - 1;
    }
    handleNextButtonClick() {
        this.stepIndex = this.stepIndex + 1;
    }

    handleBrandSearchChange(event) {
        console.log('[handlebrandsearchchange] brand search', event.detail.value);
        try {
            const searchTerm = event.detail.value.toLowerCase();            
            this.visibleBrands = this.brands.filter(b => b.name.toLowerCase().includes(searchTerm));
            console.log('[handlebrandsearchchange] visible brands', this.visibleBrands);
        }catch(ex) {
            console.log('[handlebrandsearchchange] exception', ex);
        }
    }
    handleAddBrandsButtonClick(event) {
        this.isSelectingBrands = true;
        this.isEditingForm = false;
        console.log('isselectingbrands', this.isSelectingBrands);
        console.log('iseditingform', this.isEditingForm);
    }
    handleRemoveBrand(event) {
        if (this.isLocked) {
            this.showToast('warning', 'Warning', 'You cannot remove brands from the Activity after it has been approved');
            return;
        }

        const response = confirm(this.labels.detachFile.confirmation.replace('{0}', event.detail.item.label));
        if (response == true) {            
            try {
                const brandId = event.detail.item.brandId;
                const idx = this.brandsSelected.indexOf(brandId);
                if (idx >= 0) {
                    this.brandsSelected.splice(idx, 1);
                    if (this.productsSelected && this.productsSelected.length > 0) {
                        const l = this.productsSelected.filter(p => p.brand != brandId);
                        this.productsSelected = [...l];
                        const lp = this.focusProducts.filter(fp => fp.brandId != brandId);
                        this.focusProducts = [...lp];
                    }
                }
            }catch(ex) {
                console.log('removebrand.exception', ex);
            }
        } 

    }
    handleCancelBrandSelectionClick() {
        this.isSelectingBrands = false;
        this.isEditingForm = true;
    }
    handleCloseBrandSelectionClick() {
        try {
            console.log('selected brands', this.brandsSelected);
            this.focusBrands = this.brandsSelected.map(bs => {
                const b = this.brands.find(b => bs == b.id );
                console.log('b', b);
                return {
                        type: 'avatar',
                        label: b.name,
                        src: b.imageUrl,
                        fallbackIconName: 'standard:user',
                        variant: 'circle',
                        alternativeText: b.name,
                        isLink: false,
                        brandId: b.id
                }
            });
            console.log('focusbrands', this.focusBrands);
            this.products = this.allProducts.filter(p => this.brandsSelected.indexOf(p.brand) >= 0);
            console.log('[products] ', this.products);
            console.log('[allproducts] ', this.allProducts);
            this.isSelectingBrands = false;
            this.isEditingForm = true;
    
        }catch(ex) {
            console.log('exception', ex);
        }
    }
    handleBrandSelected(event) {
        if (event.detail.isSelected) {
            if (this.brandsSelected.indexOf(event.detail.id) < 0) {
                this.brandsSelected.push(event.detail.id);            
            }    
        } else {
            const index = this.brandsSelected.indexOf(event.detail.id);
            if (index > -1) {
                this.brandsSelected.splice(index, 1);
            }    
        }
    }

    handleSelectAllProductForBrandClick() {
        this.allProductsSelected = !this.allProductsSelected;
        fireEvent(this.pageRef, 'selectTile', this.allProductsSelected);
        if (this.allProductsSelected) {
            this.products.forEach(p => {
                if (this.productsSelected.indexOf(p.id) <= 0) {
                    this.productsSelected.push(p.id);
                }
            });
        } else {
            this.productsSelected = [];        
        }
    }
    handleAddProductsButtonClick(event) {
        this.isSelectingProducts = true;
        this.isEditingForm = false;
        console.log('isselectingbrands', this.isSelectingBrands);
        console.log('iseditingform', this.isEditingForm);
    }
    handleCancelProductSelectionClick() {
        this.isSelectingProducts = false;
        this.isEditingForm = true;
    }
    handleCloseProductSelectionClick() {
        try {
            console.log('selected products', this.productsSelected);
            this.focusProducts = this.productsSelected.map(ps => {
                const p = this.products.find(p => ps == p.id );
                console.log('p', p);
                return {
                        type: 'avatar',
                        label: p.name,
                        src: p.imageUrl,
                        fallbackIconName: 'standard:user',
                        variant: 'circle',
                        alternativeText: p.name,
                        isLink: false,
                        productId: p.id,
                        brandId: p.brand
                }
            });
            console.log('focusproducts', this.focusProducts);
            this.isSelectingProducts = false;
            this.isEditingForm = true;
    
        }catch(ex) {
            console.log('exception', ex);
        }
    }
    handleProductSelected(event) {
        console.log('[handleProductSelection] productId', event.detail.id);
        console.log('[handleProductSelection] isSelected', event.detail.isSelected);
        const index = this.productsSelected.indexOf(event.detail.id);
        console.log('[handleProductSelection] index', index);
        if (event.detail.isSelected) {
            if (index < 0) {
                this.productsSelected.push(event.detail.id);            
            }    
        } else {
            console.log('[handleProductSelection] removing product from list');
            if (index > -1) {
                this.productsSelected.splice(index, 1);
            }    
        }
        console.log('[handleProductSelected] productsSelection', this.productsSelected);
    }
    handleProductDeSelected(event) {
    }
    handleRemoveProduct(event) {
        if (this.isLocked) {
            this.showToast('warning', 'Warning', 'You cannot remove products from the Activity after it has been approved');
            return;
        }

        const productId = event.detail.item.productId;
        const index = this.productsSelected.indexOf(productId);
        this.productsSelected.splice(index, 1);

        const l = this.focusProducts.filter(fp => fp.productId != productId);
        this.focusProducts = [...l];
    }

    handleInstructionsExpandButtonClick(event) {
        this.showInstructionDetail = !this.showInstructionDetail;
    }

    handleLookupSelected(event) {
        try {
            console.log('[activitypreevalform.handlelookupselected] item id', event.detail.itemId);
            console.log('[activitypreevalform.handlelookupselected] item name', event.detail.itemName);    
            console.log('[activitypreevalform.handlelookupselected] fieldname', event.detail.fieldName);
            console.log('[activitypreevalform.handlelookupselected] imageUrl', event.detail.imageUrl);
            const item = {
                id: event.detail.itemId,
                name: event.detail.itemName,
                imageUrl: event.detail.imageUrl
            };
            if (event.detail.fieldName == 'projectmanager') {
                this.projectManager = item;
            } else if (event.detail.fieldName == 'marketingcontact') {
                this.marketingContact = item;
            } else if (event.detail.fieldName == 'salescontact') {
                this.salesContact = item;
            }
        }catch(ex) {
            console.log('[activitypreevalform.handlelookupselected] exception', ex);
        }
    }
    handleLookupItemChange(event) {
        if (this.isLocked) {
            this.showToast("warning", "Warning", "You cannot change contacts after the activity has been approved");
            return;
        }

        try {
            console.log('[handlelookupchange] event.detail', event.detail);
            if (event.detail == 'projectmanager') {
                this.projectManager = undefined;
            } else if (event.detail == 'marketingcontact') {
                this.marketingContact = undefined;
            } else if (event.detail == 'salescontact') {
                this.salesContact = undefined;
            }
        }catch(ex) {
            console.log('[handlelookupchange] exception', ex);
        }
    }

    handleChannelChange(event) {
        this.channel = event.detail.value;
    }
    handleCustomerTypeChange(event) {
        this.customerType = event.detail.value;
    }
    handleStateChange(event) {
        this.states = event.detail.value;
        console.log('[handleStateChange] state', this.states);
    }
    handleCustomerContactChange(event) {
        this.customerContact = event.detail.value;
        console.log('customer contact', this.customerContact);
    }
    handleAgencyContactChange(event) {
        this.agencyContact = event.detail.value;
    }
    handleNumberOfStoresChange(event) {
        this.numberOfStoresInBanner = event.detail.value;
    }
    handleStoresRunningActivityChange(event) {
        this.numberOfStoresRunningActivity = event.detail.value;
    }
    handleLastYearActivityChange(event) {
        this.wasActivityRunningLastYear = event.detail.value;
    }
    handleLastYearActivityDetailsChange(event) {
        this.lastYearActivityDetails = event.detail.value;
    }
    handleChannelCommentsChange(event) {
        this.channelComments = event.detail.value;        
        console.log('[channelcomments] comments', this.channelComments);
    }
    handleEvaluationCommentsChange(event) {
        this.evaluationComments = event.detail.value;
    }
    handleSalesCommentsChange(event) {
        this.salesComments = event.detail.value;
    }
    handleBPACommentsChange(event) {
        this.bpaComments = event.detail.value;
    }
    handleActivityMechanicDescriptionChange(event) {
        this.activityMechanicDescription = event.detail.value;
    }
    handleFocusBrandsChange(event) {
        this.focusBrands = event.detail.value;
    }
    handleFocusSKUSChange(event) {
        this.focusSKUS = event.detail.value;
    }
    handleActivityMechanicChange(event) {
        this.activityMechanics = event.detail.value;
    }
    handleBannerGroupChange(event) {
        this.bannerGroups = event.detail.value;
    }
    handleActivityCommentsChange(event) {
        this.activityComments = event.detail.value;
    }
    handleProposedInMarketStartDateChange(event) {
        this.proposedInMarketStartDate = new Date(event.detail.value);
    }
    handleProposedInMarketEndDateChange(event) {
        this.proposedInMarketEndDate = new Date(event.detail.value);
    }
    handlePreAlignmentDeadlineChange(event) {
        this.preAlignmentDeadline = new Date(event.detail.value);
    }
    handlePreEvaluationDeadline(event) {
        this.preEvaluationDeadline = new Date(event.detail.value);
    }
    handleActivityApprovalDate(event) {
        this.activityApprovalDate = new Date(event.detail.value);
    }
    handleBusinessOpportunityChange(event) {
        this.businessOpportunity = event.detail.value;
    }
    handleActivityObjectivesChange(event) {
        this.activityObjectives = event.detail.value;
    }
    handleBrandStrategyIndexChange(event) {
        this.brandStrategyIndex = event.target.value;
    }
    handleCommercialReturnIndexChange(event) {
        this.commercialReturnIndex = event.target.value;
    }
    handleCustomerRelationshipIndexChange(event) {
        this.customerRelationshipIndex = event.target.value;
    }
    handleExperientialIndexChange(event) {
        this.newExperientialIndex = event.target.value;
    }
    handleTotalBudgetedAPChange(event) {
        console.log('[handletotalbudgetedapchange] value', event.detail.value);
        this.totalBudgetedCostAP = event.detail.value;
        this.calcTotalBudgetedCost();
    }
    handleTotalBudgetedCOGSChange(event) {
        this.totalBudgetedCostCOGS = event.detail.value;
        this.calcTotalBudgetedCost();
    }
    handleTotalBudgetedPAChange(event) {
        this.totalBudgetedCostPA = event.detail.value;
        this.calcTotalBudgetedCost();
    }
    handleTotalBudgetedLumpSumChange(event) {
        this.totalBudgetedCostLumpSum = event.detail.value;
        this.calcTotalBudgetedCost();
    }
    handleTotalCustomerAPBudgetChange(event) {
        this.totalCustomerAPBudget = event.detail.value;
    }
    handleTotalCustomerSNSChange(event) {
        this.totalCustomerSNS = event.detail.value;
    }
    handleNatureOfCostDescription(event) {
        this.natureOfCostDescription = event.detail.value;
    }
    handleActivityAdditionalCommentsChange(event) {
        this.activityAdditionalComments = event.detail.value;
    }
    handleIncrementalDiscountChange(event) {
        this.incrementalDiscount = event.detail.value;
    }
    handleIncremental9LUpliftChange(event) {
        this.incremental9LUplift = event.detail.value;
    }
    handleCommunicationMethodChange(event) {
        try {
            console.log('[handleCommunicationMethodChange] event', event.detail.name, event.detail.field, event.detail.value);
            if (event.detail == undefined || event.detail.name == undefined) { return; }

            const acm = this.activityCommunicationMethods.find(a => a.Name == event.detail.name);        
            console.log('[handleCommunicationMethodchange] acm', acm);
            if (event.detail.field == 'primary') {
                acm.Primary__c = event.detail.value;
            } else if (event.detail.field == 'secondary') {
                acm.Secondary__c = event.detail.value;
            } else if (event.detail.field == 'reach') {
                acm.Reach__c = event.detail.value;
                acm.Primary__c = acm.Reach__c != '';
                this.forecastedReachCoverage = 0;
                this.activityCommunicationMethods.forEach(acm => this.forecastedReachCoverage = this.forecastedReachCoverage + parseInt(acm.Reach__c));
            }
            //this.activityCommunicationIncludesOther = this.activityCommunicationMethods.find(acm => acm.Name == 'Other').Primary__c == true;
            //this.activityCommunicationIncludesOther = (acm != null && acm.Name == 'Other' && acm.Primary__c);
            console.log('[handleCommunicationMethodCHange] communication methods', this.activityCommunicationMethods);
        }catch(ex) {
            console.log('[handleCommunicationMethodChange] exception', ex);            
        }
    }
    handleActivityCommunicationMethodChange(event) {
        this.activityCommunicationMethods = event.detail.value;
    }
    handlePublishActivityChange(event) {
        this.publishActivity = event.detail.checked;
    }
    handleActivityRunningLastYearChange(event) {
        this.wasActivityRunningLastYear = event.detail.checked;
        console.log('was activity running last year', this.wasActivityRunningLastYear);
    }
    handleIncrementalDiscountsProvidedChange(event) {
        this.incrementalDiscountsProvided = event.detail.checked;
    }
    handleIncrementalGrossProfitSalesChange(event) {
        this.incrementalGrossProfitSales = event.detail.value;
    }
    handleIncrementalGrossProfitChange(event) {
        this.incrementalGrossProfit = event.detail.value;
    }
    handleForecastedReachCoverage(event) {
        this.forecastedReachCoverage = event.detail.value;
    }
    handleForecastedCostPerThousand(event) {
        this.forecastedCostPerThousand = event.detail.value;
    }
    handleSmartsheetLinkChange(event) {
        this.smartsheetLink = event.detail.value;
    }    

    /**
     * Helper functions
     */
    setFieldOptions(picklistValues) {
        console.log('[setFieldOptions] picklistValues', picklistValues);
        Object.keys(picklistValues).forEach(picklist => {            
            if (picklist === 'Channel__c') {
                this.channelOptions = this.setFieldOptionsForField(picklistValues, picklist);                
            }
            if (picklist === 'Customer_Type__c') {
                this.customerTypeOptions = this.setFieldOptionsForField(picklistValues, picklist);
            }
            if (picklist === 'Activity_Communication_Methods__c') {
                this.activityCommunicationMethodOptions = this.setFieldOptionsForField(picklistValues, picklist);
                this.activityCommunicationMethods = this.activityCommunicationMethodOptions.map(acm => {
                    return {
                        Id: null,
                        Name: acm.value,
                        Primary__c: false,
                        Secondary__c: false,
                        Reach__c: 0
                    }
                });
            }
            if (picklist === 'Activity_Mechanic__c') {
                this.activityMechanicOptions = this.setFieldOptionsForField(picklistValues, picklist);
            }
        });

        this.finishedLoadingObjectInfo = true;
        if (this.finishedLoadingForm && this.finishedLoadingBannerGroups && this.finishedLoadingBrandsAndProducts) { 
            this.loadPreEvaluationForm();
        }
        
    }
    
    setFieldOptionsForField(picklistValues, picklist) {        
        console.log('[setFieldOptionsForField] picklist field', picklist);
        return picklistValues[picklist].values.map(item => ({
            label: item.label, value: item.value
        }));
    }

    showToast(type, title, message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: type == undefined ? 'success' : type 
            }),
        );
    }
    calcTotalBudgetedCost() {
        const ap = parseFloat(this.totalBudgetedCostAP || 0);
        const pa = parseFloat(this.totalBudgetedCostPA || 0);
        const ls = parseFloat(this.totalBudgetedCostLumpSum || 0);
        const cogs = parseFloat(this.totalBudgetedCostCOGS || 0);

        this.totalBudgetedCost = ap + pa + ls + cogs;
    }


    loadPreEvaluationForm() {
        if (this.theActivity.Project_Manager__c) {
            this.projectManager = { id: this.theActivity.Project_Manager__c, name: this.theActivity.Project_Manager__r.Name, imageUrl: this.theActivity.Project_Manager__r.SmallPhotoUrl };    
        }
        if (this.theActivity.Marketing_Manager__c) {
            this.marketingContact = { id: this.theActivity.Marketing_Manager__c, name: this.theActivity.Marketing_Manager__r.Name, imageUrl: this.theActivity.Marketing_Manager__r.SmallPhotoUrl };
        }
        if (this.theActivity.Sales_Manager__c) {
            this.salesContact = { id: this.theActivity.Sales_Manager__c, name: this.theActivity.Sales_Manager__r.Name, imageUrl: this.theActivity.Sales_Manager__r.SmallPhotoUrl };
        }
        this.customerContact = this.theActivity.Customer_Contact__c;
        this.agencyContact = this.theActivity.Agency_Contact__c;

        this.numberOfStoresInBanner = this.theActivity.Number_of_Stores_in_Banner_Group__c;
        this.numberOfStoresRunningActivity = this.theActivity.No_of_Stores_in_Banner_Running_Activity__c;
        this.wasActivityRunningLastYear = this.theActivity.Was_Activity_Running_Last_Year__c;
        this.lastYearActivityDetails = this.theActivity.Last_Year_Activity_Details__c;

        if (this.theActivity.State_MP__c) {
            this.states = [...this.theActivity.State_MP__c.split(';')];
        }
        console.log('[load] this.states', this.states);

        this.smartsheetLink = this.theActivity.Smartsheet_Link__c;

        this.publishActivity = this.theActivity.Publish_Activity__c == undefined ? false : this.theActivity.Publish_Activity__c;
        console.log('[load] publishactivity', this.publishActivity, this.theActivity.Publish_Activity__c);

        this.status = this.theActivity.Status__c;
        this.channel = this.theActivity.Channel__c;
        this.customerType = this.theActivity.Customer_Type__c;
        //this.customerBanner = this.theActivity.National_Banner__c;
        this.channelComments = this.theActivity.Channel_Comments__c;
        this.activityMechanicDescription = this.theActivity.Proposal_Mechanics__c;
        if (this.theActivity.Activity_Mechanic__c) {
            this.activityMechanics = [...this.theActivity.Activity_Mechanic__c.split(';')];
        }
        this.activityComments = this.theActivity.Activity_Comments__c;

        if (this.theActivity.Begin_Date__c) {
            this.proposedInMarketStartDate = new Date(this.theActivity.Begin_Date__c);
        }
        if (this.theActivity.End_Date__c) {
            this.proposedInMarketEndDate = new Date(this.theActivity.End_Date__c);
        }
        if (this.theActivity.PreAlignment_Deadline__c) {
            this.preAlignmentDeadline = new Date(this.theActivity.PreAlignment_Deadline__c);
        }
        if (this.theActivity.PreEvaluation_Deadline__c) {
            this.preEvaluationDeadline = new Date(this.theActivity.PreEvaluation_Deadline__c);
        }
        if (this.theActivity.Date_Approved__c) {
            this.activityApprovalDate = new Date(this.theActivity.Date_Approved__c);
        }
        
        this.businessOpportunity = this.theActivity.Business_Opportunity__c;
        this.activityObjectives = this.theActivity.Proposal_Objectives__c;

        this.brandStrategyIndex = this.theActivity.Brand_Strategy_Index__c;
        this.commercialReturnIndex = this.theActivity.Commercial_Return_Index__c;
        this.customerRelationshipIndex = this.theActivity.Customer_Relationship_Index__c;
        this.newExperientialIndex = this.theActivity.New_Experiential_Index__c;        

        this.totalBudgetedCost = this.theActivity.Activity_Budget__c;
        this.totalBudgetedCostAP = this.theActivity.Total_Budgeted_Cost_AP__c;
        this.totalBudgetedCostCOGS = this.theActivity.Total_Budgeted_Cost_COGS__c;
        this.totalBudgetedCostPA = this.theActivity.Total_Budgeted_Cost_PA__c;
        this.totalBudgetedCostLumpSum = this.theActivity.Total_Budgeted_Cost_LumpSum__c;
        this.natureOfCostDescription = this.theActivity.Nature_of_Cost_Details__c;
        this.incrementalDiscountsProvided = this.theActivity.Incremental_Discounts_Provided__c;
        this.salesComments = this.theActivity.Evaluation_Comments__c;
        this.bpaComments = this.theActivity.Evaluation_BPA_Comments__c;

        this.incrementalGrossProfit = this.theActivity.Incremental_Gross_Profit__c;
        this.incrementalGrossProfitSales = this.theActivity.Incremental_Gross_Profit_Sales__c;
        this.forecastedReachCoverage = this.theActivity.Forecasted_Reach_Coverage__c;
        this.totalCustomerAPBudget = this.theActivity.Total_Customer_AP_Budget__c;
        this.totalCustomerSNS = this.theActivity.Total_Customer_SNS__c;

        this.incremental9LUplift = this.theActivity.Incremental_9L_Uplift__c;

        if (this.theActivity.Promo_Brands__c != null) {
            if (this.selectedBrands == undefined) { this.selectedBrands = []; }
            const l_FB = this.theActivity.Promo_Brands__c.split(';');
            this.focusBrands = l_FB.map(bs => {
                const b = this.brands.find(b => bs == b.name );
                console.log('b', b);
                b.isSelected = true;

                this.selectedBrands.push(b.id);
                return {
                        type: 'avatar',
                        label: b.name,
                        src: b.imageUrl,
                        fallbackIconName: 'standard:user',
                        variant: 'circle',
                        alternativeText: b.name,
                        isLink: false,
                }
            });

        }
        console.log('selectedBrands', this.selectedBrands);
        if (this.selectedBrands && this.selectedBrands.length > 0) {
            console.log('allProducts', this.allProducts);
            this.products = this.allProducts.filter(p => this.selectedBrands.indexOf(p.brand) >= 0);
            console.log('products', this.products);
        }

        if (this.theActivity.Activity_Products__r != null && this.theActivity.Activity_Products__r.length > 0) {
            this.focusProducts = [];
            this.theActivity.Activity_Products__r.forEach(ap => {
                console.log('ap', ap);                
                const p = this.products.find(p => ap.Product_NoFilter__c == p.id );
                console.log('p', p);
                if (p != null) { 
                    p.isSelected = true; 
                    this.focusProducts.push({
                            type: 'avatar',
                            label: p.name,
                            src: p.imageUrl,
                            fallbackIconName: 'standard:user',
                            variant: 'circle',
                            alternativeText: p.name,
                            isLink: false,
                            productId: p.id,
                            recordId: ap.Id
                    });               
                }
            });
            
        }

        /* Communication Methods */
        console.log('[load] activitycommunication methods', this.activityCommunicationMethods);
        console.log('[load] nationalBannerGroups', this.nationalBannerGroups);
        //this.focusBannerGroups = [];
        //this.bannerGroupsToDelete = [];
        //this.selectedBannerGroups = [];
        //this.removedBannerGroups = [];
        this.bannerGroups = [];
        if (this.theActivity.Promotion_Activity_Related_Data__r && this.theActivity.Promotion_Activity_Related_Data__r.length > 0) {
            this.theActivity.Promotion_Activity_Related_Data__r.forEach(pard => {                
                if (pard.RecordType.Name == 'Banner Group') {   
                    this.bannerGroups.push(pard.Banner_Group__c);                 
                } else if (pard.RecordType.Name == 'Communication Method') {
                    const acm = this.activityCommunicationMethods.find(a => a.Name == pard.Name);
                    if (acm) {
                        acm.Id = pard.Id;
                        acm.RecordTypeId = pard.RecordTypeId;
                        acm.Activity__c = pard.Activity__c;
                        acm.Primary__c = pard.Primary__c;
                        acm.Secondary__c = pard.Secondary__c;
                        acm.Reach__c = pard.Reach__c;
                    }    
                    this.activityCommunicationIncludesOther = (pard.Name == 'Other' && pard.Primary___c);
                }
            });
            console.log('[load] activitycommunication methods', this.activityCommunicationMethods);
        }

    }

    save() {
        console.log('[save]');
        try {
            const evalForm = Object.assign({}, this.theActivity);
            evalForm.Begin_Date__c = this.proposedInMarketStartDate;
            evalForm.End_Date__c = this.proposedInMarketEndDate;
            evalForm.PreAlignment_Deadline__c = this.preAlignmentDeadline;
            evalForm.PreEvaluation_Deadline__c = this.preEvaluationDeadline;
            evalForm.Date_Approved__c = this.activityApprovalDate;
            evalForm.Market__c = this.market;
            evalForm.Market_Filter__c = this.marketName;
            evalForm.Active__c = true;
            evalForm.Publish_Activity__c = this.publishActivity;            
            evalForm.Promotion_Type__c = 'Sales Promo';
            if (this.status == 'Approved') {
                evalForm.Wombat_Active__c = this.publishActivity;
            }
            
            if (this.projectManager) {
                evalForm.Project_Manager__c = this.projectManager.id;
            }
            if (this.marketingContact) {
                evalForm.Marketing_Manager__c = this.marketingContact.id;
            }
            if (this.salesContact) {
                evalForm.Sales_Manager__c = this.salesContact.id;
            } else {
                evalForm.Sales_Manager__c = this.projectManager.id;
            }
            
            evalForm.Customer_Contact__c = this.customerContact;
            evalForm.Agency_Contact__c = this.agencyContact;
            evalForm.Number_of_Stores_in_Banner_Group__c = this.numberOfStoresInBanner;
            evalForm.No_of_Stores_in_Banner_Running_Activity__c = this.numberOfStoresRunningActivity;
            evalForm.Was_Activity_Running_Last_Year__c = this.wasActivityRunningLastYear;
            evalForm.Last_Year_Activity_Details__c = this.lastYearActivityDetails;
            evalForm.State_MP__c = this.states == undefined ? null : this.states.join(';');
            evalForm.Smartsheet_Link__c = this.smartsheetLink;
            evalForm.Channel__c = this.channel;
            evalForm.Customer_Type__c = this.customerType;
            //evalForm.National_Banner__c = this.customerBanner;
            evalForm.Channel_Comments__c = this.channelComments;
            evalForm.Proposal_Mechanics__c = this.activityMechanicDescription;
            evalForm.Activity_Mechanic__c = this.activityMechanics == undefined ? null : this.activityMechanics.join(';');
            evalForm.Activity_Comments__c = this.activityComments;
            evalForm.Business_Opportunity__c = this.businessOpportunity;
            evalForm.Proposal_Objectives__c = this.activityObjectives;
            evalForm.Brand_Strategy_Index__c = this.brandStrategyIndex;
            evalForm.Commercial_Return_Index__c = this.commercialReturnIndex;
            evalForm.Customer_Relationship_Index__c = this.customerRelationshipIndex;
            evalForm.New_Experiential_Index__c = this.newExperientialIndex;
            evalForm.Activity_Budget__c = this.totalBudgetedCost;
            evalForm.Total_Budgeted_Cost_AP__c = this.totalBudgetedCostAP;
            evalForm.Total_Budgeted_Cost_COGS__c = this.totalBudgetedCostCOGS;
            evalForm.Total_Budgeted_Cost_PA__c = this.totalBudgetedCostPA;
            evalForm.Total_Budgeted_Cost_LumpSum__c = this.totalBudgetedCostLumpSum;
            evalForm.Nature_of_Cost_Details__c = this.natureOfCostDescription;
            evalForm.Incremental_Discounts_Provided__c = this.incrementalDiscountsProvided;        
            evalForm.Forecasted_Reach_Coverage__c = this.forecastedReachCoverage;
            evalForm.Total_Customer_AP_Budget__c = this.totalCustomerAPBudget;
            evalForm.Total_Customer_SNS__c = this.totalCustomerSNS;
            evalForm.Incremental_Gross_Profit__c = this.incrementalGrossProfit;
            evalForm.Incremental_Gross_Profit_Sales__c = this.incrementalGrossProfitSales;
            evalForm.Incremental_9L_Uplift__c = this.incremental9LUplift;
            evalForm.Evaluation_Comments__c = this.salesComments;
            evalForm.Evaluation_BPA_Comments__c = this.bpaComments;
            console.log('[save] incrementalgrossprofitsales', this.incrementalGrossProfitSales, this.theActivity.Incremental_Gross_Profit_Sales__c);
            console.log('[save] incrementalGrossProfit', this.incrementalGrossProfit, this.theActivity.Incremental_Gross_Profit__c);

            //if (this.isProjectManager) {
            //    if (this.totalBudgetedCost > 20000 && this.totalBudgetedCost < 100000 && this.incrementalGrossProfitSales != undefined && this.incrementalGrossProfitSales > 0 && this.incrementalGrossProfitSales != this.theActivity.Incremental_Gross_Profit_Sales__c) {
            //        evalForm.Status__c = 'Commercial Lead Reviewed';
            //    }
            //}
            //if (this.isSalesManager) {
                if (this.totalBudgetedCost > 20000 && this.incrementalGrossProfitSales != undefined && this.incrementalGrossProfitSales > 0 && this.incrementalGrossProfitSales != this.theActivity.Incremental_Gross_Profit_Sales__c) {
                    this.status = 'Commercial Lead Reviewed';
                }    
            //}
            if (this.isAdminUser) {
                if (this.status == 'BP&A Review' && this.totalBudgetedCost >= 100000 && this.incrementalGrossProfit != undefined && this.incrementalGrossProfit > 0 && this.incrementalGrossProfit != this.theActivity.Incremental_Gross_Profit__c) {
                    this.status = 'BP&A Reviewed';
                }    
            }
            //if ((this.status == 'Draft' || this.status == 'Commercial Lead Review') && this.totalBudgetedCost >= 100000 && this.incrementalGrossProfitSales != undefined && this.incrementalGrossProfitSales > 0 && this.incrementalGrossProfitSales != this.theActivity.Incremental_Gross_Profit_Sales__c) {
            //    evalForm.Status__c = 'BP&A Review';
            //}
            
            evalForm.Status__c = this.status;
            console.log('[save] status', evalForm.Status__c);

            if (this.focusBrands && this.focusBrands.length > 0) {
                let s_FocusBrands = '';
                this.focusBrands.forEach(fb => { 
                    s_FocusBrands += fb.label + ';';
                });
                evalForm.Promo_Brands__c = s_FocusBrands;
            } 

            evalForm.Promo_Products__c = '';
            const products = [];
            const productsToDelete = [];
            if (this.focusProducts && this.focusProducts.length > 0) {
                this.focusProducts.forEach(fp => {
                    evalForm.Promo_Products__c += fp.label + ';';
                    products.push({
                        Id: fp.recordId,
                        Product_NoFilter__c: fp.productId,
                        Activity__c: this.theActivity.Id
                    });
                });
            }

            
            let bannerGroupsToDelete = [];
            let bannerGroupsToUpdate = [];
            let existingBannerGroups;
            if (this.theActivity.Promotion_Activity_Related_Data__r && this.theActivity.Promotion_Activity_Related_Data__r.length > 0) {
                existingBannerGroups = this.theActivity.Promotion_Activity_Related_Data__r.filter(pard => pard.RecordType.Name == 'Banner Group');
            }
            if (existingBannerGroups == null) { existingBannerGroups = []; }
            
            evalForm.Promo_Banner_Groups__c = '';
            if (this.bannerGroups && this.bannerGroups.length > 0) {
                console.log('[save] existingbannergroups', existingBannerGroups);
                console.log('[save] nationablebannergroups', this.nationalBannerGroups);
                this.bannerGroups.forEach(bgId => {
                    const existingBannerGroup = existingBannerGroups.find(ebg => ebg.Banner_Group__c == bgId);
                    const theBannerGroup = this.nationalBannerGroups.find(nbg => nbg.value == bgId);
                    evalForm.Promo_Banner_Groups__c += theBannerGroup.label + ';';
                    if (existingBannerGroup == null) {
                        bannerGroupsToUpdate.push({
                            Name: theBannerGroup.label,
                            Activity__c: this.theActivity.Id,
                            Banner_Group__c: bgId 
                        });    
                    } 
                    
                });
                /*
                this.bannerGroups.forEach(bg => {
                    const bg = existingBannerGroups.find(bg => bg.Banner_Group__c == fbg.bannerGroupId);
                    if (bg == null) {
                        bannerGroupsToUpdate.push({
                            Id: fbg.recordId,
                            Name: fbg.label,
                            Activity__c: this.theActivity.Id,
                            Banner_Group__c: fbg.bannerGroupId 
                        });    
                    } 
                });
                */
            } else if(existingBannerGroups != null && existingBannerGroups.length > 0) {
                bannerGroupsToDelete = [...existingBannerGroups];
            }
            
            /* Communication Methods */
            const relatedData = this.activityCommunicationMethods;

            console.log('[save] activity', evalForm);
            console.log('[save] products', products);
            console.log('[save] relatedData', relatedData);
            saveActivity({activity: evalForm, products: products, relatedData: relatedData, bannerGroups: bannerGroupsToUpdate, bannerGroupsToDelete: bannerGroupsToDelete})
            .then(result => {
                console.log('[save.success] result', result);
                this.showToast('success', 'Success', this.labels.saveSuccess.message);

                this.wiredActivity = refreshApex(this.wiredActivity);

            })
            .catch(error => {
                console.log('save.error] error', error);
                this.error = error;
                this.showToast('error', 'Warning!!', error.body.message);
            });

        }catch(ex) {
            console.log('[save] exception', ex);
        }
    }

}