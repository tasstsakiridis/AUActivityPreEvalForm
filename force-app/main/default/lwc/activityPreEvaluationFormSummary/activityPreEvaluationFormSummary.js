import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

import getActivity from '@salesforce/apex/PreEvaluationForm_Controller.getActivity';
import getProducts from '@salesforce/apex/PreEvaluationForm_Controller.getProducts';
import getUserDetails from '@salesforce/apex/PreEvaluationForm_Controller.getUserDetails';

import LABEL_CANCEL from '@salesforce/label/c.Cancel';
import LABEL_DETACH_FILE from '@salesforce/label/c.Detach_File';
import LABEL_DETACH_FILE_CONFIRMATION from '@salesforce/label/c.Detach_File_Confirmation';
import LABEL_DETACH_FILE_SUCCESS from '@salesforce/label/c.Detach_File_Success';
import LABEL_FORMINSTRUCTIONS from '@salesforce/label/c.PreEvaluationFormInstructions';
import LABEL_HELP from '@salesforce/label/c.Help';
import LABEL_INFO from '@salesforce/label/c.Info';
import LABEL_SAVE from '@salesforce/label/c.Save';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';

export default class ActivityPreEvaluationFormSummary extends NavigationMixin(LightningElement) {
    labels = {
        agencyContact   : { label: 'Agency Contact' },
        cancel          : { label: LABEL_CANCEL },
        customerContact : { label: 'Customer Contact' },
        detachFile              : { label: LABEL_DETACH_FILE, successMessage: LABEL_DETACH_FILE_SUCCESS, confirmation: LABEL_DETACH_FILE_CONFIRMATION},
        help            : { label: LABEL_HELP },
        keyDates        : { label: 'Key Dates & Timings' },
        marketingContact : { label: 'Marketing Contact' },
        projectLeads    : { label: 'Project Leads' },
        projectManager  : { label: 'Project Manager' },
        salesContact    : { label: 'Sales Contact' },        
        save            : { label: LABEL_SAVE },
        info            : { label: LABEL_INFO },
        instructions    : { label: 'Instructions', message: LABEL_FORMINSTRUCTIONS },
        inMarketStartDate : { label: 'Proposed In-Market Start Date' },
        inMarketEndDate   : { label: 'Proposed In-Market End Date' },
        preAlignmentDeadline : { label: 'Pre-Alignment Deadline' },
        preEvaluationDeadline : { label: 'Pre-Evaluation Deadline' },
        activityApprovalDate  : { label: 'Activity Approval Date' },
        channel               : { label: 'Channel' },
        comments              : { label: 'Comments' },
        customerBanner        : { label: 'Customer Banner' },
        customerType          : { label: 'Customer Type' },
        activityDetails       : { label: 'Activity Details' },
        objectives            : { label: 'Activity Objectives / Qualitative Considerations' },
        businessOpportunity   : { label: 'What is the Business Opportunity or Challenge?' },
        activityObjectives    : { label: 'Description of Activity Objectives:' },
        next                  : { label: 'Next' },
        prev                  : { label: 'Prev' },
        provideDetailsBelow   : { label: 'Provide details below' },
        yes                   : { label: 'Yes' },
        no                    : { label: 'No' },
        uploadFile            : { label: 'Upload & Attach Files', message: 'Select files to upload and attach', successMessage: 'Files uploaded successfully!' },
        saveSuccess             : { message: 'All changes saved successfully'},
        summary               : { label: LABEL_SUMMARY },
        print                 : { label: 'Print' }
    };

    @wire(CurrentPageReference) pageRef;

    @api 
    activityId;

    error;

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

    brands;
    products;
    allProducts;
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
            this.allProducts = [];
            this.brands = [];
            const brandIds = [];
            console.log('[getproducts] data', value.data);
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
            console.log('[getproducts] brands', this.brands);
            console.log('[getproducts] products', this.products);

            this.getFormData();
        }
    }

    activity;
    getFormData() {
        getActivity({activityId: this.activityId})
        .then(result => {
            this.error = undefined;
            this.activity = result;
            this.loadData();
        })
        .catch(error => {
            this.error = error;
            this.activity = undefined;
        });
    }

    activityName;
    panNumber;
    status;
    projectManager = {};
    marketingContact = {};
    salesContact = {};
    agencyContact;
    customerContact;
    numberOfStoresInBanner;
    numberOfStoresRunningActivity;
    wasActivityRunningLastYear;
    lastYearActivityDetails;
    states;
    smartsheetLink;
    channel;
    isOtherChannel;
    isOffChannel;
    customerType;
    customerBanner;
    channelComments;
    activityMechanicDescription;
    activityMechanics;
    activityAdditionalComments;
    businessOpportunity;
    activityObjectives;
    brandStrategyIndex;
    commercialReturnIndex;
    customerRelationshipIndex;
    newExperientialIndex;
    natureOfCostDescription;
    activityAdditionalComments;
    incrementalDiscountsProvided;
    formattedActivityApprovalDate;
    formattedPreAlignmentDeadline;
    formattedPreEvaluationDeadline;
    formattedProposedInMarketEndDate;
    formattedProposedInMarketStartDate;
    totalBudgetedCost;
    totalBudgetedCostAP;
    totalBudgetedCostPA;
    totalBudgetedCostLumpSum;
    incrementalGrossProfit;
    incrementalProfitLoss;
    incrementalProfitLossSales;
    incrementalROI;
    incrementalROISales;
    forecastedCostPerThousand;
    activitySpendPercentage;
    totalCustomerAPSpendVSSNS;
    activityCommunicationMethods;
    activityCommunicationIncludesOther;
    focusProducts;
    focusBrands;
    attachedFiles;


    loadData() {
        console.log('[loadData] activity', this.activity);
        try {
        this.activityName = this.activity.Name;
        this.status = this.activity.Status__c;
        this.panNumber = this.activity.Promotion_Activity_Number__c;
        this.projectManager = { id: this.activity.Project_Manager__c, name: this.activity.Project_Manager__r.Name, imageUrl: this.activity.Project_Manager__r.SmallPhotoUrl };
        this.marketingContact = { id: this.activity.Marketing_Manager__c, name: this.activity.Marketing_Manager__r.Name, imageUrl: this.activity.Marketing_Manager__r.SmallPhotoUrl };
        this.salesContact = { id: this.activity.Sales_Manager__c, name: this.activity.Sales_Manager__r.Name, imageUrl: this.activity.Sales_Manager__r.SmallPhotoUrl };
        this.customerContact = this.activity.Customer_Contact__c;
        this.agencyContact = this.activity.Agency_Contact__c;
        this.numberOfStoresInBanner = this.activity.Number_of_Stores_in_Banner_Group__c;
        this.numberOfStoresRunningActivity = this.activity.No_of_Stores_in_Banner_Running_Activity__c;
        this.wasActivityRunningLastYear = this.activity.Was_Activity_Running_Last_Year__c;
        this.lastYearActivityDetails = this.activity.Last_Year_Activity_Details__c;
        this.states = this.activity.State_MP__c;
        this.smartsheetLink = this.activity.Smartsheet_Link__c;
        this.channel = this.activity.Channel__c;
        this.isOffChannel = this.activity.Channel__c == 'Off';
        this.isOtherChannel = this.activity.Channel__c == 'Other';
        this.customerType = this.activity.Customer_Type__c;  
        this.customerBanner = this.activity.Promo_Banner_Groups__c;
        //this.customerBanner = this.activity.National_Banner__r != undefined ? this.activity.National_Banner__r.Name : '';
        this.channelComments = this.activity.Channel_Comments__c;
        this.activityMechanicDescription = this.activity.Proposal_Mechanics__c;
        this.activityMechanics = this.activity.Activity_Mechanic__c;
        this.activityAdditionalComments = this.activity.Activity_Mechanic_Comments__c;
        this.businessOpportunity = this.activity.Business_Opportunity__c;
        this.activityObjectives = this.activity.Proposal_Objectives__c;
        this.brandStrategyIndex = this.activity.Brand_Strategy_Index__c;
        this.commercialReturnIndex = this.activity.Commercial_Return_Index__c;
        this.customerRelationshipIndex = this.activity.Customer_Relationship_Index__c;
        this.newExperientialIndex = this.activity.New_Experiential_Index__c;
        this.natureOfCostDescription = this.activity.Nature_of_Cost_Details__c;
        this.activityAdditionalComments = this.activity.Evaluation_Comments__c;
        this.incrementalDiscountsProvided = this.activity.Incremental_Discounts_Provided__c;

        let dt;
        if (this.activity.Begin_Date__c) {
            dt = new Date(this.activity.Begin_Date__c);
            this.formattedProposedInMarketStartDate = dt.toISOString();    
        }

        if (this.activity.End_Date__c) {
            dt = new Date(this.activity.End_Date__c);
            this.formattedProposedInMarketEndDate = dt.toISOString();    
        }

        if (this.activity.PreAlignment_Deadline__c) {
            dt = new Date(this.activity.PreAlignment_Deadline__c);
            this.formattedPreAlignmentDeadline = dt.toISOString();    
        }

        if (this.activity.PreEvaluation_Deadline__c) {
            dt = new Date(this.activity.PreEvaluation_Deadline__c);
            this.formattedPreEvaluationDeadline = dt.toISOString();    
        }

        if (this.activity.Date_Approved__c) {
            dt = new Date(this.activity.Date_Approved__c);
            this.formattedActivityApprovalDate = dt.toISOString();    
        }

        this.totalBudgetedCost = parseFloat(this.activity.Activity_Budget__c) || 0;
        this.totalBudgetedCostAP = parseFloat(this.activity.Total_Budgeted_Cost_AP__c) || 0;
        this.totalBudgetedCostPA = parseFloat(this.activity.Total_Budgeted_Cost_PA__c) || 0;
        this.totalBudgetedCostLumpSum = parseFloat(this.activity.Total_Budgeted_Cost_LumpSum__c) || 0;
        this.totalBudgetedCostCOGS = parseFloat(this.activity.Total_Budgeted_Cost_COGS__c) || 0;
        this.incrementalGrossProfit = parseFloat(this.activity.Incremental_Gross_Profit__c);
        this.incrementalGrossProfitSales = parseFloat(this.activity.Incremental_Gross_Profit_Sales__c);
        this.incrementalProfitLoss = this.incrementalGrossProfit - this.totalBudgetedCost;
        this.incrementalProfitLossSales = this.incrementalGrossProfitSales - this.totalBudgetedCost;
        this.incrementalROI = this.totalBudgetedCost == 0 ? 0 : this.incrementalProfitLoss / this.totalBudgetedCost;
        this.incrementalROISales = this.incrementalProfitLossSales / this.totalBudgetedCost;

        
        this.forecastedReachCoverage = parseFloat(this.activity.Forecasted_Reach_Coverage__c) || 0;
        this.forecastedCostPerThousand = this.forecastedReachCoverage == 0 ? 0 : this.totalBudgetedCost / this.forecastedReachCoverage;

        this.totalCustomerAPBudget = this.activity.Total_Customer_AP_Budget__c == undefined ? 0 : parseFloat(this.activity.Total_Customer_AP_Budget__c);
        this.totalCustomerSNS = this.activity.Total_Customer_SNS__c == undefined ? 0 : parseFloat(this.activity.Total_Customer_SNS__c);
        this.activitySpendPercentage = this.totalCustomerAPBudget == 0 ? 0 : this.totalBudgetedCost / this.totalCustomerAPBudget;
        this.totalCustomerAPSpendVSSNS = this.totalCustomerSNS == 0 ? 0 : this.totalCustomerAPBudget / this.totalCustomerSNS;

        this.activityCommunicationMethods = [];
        if (this.activity.Promotion_Activity_Related_Data__r != undefined) {
            this.activityCommunicationMethods = [];
            this.customerBanner = '';
            this.activity.Promotion_Activity_Related_Data__r.forEach(pard => {
                if (pard.RecordType.Name == 'Banner Group') {
                    this.customerBanner += pard.Name + ', ';
                } else if (pard.RecordType.Name == 'Communication Method') {
                    this.activityCommunicationMethods.push({
                        Id: pard.Id,
                        RecordTypeId: pard.RecordTypeId,
                        Activity__c: pard.Activity__c,
                        Name: pard.Name,
                        Primary__c: pard.Primary__c,
                        Secondary__c: pard.Secondary__c,
                        Reach__c: pard.Reach__c
                    });
                }
            });
            this.customerBanner = this.customerBanner.substr(0, this.customerBanner.length - 2);
            const pard = this.activity.Promotion_Activity_Related_Data__r.find(p => p.Name == 'Other');
            if (pard != null) {
                this.activityCommunicationIncludesOther = true;
            }
        }

        this.focusBrands = [];
        if (this.activity.Promo_Brands__c) {
            const l = this.activity.Promo_Brands__c.split(';');
            l.forEach(pb => {
                const brand = this.brands.find(b => b.name == pb);
                this.focusBrands.push({
                    type: 'avatar',
                    label: brand.name,
                    src: brand.imageUrl,
                    fallbackIconName: 'standard:user',
                    variant: 'circle',
                    alternativeText: brand.name,
                    isLink: false,

                });
            });
        }
        this.focusProducts = [];
        if (this.activity.Activity_Products__r && this.activity.Activity_Products__r.length > 0) {
            this.activity.Activity_Products__r.forEach(ap => {
                this.focusProducts.push({
                        type: 'avatar',
                        label: ap.Product_NoFilter__r.Name,
                        src: 'https://salesforce-static.b-fonline.com/images/'+ap.Product_NoFilter__r.Image_Name__c,
                        fallbackIconName: 'standard:user',
                        variant: 'circle',
                        alternativeText: ap.Product_NoFilter__r.Name,
                        isLink: false,
                        productId: ap.Product__c,
                        recordId: ap.Id
                }); 
            });
            
        }

            if (this.activity.ContentDocumentLinks) {
                this.attachedFiles = this.activity.ContentDocumentLinks.map(cdl => {
                    //return this.addToAttachedFilesList(cdl.ContentDocumentId, cdl.ContentDocument.LatestPublishedVersionId, cdl.ContentDocument.FileExtension, cdl.ContentDocument.Title);
                    let iconName = 'attachment';
                    if (cdl.ContentDocument.FileExtension === 'png' || cdl.ContentDocument.FileExtension === 'jpg' || cdl.ContentDocument.FileExtension === 'jpeg') {
                        iconName = 'image';
                    } else if (cdl.ContentDocument.FileExtension === 'txt') {
                        iconName = 'txt';
                    } else if (cdl.ContentDocument.FileExtension === 'pdf') {
                        iconName = 'pdf';
                    } else if (cdl.ContentDocument.FileExtension.startsWith('xl')) {
                        iconName = 'excel';
                    } else if (cdl.ContentDocument.FileExtension === 'csv') {
                        iconName = 'csv';
                    } else {
                        iconName = 'attachment';
                    }
                    return { type: 'icon',
                            name: cdl.ContentDocumentId,
                            label: cdl.ContentDocument.Title,
                            href: "/lightning/r/ContentDocument/" + cdl.ContentDocumentId + "/view",
                            src: "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" + cdl.ContentDocument.LatestPublishedVersionId,
                            iconName: 'doctype:'+iconName,
                            fallbackIconName: 'doctype:'+iconName,
                            variant: 'link',
                            alternativeText: 'Attched document', 
                            isLink: true 
                    }
                });
            }
        }catch(ex) {
            console.log('exception', ex);
        }
    }

    handleBackButtonClick(event) {
        this.isWorking = true;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.activityId,
                objectApiName: 'Promotion_Activity__c',
                actionName: 'view'
            }
        }, true);
    }
    handlePrintButtonClick(event) {
        window.print();
    }
}