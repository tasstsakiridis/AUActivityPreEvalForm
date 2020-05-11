import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';

import { fireEvent } from 'c/pubsub';

import CLIENT_FORM_FACTOR from '@salesforce/client/formFactor';

import OBJECT_ACTIVITY from '@salesforce/schema/Promotion_Activity__c';

import getActivity from '@salesforce/apex/PreEvaluationForm_Controller.getActivity';
import getUserDetails from '@salesforce/apex/PreEvaluationForm_Controller.getUserDetails';
import getBannerGroups from '@salesforce/apex/PreEvaluationForm_Controller.getBannerGroups';
import getIsAdminUser from '@salesforce/apex/PreEvaluationForm_Controller.getIsAdminUser';
import getProducts from '@salesforce/apex/PreEvaluationForm_Controller.getProducts';
import saveActivity from '@salesforce/apex/PreEvaluationForm_Controller.save';

import LABEL_CANCEL from '@salesforce/label/c.Cancel';
import LABEL_DETACH_FILE from '@salesforce/label/c.Detach_File';
import LABEL_DETACH_FILE_CONFIRMATION from '@salesforce/label/c.Detach_File_Confirmation';
import LABEL_DETACH_FILE_SUCCESS from '@salesforce/label/c.Detach_File_Success';
import LABEL_FORMINSTRUCTIONS from '@salesforce/label/c.PreEvaluationFormInstructions';
import LABEL_HELP from '@salesforce/label/c.Help';
import LABEL_INFO from '@salesforce/label/c.Info';
import LABEL_SAVE from '@salesforce/label/c.Save';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';

import userId from '@salesforce/user/Id';

const yesNoOptions = [
    {label: 'Yes (Provide details below)', value: 'yes' },
    { label: 'No', value: 'no' }
];
const stateOptions = [
    { label: 'All', value: 'All' },
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
        summary               : { label: LABEL_SUMMARY }
    };

    isPhone = (CLIENT_FORM_FACTOR === "Small");

    @api 
    recordId;

    @track
    isEditingForm = true;
    isSelectingBrands;
    isSelectingProducts;

    showInstructionDetail = true;

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

    channel;
    channelOptions;
    channelComments;

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
    incrementalGrossProfit;
    incrementalGrossProfitChanged;
    incrementalGrossProfitSales;
    incrementalGrossProfitSalesChanged;
    forecastedReachCoverage;
    businessOpportunity;
    activityObjectives;
    evaluationComments;
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

    get activityName() {
        return this.theActivity == null ? '' : this.theActivity.Name;
    }
    get status() {
        return this.theActivity == null ? 'New' : this.theActivity.Status__c;
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
    get activityCommunicationIncludesOther() {
        return this.activityCommunicationMethods != null && this.activityCommunicationMethods.indexOf('Other') > -1;
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
            return this.incrementalProfitLossSales / totalAmount;
        }
    }
    get incrementalROI() {
        const totalAmount = this.totalBudgetedCost == null ? 0 : this.totalBudgetedCost;
        const pl = this.incrementalProfitLoss == null ? 0 : this.incrementalProfitLoss;
        let roi = 0;
        if (totalAmount != 0) {
            roi = pl / totalAmount;
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
        return this.allProductsSelected ? 'DeSelect all Products' : 'Select all Products';
    }

    @wire(CurrentPageReference) pageRef;

    @wire(getIsAdminUser)
    isAdminUser;

    get isNotAdminUser() {
        return this.isAdminUser == false;
    }
    get isSalesManager() {
        return this.salesContact == undefined ? false : this.salesContact == this.userId;
    }
    get canEditSalesManagerFields() {
        return this.isEditable && (this.isAdminUser || this.isSalesManager);
    }
    get cannotEditSalesManagerFields() {
        return !this.canEditSalesManagerFields;
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
                value: bg.Id 
            }));
            groups.push({label: 'Other', value: 'Other'});
            groups.sort(function(a, b) {
                let x = a.label.toLowerCase();
                let y = b.label.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0; 
            });
            this.nationalBannerGroups = groups;
            this.finishedLoadingBannerGroups = true;
            if (this.finishedLoadingForm && this.finishedLoadingObjectInfo && this.finishedLoadingBrandsAndProducts) {
                this.loadPreEvaluationForm();
            }
        }
    }

    brands;
    brandsSelected = [];
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

    handleAddBrandsButtonClick(event) {
        this.isSelectingBrands = true;
        this.isEditingForm = false;
        console.log('isselectingbrands', this.isSelectingBrands);
        console.log('iseditingform', this.isEditingForm);
    }
    handleRemoveBrand(event) {
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
        if (this.productsSelected.indexOf(event.detail.id) < 0) {
            this.productsSelected.push(event.detail.id);            
        }
        console.log('[handleProductSelected] productsSelection', this.productsSelected);
    }
    handleProductDeSelected(event) {
        const index = this.productsSelected.indexOf(event.detail);
        if (index > -1) {
            this.productsSelected.splice(index, 1);
        }
    }
    handleRemoveProduct(event) {
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
        try {
            console.log('[handlelookupchange] event.detail', event.detail);
            if (event.detail == 'projectmanager') {
                this.projectManager = undefined;
            } else if (event.detail == 'marketingcontact') {
                this.marketingContact = undefined;
            } else if (event.detail == 'salescontact') {
                this.salesConttact = undefined;
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
    handleBannerGroupChange(event) {
        this.customerBanner = event.detail.value;
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
    handleActivityMechanicDescriptionChange(event) {
        this.activityMechanicDescription = event.detail.value;
    }
    handleFocusBrandsChange(event) {
        this.focusBrands = event.detail.value;
    }
    handleFocusSKUSChange(event) {
        this.focusSKUS = event.detail.value;
    }
    activityMechanicChange(event) {
        this.activityMechanics = event.detail.value;
    }
    handleActivityMechanicCommentsChange(event) {
        this.activityMechanicComments = event.detail.value;
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
    handleTotalBudgetedCostChange(event) {
        this.totalBudgetedCost = event.detail.value;
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
        console.log('[handleCommunicationMethodChange] event', event.detail.name, event.detail.field, event.detail.value);
        const acm = this.activityCommunicationMethods.find(a => a.Name == event.detail.name);
        console.log('[handleCommunicationMethodchange] acm', acm);
        if (event.detail.field == 'primary') {
            acm.Primary__c = event.detail.value;
        } else if (event.detail.field == 'secondary') {
            acm.Secondary__c = event.detail.value;
        } else if (event.detail.field == 'reach') {
            acm.Reach__c = event.detail.value;
            this.forecastedReachCoverage = 0;
            this.activityCommunicationMethods.forEach(acm => this.forecastedReachCoverage = this.forecastedReachCoverage + parseInt(acm.Reach__c));
        }
        console.log('[handleCommunicationMethodCHange] communication methods', this.activityCommunicationMethods);
    }
    handleActivityCommunicationMethodChange(event) {
        this.activityCommunicationMethods = event.detail.value;
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
    handleFileUploadFinished(event) {
        try {
            const files = event.detail.files;  
            const tempList = [...this.attachedFiles];
            files.forEach(f => {
                console.log('[handleFileUploadFinished] file', f);
                let nameParts = f.name.split('.');
                const filename = nameParts[0];
                const fileExtension = nameParts.length == 2 ? nameParts[1].toLowerCase() : '';
                let iconName = 'attachment';
                if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
                    iconName = 'image';
                } else if (fileExtension === 'txt') {
                    iconName = 'txt';
                } else if (fileExtension === 'pdf') {
                    iconName = 'pdf';
                } else if (fileExtension.startsWith('xl')) {
                    iconName = 'excel';
                } else if (fileExtension === 'csv') {
                    iconName = 'csv';
                }
                const attachedFile = {
                    type: 'icon',
                    name: f.documentId,
                    label: filename,
                    href: "/lightning/r/ContentDocument/" + f.documentId + "/view",
                    src: "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" + f.documentId,
                    iconName: 'doctype:'+iconName,
                    fallbackIconName: 'doctype:'+iconName,
                    variant: 'link',
                    alternativeText: 'Attched document', 
                    isLink: true 
                }
                console.log('[handleFileUploadFinished] attachedFile', attachedFile);
                tempList.push(attachedFile);
            });
            this.attachedFiles = [...tempList];
            this.showToast("success", this.labels.info.label, this.labels.uploadFile.successMessage);
        }catch(ex) {
            console.log('[promotionalSalesAgreement.handleFileUploadFinished] exception', ex);
        }

    }
    handleRemoveAttachedFile(event) {
        const response = confirm(this.labels.detachFile.confirmation.replace('{0}', event.detail.item.label));
        if (response == true) {            
            this.detachFile(event.detail.item.name, event.detail.item.label, event.detail.index);
        } 
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

        this.channel = this.theActivity.Channel__c;
        this.customerType = this.theActivity.Customer_Type__c;
        this.customerBanner = this.theActivity.National_Banner__c;
        this.channelComments = this.theActivity.Channel_Comments__c;
        this.activityMechanicDescription = this.theActivity.Proposal_Mechanics__c;
        if (this.theActivity.Activity_Mechanic__c) {
            this.activityMechanics = [...this.theActivity.Activity_Mechanic__c.split(';')];
        }
        this.activityMechanicComments = this.theActivity.Activity_Mechanic_Comments__c;

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
        this.natureOfCostDescription = this.theActivity.Nature_of_Cost_Details__c;
        this.activityAdditionalComments = this.theActivity.Evaluation_Comments__c;
        this.incrementalDiscountsProvided = this.theActivity.Incremental_Discounts_Provided__c;

        this.incrementalGrossProfit = this.theActivity.Incremental_Gross_Profit__c;
        this.incrementalGrossProfitSales = this.theActivity.Incremental_Gross_Profit_Sales__c;
        this.forecastedReachCoverage = this.theActivity.Forecasted_Reach_Coverage__c;
        this.totalCustomerAPBudget = this.theActivity.Total_Customer_AP_Budget__c;
        this.totalCustomerSNS = this.theActivity.Total_Customer_SNS__c;

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
        if (this.theActivity.Promotion_Activity_Related_Data__r && this.theActivity.Promotion_Activity_Related_Data__r.length > 0) {
            this.theActivity.Promotion_Activity_Related_Data__r.forEach(pard => {
                const acm = this.activityCommunicationMethods.find(a => a.Name == pard.Name);
                if (acm) {
                    acm.Id = pard.Id;
                    acm.RecordTypeId = pard.RecordTypeId;
                    acm.Activity__c = pard.Activity__c;
                    acm.Primary__c = pard.Primary__c;
                    acm.Secondary__c = pard.Secondary__c;
                    acm.Reach__c = pard.Reach__c;
                }
            });
        }

        this.attachedFiles = [];
        if (this.theActivity.ContentDocumentLinks && this.theActivity.ContentDocumentLinks.length > 0) {
            this.attachedFiles = this.theActivity.ContentDocumentLinks.map(cdl => {
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

            console.log('[loadAttachedFiles] attachedFiles', this.attachedFiles);
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

            
            if (this.projectManager) {
                evalForm.Project_Manager__c = this.projectManager.id;
            }
            if (this.marketingContact) {
                evalForm.Marketing_Manager__c = this.marketingContact.id;
            }
            if (this.salesContact) {
                evalForm.Sales_Manager__c = this.salesContact.id;
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
            evalForm.National_Banner__c = this.customerBanner;
            evalForm.Channel_Comments__c = this.channelComments;
            evalForm.Proposal_Mechanics__c = this.activityMechanicDescription;
            evalForm.Activity_Mechanic__c = this.activityMechanics == undefined ? null : this.activityMechanics.join(';');
            evalForm.Activity_Mechanic_Comments__c = this.activityMechanicComments;
            evalForm.Business_Opportunity__c = this.businessOpportunity;
            evalForm.Proposal_Objectives__c = this.activityObjectives;
            evalForm.Brand_Strategy_Index__c = this.brandStrategyIndex;
            evalForm.Commercial_Return_Index__c = this.commercialReturnIndex;
            evalForm.Customer_Relationship_Index__c = this.customerRelationshipIndex;
            evalForm.New_Experiential_Index__c = this.newExperientialIndex;
            evalForm.Activity_Budget__c = this.totalBudgetedCost;
            evalForm.Nature_of_Cost_Details__c = this.natureOfCostDescription;
            evalForm.Evaluation_Comments__c = this.activityAdditionalComments;
            evalForm.Incremental_Discounts_Provided__c = this.incrementalDiscountsProvided;        
            evalForm.Forecasted_Reach_Coverage__c = this.forecastedReachCoverage;
            evalForm.Total_Customer_AP_Budget__c = this.totalCustomerAPBudget;
            evalForm.Total_Customer_SNS__c = this.totalCustomerSNS;
            evalForm.Incremental_Gross_Profit__c = this.incrementalGrossProfit;
            evalForm.Incremental_Gross_Profit_Sales__c = this.incrementalGrossProfitSales;
            if (this.incrementalGrossProfitSales != this.theActivity.Incremental_Gross_Profit_Sales__c) {
                evalForm.Status__c = 'Review';
            }
            if (this.incrementalGrossProfit != this.theActivity.Incremental_Gross_Profit__c) {
                evalForm.Status__c = 'Reviewed';
            }

            if (this.focusBrands && this.focusBrands.length > 0) {
                let s_FocusBrands = '';
                this.focusBrands.forEach(fb => { 
                    s_FocusBrands += fb.label + ';';
                });
                evalForm.Promo_Brands__c = s_FocusBrands;
            } 

            evalForm.Promo_Products__c = '';
            const products = [];
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

            /* Communication Methods */
            const relatedData = this.activityCommunicationMethods;

            console.log('[save] activity', evalForm);
            console.log('[save] products', products);
            console.log('[save] relatedData', relatedData);
            saveActivity({activity: evalForm, products: products, relatedData: relatedData})
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