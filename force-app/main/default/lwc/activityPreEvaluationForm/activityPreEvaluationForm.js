import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';

import CLIENT_FORM_FACTOR from '@salesforce/client/formFactor';

import OBJECT_ACTIVITY from '@salesforce/schema/Promotion_Activity__c';

import FIELD_ID from '@salesforce/schema/Promotion_Activity__c.Id';
import FIELD_STATUS from '@salesforce/schema/Promotion_Activity__c.Status__c';

import getActivity from '@salesforce/apex/PreEvaluationForm_Controller.getActivity';
import getBannerGroups from '@salesforce/apex/PreEvaluationForm_Controller.getBannerGroups';
import getIsAdminUser from '@salesforce/apex/PreEvaluationForm_Controller.getIsAdminUser';
import getProducts from '@salesforce/apex/PreEvaluationForm_Controller.getProducts';
import getUserDetails from '@salesforce/apex/PreEvaluationForm_Controller.getUserDetails';
import publishActivity from '@salesforce/apex/PreEvaluationForm_Controller.publishActivity';
import saveActivity from '@salesforce/apex/PreEvaluationForm_Controller.save';
import sendPDF from '@salesforce/apex/PreEvaluationForm_Controller.sendPDF';
import submitForApproval from '@salesforce/apex/PreEvaluationForm_Controller.submitForApproval';

import userId from '@salesforce/user/Id';

import LABEL_ALL from '@salesforce/label/c.All';
import LABEL_APPROVAL_SUBMITTED from '@salesforce/label/c.Approval_Submitted';
import LABEL_AVAILABLE from '@salesforce/label/c.Available';
import LABEL_BANNER_GROUP from '@salesforce/label/c.Banner_Groups';
import LABEL_BANNER_GROUP_HELP from '@salesforce/label/c.PreEval_BannerGroup_Help';
import LABEL_BRAND from '@salesforce/label/c.Brand';
import LABEL_BRANDS from '@salesforce/label/c.Brands';
import LABEL_BRAND_HELP from '@salesforce/label/c.PreEval_Brand_Help';
import LABEL_CANCEL from '@salesforce/label/c.Cancel';
import LABEL_CHANGES_SAVED_SUCCESSFULLY from '@salesforce/label/c.Changes_Saved_Successfully';
import LABEL_CHANNEL from '@salesforce/label/c.Channel';
import LABEL_CHANNEL_HELP from '@salesforce/label/c.PreEval_Channel_Help';
import LABEL_CONSUMER_DRIVER from '@salesforce/label/c.ConsumerDriver';
import LABEL_CONSUMER_DRIVER_HELP from '@salesforce/label/c.PreEval_ConsumerDriver_Help';
import LABEL_DESCRIPTION from '@salesforce/label/c.Description';
import LABEL_DESCRIPTION_HELP from '@salesforce/label/c.PreEval_Description_Help';
import LABEL_END_DATE from '@salesforce/label/c.End_Date';
import LABEL_END_DATE_HELP from '@salesforce/label/c.PreEval_EndDate_Help';
import LABEL_HELP from '@salesforce/label/c.Help';
import LABEL_INCREMENTAL_BRAND_PROFIT from '@salesforce/label/c.IncrementalBrandProfit';
import LABEL_INCREMENTAL_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_IncrementalBrandProfit_Help';
import LABEL_MECHANIC from '@salesforce/label/c.Activity_Mechanic';
import LABEL_MECHANIC_HELP from '@salesforce/label/c.PreEval_Mechanic_Help';
import LABEL_NA from '@salesforce/label/c.Not_Applicable_Abbrev';
import LABEL_NAME from '@salesforce/label/c.Name';
import LABEL_NO from '@salesforce/label/c.No';
import LABEL_NUMBER_OF_OUTLETS from '@salesforce/label/c.NumberOfOutlets'
import LABEL_NUMBER_OF_OUTLETS_HELP from '@salesforce/label/c.PreEval_NumberOfOutlets_Help'
import LABEL_PROJECTED_SPEND from '@salesforce/label/c.ProjectedSpend';
import LABEL_PROJECTED_SPEND_HELP from '@salesforce/label/c.PreEval_ProjectedSpend_Help';
import LABEL_PROJECTED_BRAND_PROFIT from '@salesforce/label/c.ProjectedBrandProfit';
import LABEL_PROJECTED_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_ProjectedBrandProfit_Help';
import LABEL_PROJECTED_GP from '@salesforce/label/c.ProjectedGP';
import LABEL_PROJECTED_GP_HELP from '@salesforce/label/c.PreEval_ProjectedGP_Help';
import LABEL_PROJECTED_SALES_VOLUME from '@salesforce/label/c.ProjectedSalesVolume';
import LABEL_PROJECTED_SALES_VOLUME_HELP from '@salesforce/label/c.PreEval_ProjectedSalesVolume_Help';
import LABEL_PROJECTED_SNS from '@salesforce/label/c.ProjectedSNS';
import LABEL_PROJECTED_SNS_HELP from '@salesforce/label/c.PreEval_ProjectedSNS_Help';
import LABEL_PUBLISH from '@salesforce/label/c.Publish';
import LABEL_RECALL from '@salesforce/label/c.Recall';
import LABEL_RECALL_SUCCESS from '@salesforce/label/c.Recall_Success';
import LABEL_REQUIRED_FIELDS_MESSAGE from '@salesforce/label/c.Required_Fields_Message';
import LABEL_ROI from '@salesforce/label/c.ROI_Percentage';
import LABEL_ROI_HELP from '@salesforce/label/c.PreEval_ROI_Help';
import LABEL_SAVE from '@salesforce/label/c.Save';
import LABEL_SEGMENT_TYPE from '@salesforce/label/c.SegmentType';
import LABEL_SEGMENT_TYPE_HELP from '@salesforce/label/c.PreEval_SegmentType_Help';
import LABEL_SELECTED from '@salesforce/label/c.Selected';
import LABEL_SEND_PDF from '@salesforce/label/c.Send_PDF';
import LABEL_SEND_PDF_SUCCESS_MESSAGE from '@salesforce/label/c.Send_PDF_Success';
import LABEL_SPLIT_ERROR_MESSAGE from '@salesforce/label/c.PreEval_Split_Error';
import LABEL_START_DATE from '@salesforce/label/c.Start_Date';
import LABEL_START_DATE_HELP from '@salesforce/label/c.PreEval_StartDate_Help';
import LABEL_STRATEGIC_PILLAR from '@salesforce/label/c.StrategicPillar';
import LABEL_STRATEGIC_PILLAR_HELP from '@salesforce/label/c.PreEval_StrategicPillar_Help';
import LABEL_SUBMIT_FOR_APPROVAL from '@salesforce/label/c.Submit_For_Approval';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';
import LABEL_TOTAL from '@salesforce/label/c.Total';
import LABEL_TYPE_OF_SPEND from '@salesforce/label/c.TypeOfSpend';
import LABEL_TYPE_OF_SPEND_HELP from '@salesforce/label/c.PreEval_TypeOfSpend_Help';
import LABEL_YES from '@salesforce/label/c.Yes';
import LABEL_WARNING from '@salesforce/label/c.Warning_Title';
import LABEL_WORKING_PLEASEWAIT from '@salesforce/label/c.Working_PleaseWait';

export default class ActivityPreEvaluationForm extends NavigationMixin(LightningElement) {
    labels = {
        addBrand                        : { label: 'Add Brand' },
        all                             : { label: LABEL_ALL },
        available                       : { label: LABEL_AVAILABLE },
        brand                           : { label: LABEL_BRAND, labelPlural: LABEL_BRANDS, help: LABEL_BRAND_HELP },
        cancel                          : { label: LABEL_CANCEL },
        channel                         : { label: LABEL_CHANNEL, help: LABEL_CHANNEL_HELP },
        consumerDriver                  : { label: LABEL_CONSUMER_DRIVER, help: LABEL_CONSUMER_DRIVER_HELP },
        bannerGroup                     : { label: LABEL_BANNER_GROUP, help: LABEL_BANNER_GROUP_HELP },
        description                     : { label: LABEL_DESCRIPTION, help: LABEL_DESCRIPTION_HELP },
        endDate                         : { label: LABEL_END_DATE, help: LABEL_END_DATE_HELP },
        help                            : { label: LABEL_HELP },
        mechanic                        : { label: LABEL_MECHANIC, help: LABEL_MECHANIC_HELP },
        na                              : { label: LABEL_NA },
        name                            : { label: LABEL_NAME },
        no                              : { label: LABEL_NO },
        projectedAPSpend                : { label: LABEL_PROJECTED_SPEND, help: LABEL_PROJECTED_SPEND_HELP },
        publish                         : { label: LABEL_PUBLISH, successMessage: 'Published' },
        recall                          : { label: LABEL_RECALL, recalledMessage: LABEL_RECALL_SUCCESS.replace('%0', 'Pre-Evaluation Form') },
        requiredFields                  : { message: LABEL_REQUIRED_FIELDS_MESSAGE },
        save                            : { label: LABEL_SAVE, message: LABEL_WORKING_PLEASEWAIT },
        saveSuccess                     : { message: LABEL_CHANGES_SAVED_SUCCESSFULLY },
        sendPDF                         : { label: LABEL_SEND_PDF, successMessage: LABEL_SEND_PDF_SUCCESS_MESSAGE },
        segmentType                     : { label: LABEL_SEGMENT_TYPE, help: LABEL_SEGMENT_TYPE_HELP },
        selected                        : { label: LABEL_SELECTED },
        splitError                      : { message: LABEL_SPLIT_ERROR_MESSAGE },
        startDate                       : { label: LABEL_START_DATE, help: LABEL_START_DATE_HELP },
        strategicPillar                 : { label: LABEL_STRATEGIC_PILLAR, help: LABEL_STRATEGIC_PILLAR_HELP },
        submitForApproval               : { label: LABEL_SUBMIT_FOR_APPROVAL, submittedMessage: LABEL_APPROVAL_SUBMITTED.replace('%0', 'Pre-Evaluation Form') },
        summary                         : { label: LABEL_SUMMARY },
        totalIncrementalBrandProfit     : { label: `${LABEL_TOTAL} ${LABEL_INCREMENTAL_BRAND_PROFIT}`, help: LABEL_INCREMENTAL_BRAND_PROFIT_HELP },
        totalNumberOfOutlets            : { label: `${LABEL_TOTAL} ${LABEL_NUMBER_OF_OUTLETS}`, help: LABEL_NUMBER_OF_OUTLETS_HELP },
        totalProjectedBrandProfit       : { label: `${LABEL_TOTAL} ${LABEL_PROJECTED_BRAND_PROFIT}`, help: LABEL_PROJECTED_BRAND_PROFIT_HELP },
        totalProjectedGP                : { label: `${LABEL_TOTAL} ${LABEL_PROJECTED_GP}`, help: LABEL_PROJECTED_GP_HELP },
        totalProjectedSalesVolume       : { label: `${LABEL_TOTAL} ${LABEL_PROJECTED_SALES_VOLUME}`, help: LABEL_PROJECTED_SALES_VOLUME_HELP },
        totalProjectedSNS               : { label: `${LABEL_TOTAL} ${LABEL_PROJECTED_SNS}`, help: LABEL_PROJECTED_SNS_HELP },
        totalROI                        : { label: `${LABEL_TOTAL} ${LABEL_ROI}`, help: LABEL_ROI_HELP },
        typeOfSpend                     : { label: LABEL_TYPE_OF_SPEND, help: LABEL_TYPE_OF_SPEND_HELP },
        warning                         : { label: LABEL_WARNING },
        yes                             : { label: LABEL_YES }
    }

    isPhone = (CLIENT_FORM_FACTOR === "Small");

    @api 
    recordId;

    @track
    isEditingForm = true;

    @track
    isWorking = false;

    @track
    brandInputList = [];

    @track
    projectedAPSpend;

    @track
    startDate;

    @track
    endDate;

    workingMessage = '';

    status = 'Draft';
    isLocked = false;
    activityName;
    recordTypeId;
    typeOfSpend;
    typeOfSpendOptions;
    channel;
    channelOptions;
    segmentType;
    segmentTypeOptions;        
    bannerGroup;
    bannerGroupName;
    consumerDriver;
    consumerDriverOptions;
    strategicPillar;
    strategicPillarOptions;
    selectedBrands;
    mechanic;
    activityDescription;
    publishActivity = false;

    defaultPercentSplit = 0;
    defaultAmountSplit = 0;

    totalIncrementalBrandProfit = 0;
    totalROI = 0;
    totalProjectedSalesVolume = 0;
    totalProjectedSNS = 0;
    totalProjectedGP = 0;
    totalNumberOfOutlets = 0;

    selectedBannerGroups;
    availableBannerGroups;
    selectedSegmentTypes;
    availableSegmentTypes;

    get canPublish() {
        //return this.theActivity && !this.theActivity.Is_Approved__c;
        return true;
    }
    get canSubmitForApproval() {
        return false;
    }
    get canRecallApproval() {
        return this.theActivity && (this.theActivity.Status__c == 'Submitted' || this.theActivity.Status__c == 'Pending Approval');
    }
    get panNumber() {
        return this.theActivity == null ? '' : this.theActivity.Promotion_Activity_Number__c;
    }
    get formattedStartDate() {        
        return this.startDate == null ? null : this.startDate.toISOString();
    }
    get formattedEndDate() {
        return this.endDate == null ? null : this.endDate.toISOString();
    }


    @wire(CurrentPageReference) pageRef;

    @wire(getIsAdminUser)
    isAdminUser;

    get isNotAdminUser() {
        return this.isAdminUser.data == false;
    }
    get isEditable() {
        return this.objectInfo == undefined || this.objectInfo.data == undefined ? true : this.objectInfo.data.updateable;
    }
    get isBroadreach() {
        return this.typeOfSpend != undefined && this.typeOfSpend == 'Broadreach';
    }
    get isActivation() {
        return this.typeOfSpend != undefined && this.typeOfSpend == 'Activation';
    }
    get isNonWorking() {
        return this.typeOfSpend != undefined && this.typeOfSpend == 'Non Working';
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
    }

    picklistValuesMap;
    @wire(getPicklistValuesByRecordType, { objectApiName: { objectApiName: 'Promotion_Activity__c' }, recordTypeId: '$recordTypeId' })
    wiredPicklistValues({ error, data }) {
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
            //groups.push({label: 'Other', value: 'Other', id: 'Other', name: 'Other', imageUrl: '', isSelected: false});
            /*
            groups.sort(function(a, b) {
                let x = a.name.toLowerCase();
                let y = b.name.toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0; 
            });
            */
            //groups.splice(0, 0, { label: this.labels.all.label, value: 'all', id: 'all' });
            //groups.splice(0, 0, { label: this.labels.na.label, value: 'na', id: 'na' });

            this.nationalBannerGroups = groups;
            this.availableBannerGroups = [...groups];
            this.finishedLoadingBannerGroups = true;
            if (this.finishedLoadingForm && this.finishedLoadingObjectInfo && this.finishedLoadingBrandsAndProducts) {
                this.loadPreEvaluationForm();
            }
        }
    }

    brands;
    brandOptions;    
    products;
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
            
            value.data.products.forEach(p => {                
                if (brandIds.indexOf(p.Brand__c) < 0) {
                    brandIds.push(p.Brand__c);
                    let price = value.data.brandPrices.find(bp => bp.Brand__c == p.Brand__c);
                    if (price == undefined) {
                        price = {
                            SNS_Rate__c: 0,
                            GP_Rate__c: 0
                        };
                    }
                    this.brands.push({
                        id: p.Brand__c, 
                        name: p.Brand_Name__c, 
                        imageUrl: p.Brand__r.Primary_Logo__c != undefined ? 'https://salesforce-static.b-fonline.com/images/brand_logos/'+ p.Brand__r.Primary_Logo__c : '',
                        isSelected: false,
                        label: p.Brand_Name__c, 
                        value: p.Brand__c,
                        snsRate: price.SNS_Rate__c || 0,
                        gpRate: price.GP_Rate__c || 0
                    });
                }
                this.products.push({
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
            this.brandOptions = [...this.brands];
            
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
        this.isWorking = true;
        if (this.validateForm()) {
            this.save(false);
        } else {
            this.isWorking = false;
        }
    }
    handlePublishButtonClick() {
        this.isWorking = true;
        if (this.validateForm()) {
            this.save(true);
        } else {
            this.isWorking = false;
        }
        /*
        publishActivity({ activityId: this.recordId })
            .then(result => {
                if (result.status == 'OK') {
                    this.status = 'Approved';
                    this.showToast('success', 'Success', this.labels.publish.successMessage);

                    this.wiredActivity = refreshApex(this.wiredActivity);
                } else {
                    this.showToast('error', 'Warning', result.message);
                }
                this.isWorking = false;
            })
            .catch(error => {
                this.isWorking = false;
                this.error = error;
                this.showToast('error', 'Warning', error);
            });
        */
    }
    handleSubmitForApprovalButtonClick() {
        this.isWorking = true;
        submitForApproval({ activityId: this.recordId })
            .then(result => {
                this.isWorking = false;
                if (result == 'OK') {
                    this.status = 'Pending Approval';
                    this.showToast('success','Success', this.labels.submitForApproval.submittedMessage);
                } else {
                    this.showToast('error', 'Warning', result);
                }
            })
            .catch(error => {
                this.isWorking = false;
                this.error = error;
                this.showToast('error', 'Warning', error);
            });

    }

    handleSendPDFButtonClick() {
        this.isWorking = true;
        sendPDF({activityId: this.recordId})
            .then(result => {
                this.isWorking = false;
                if (result.status == 'OK') {
                    this.showToast('success', 'Success', this.labels.sendPDF.successMessage);
                } else {
                    this.showToast('error', 'Warning', result.message);
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

    handleAddBrandButtonClick(event) {
        try {
            if (this.typeOfSpend == undefined || this.typeOfSpend == '') {
                alert('Select type of spend');
                return;
            }

            this.calculateSplits(true);

            let l = [];
            if (this.brandInputList != undefined) { 
                l = [...this.brandInputList];
            }
        
            const newBrand = {
                value: '',
                index: this.brandInputList.length,
                Id: null,
                Brand__c: '',
                Number_of_Outlets__c: 0,
                Percentage_of_Customer_Universe__c: 0,
                Incremental_Distribution_Points__c: 0,
                PICOS_Delivery__c: 'Attachment',
                Rate_of_Sale__c: 0,
                Baseline_Sales_Volume_9L__c: 0,
                Baseline_SNS__c: 0,
                Baseline_GP__c: 0,
                Baseline_Brand_Profit__c: 0,
                Projected_Sales_Volume__c: 0,
                Projected_SNS__c: 0,
                Projected_GP__c: 0,
                Projected_Brand_Profit__c: 0,
                Incremental_Brand_Profit__c: 0,
                Actual_Sales_Volume__c: 0,
                Actual_GP__c: 0,
                Actual_SNS__c: 0,
                Actual_Brand_Profit__c: 0,
                ROI_Percentage__c: 0,
                Reach__c: 0,
                ESOV__c: 0,
                Engagement_Rates__c: 0,
                Penetration__c: 0,
                Awareness_Increases__c: 0,
                Purchase_Intent__c: 0,
                Meaningful_Difference__c: 0,
                Cost_per_Engagement__c: 0,
                Reach_Premium__c: 0,
                Percent_Split__c: this.defaultPercentSplit,
                Amount_Split__c: this.defaultAmountSplit,
                Split_Manually_Set__c: false,
                Type_of_Spend__c: this.typeOfSpend
            };

            l.push(newBrand);

            this.brandInputList = [...l];

        }catch(ex) {
            console.log('[handleAddBrand] exception', ex);
        }
    }
    handleRemoveBrand(event) {
        try {
            let index = this.selectedBrands.findIndex(sb => sb.index == event.detail.index);
            if (index >= 0) {
                this.selectedBrands.splice(index, 1);
            }
            
            index = this.brandInputList.findIndex(b => b.index == event.detail.index);
            if (index >= 0) {
                let newList = [...this.brandInputList];
                newList.splice(index, 1);
                if (newList.length == 0) {
                    this.brandInputList = undefined;
                } else {
                    this.brandInputList = [...newList];
                }
            }

            this.calculateSplits(false);
            this.updateTotals();
        }catch(ex) {
            console.log('[handleRemoveBrand] exception', ex);
        }
    }
    handleBrandSelected(event) {
        try {
            let b = this.selectedBrands.find(sb => sb.index == event.detail.index);
            if (b == undefined) {
                this.selectedBrands.push(event.detail);
            } else {
                b.brandId = event.detail.brandId;
                b.name = event.detail.name;
            }
        }catch(ex) {
            console.log('[form.handleBrandSelected] exception', ex);
        }
    }
    handleBrandUpdated(event) {
        try {
            let brand = this.brandInputList.find(b => b.Brand__c == event.detail.brandId);
            let temp = {...brand};
            if (event.detail.numberOfOutlets) {
                temp.Number_of_Outlets__c = event.detail.numberOfOutlets;
            }
            if (event.detail.projectedSalesVolume) {
                temp.Projected_Sales_Volume__c = event.detail.projectedSalesVolume;
                temp.Projected_GP__c = event.detail.projectedGP;
                temp.Projected_SNS__c = event.detail.projectedSNS;
                temp.Incremental_Brand_Profit__c = event.detail.incrementalBrandProfit;
                temp.ROI_Percentage__c = event.detail.roi;
            }

            brand = {...temp};

            this.updateTotals();
        }catch(ex) {
            console.log('[activityForm.handleBrandUpdate] exception', ex);
        }
    }

    handleSplitUpdated(event) {
        try {
            this.calculateSplits();
        }catch(ex) {
            console.log('[form.handleSplitUpdated] exception', ex);
        }
    }

    handleActivityNameChange(event) {
        this.activityName = event.detail.value;
    }
    handlePublishActivityChange(event) {
        this.publishActivity = event.detail.checked;
    }
    handleTypeOfSpendChange(event) {
        this.typeOfSpend = event.detail.value;
        if (this.typeOfSpend == 'Non Working') {
            this.brandInputList = [];
        }
    }
    handleConsumerDriverChange(event) {
        this.consumerDriver = event.detail.value;
    }
    handleChannelChange(event) {
        this.channel = event.detail.value;
    }
    handleStrategicPillarChange(event) {
        this.strategicPillar = event.detail.value;
    }
    handleSegmentTypeChange(event) {
        this.selectedSegmentTypes = event.detail.value;
    }
    handleBannerGroupChange(event) {
        this.selectedBannerGroups = event.detail.value;
    }
    handleProjectAPSpendChange(event) {
        this.projectedAPSpend = event.detail.value;
    }
    handleStartDateChange(event) {
        this.startDate = new Date(event.detail.value);
    }
    handleEndDateChange(event) {
        this.endDate = new Date(event.detail.value);
    }
    handleActivityMechanicChange(event) {
        this.mechanic = event.detail.value;
    }
    handleDescriptionChange(event) {
        this.activityDescription = event.detail.value;
    }

    /**
     * Helper functions
     */
    setFieldOptions(picklistValues) {
        Object.keys(picklistValues).forEach(picklist => {            
            if (picklist === 'Channel__c') {
                this.channelOptions = this.setFieldOptionsForField(picklistValues, picklist);                
            }
            if (picklist === 'Type_of_Spend__c') {
                this.typeOfSpendOptions = this.setFieldOptionsForField(picklistValues, picklist);
            }
            if (picklist === 'Segment_Type__c') {
                this.availableSegmentTypes = this.setFieldOptionsForField(picklistValues, picklist);
            }
            if (picklist === 'Consumer_Driver__c') {
                this.consumerDriverOptions = this.setFieldOptionsForField(picklistValues, picklist);
            }
            if (picklist === 'Strategic_Pillar__c') {
                this.strategicPillarOptions = this.setFieldOptionsForField(picklistValues, picklist);
            }
        });

        this.finishedLoadingObjectInfo = true;
        if (this.finishedLoadingForm && this.finishedLoadingBannerGroups && this.finishedLoadingBrandsAndProducts) { 
            this.loadPreEvaluationForm();
        }
        
    }
    
    setFieldOptionsForField(picklistValues, picklist) {        
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

    getBrandSNS() {
        return 0;
    }
    getBrandGP() {
        return 0;
    }    

    loadPreEvaluationForm() {
        this.activityName = this.theActivity.Name;
        this.startDate = this.theActivity.Begin_Date__c == undefined ? new Date() : new Date(this.theActivity.Begin_Date__c);
        this.endDate = this.theActivity.End_Date__c == undefined ? new Date() : new Date(this.theActivity.End_Date__c);
        this.channel = this.theActivity.Channel__c;
        this.typeOfSpend = this.theActivity.Type_of_Spend__c;
        this.projectedAPSpend = this.theActivity.Projected_AP_Spend__c;
        this.consumerDriver = this.theActivity.Consumer_Driver__c;
        this.strategicPillar = this.theActivity.Strategic_Pillar__c;
        this.mechanic = this.theActivity.Activity_Mechanic_Comments__c;
        this.activityDescription = this.theActivity.Description__c;
        this.publishActivity = this.theActivity.Publish_Activity__c;
        this.status = this.theActivity.Status__c;

        this.selectedSegmentTypes = this.theActivity.Segment_Type__c == undefined ? [] : this.theActivity.Segment_Type__c.split(';');

        let bannerGroups = [];
        this.selectedBrands = [];
        let brandList = [];
        this.totalNumberOfOutlets = 0;
        this.totalIncrementalBrandProfit = 0;
        this.totalProjectedSalesVolume = 0;
        this.totalProjectedSNS = 0;
        this.totalProjectedGP = 0;

        if (this.theActivity.Promotion_Activity_Related_Data__r && this.theActivity.Promotion_Activity_Related_Data__r.length > 0) {
            this.theActivity.Promotion_Activity_Related_Data__r.forEach((pard, idx) => {
                if (pard.RecordType.Name == 'Activation' || pard.RecordType.Name == 'Broadreach') {
                    this.selectedBrands.push({ brandId: pard.Brand__c, name: pard.Brand__r.Name, index: idx });
                    brandList.push(pard);

                    this.totalNumberOfOutlets += pard.Number_of_Outlets__c;
                    this.totalIncrementalBrandProfit += pard.Incremental_Brand_Profit__c;
                    this.totalProjectedSalesVolume += pard.Projected_Sales_Volume__c;
                    this.totalProjectedSNS += pard.Projected_SNS__c;
                    this.totalProjectedGP += pard.Projected_GP__c;

                } else if (pard.RecordType.Name == 'Banner Group') {
                    bannerGroups.push(pard.Banner_Group__c);                    
                }                
            });

            this.totalROI = (this.totalIncrementalBrandProfit / this.projectedAPSpend) * 100;

            this.selectedBannerGroups = [...bannerGroups];
            this.brandInputList = [...brandList];

        }        
    }

    validateForm() {
        let isValid = true;
        try {
            if (this.startDate == null || this.endDate == null) {
                isValid = false;
            }

            if (this.typeOfSpend == null || this.typeOfSpend == '') {
                isValid = false;
            }

            if (this.consumerDriver == null || this.consumerDriver == '') {
                isValid = false;
            }
            if (this.channel == null || this.channel == '') {
                isValid = false;
            }
            if (this.strategicPillar == null || this.strategicPillar == '') {
                isValid = false;
            }
            if (this.selectedSegmentTypes == null || this.selectedSegmentTypes.length == 0) {
                isValid = false;
            }
            if (this.projectedAPSpend == null || this.projectedAPSpend == 0) {
                isValid = false;
            }
            if (this.activityDescription == null || this.activityDescription == '') {
                isValid = false;
            }
            if (this.mechanic == null || this.mechanic == '') {
                isValid = false;
            }

            if (this.selectedBannerGroups == undefined || this.selectedBannerGroups.length == 0) {
                isValid = false;
            }
            
            if (!isValid) {
                this.showToast("error", this.labels.warning.label, this.labels.requiredFields.message);
            }

            if (isValid && this.brandInputList.length > 0) {
                let percentSplit = 0;
                let amountSplit = 0;                

                const brandComponents = this.template.querySelectorAll('c-activity-pre-evaluation-brand');
                let brandItems = [];
                if (brandComponents != undefined && brandComponents.length > 0) {
                    brandComponents.forEach(b => {                    
                        const brandItem = b.getBrandItem();
                        percentSplit += parseFloat(brandItem.Percent_Split__c);
                        amountSplit += parseFloat(brandItem.Amount_Split__c);
                    });
                }

                if (percentSplit.toFixed(2) != 100.00 || amountSplit.toFixed(2) != this.projectedAPSpend.toFixed(2)) {
                    isValid = false;
                }

                if (!isValid) {
                    this.showToast("error", this.labels.warning.label, this.labels.splitError.message);
                }
            }

        } catch(ex) {
            console.log('[PreEvalForm.validateForm] exception', ex);
        }

        return isValid;
    }

    save(publish) {
        try {
            const evalForm = Object.assign({}, this.theActivity);
            evalForm.Name = this.activityName;
            evalForm.Begin_Date__c = this.startDate;
            evalForm.End_Date__c = this.endDate;
            evalForm.Market__c = this.market;
            evalForm.Market_Filter__c = this.marketName;
            evalForm.Active__c = true;
            evalForm.Promotion_Type__c = 'Sales Promo';
            if (publish) { 
                this.status = 'Approved'; 
                evalForm.Status__c = 'Approved';
                evalForm.Is_Approved__c = true;
            }
            if (this.status == 'Approved') {
                evalForm.Wombat_Active__c = this.publishActivity;
            }
            
            evalForm.Type_of_Spend__c = this.typeOfSpend;
            evalForm.Channel__c = this.channel;
            evalForm.Segment_Type__c = this.slectedSegmentTypes;
            evalForm.Projected_AP_Spend__c = this.projectedAPSpend;
            evalForm.Consumer_Driver__c = this.consumerDriver;
            evalForm.Strategic_Pillar__c = this.strategicPillar;
            evalForm.Activity_Mechanic_Comments__c = this.mechanic;
            evalForm.Description__c = this.activityDescription;
            evalForm.Publish_Activity__c = this.publishActivity;  
            evalForm.Segment_Type__c = this.selectedSegmentTypes.join(';');         
            
            evalForm.Promo_Brands__c = '';
            this.selectedBrands.forEach(b => {
                evalForm.Promo_Brands__c += b.name + ';';
            })
            let relatedData = [];
            if (this.theActivity.Promotion_Activity_Related_Data__r && this.theActivity.Promotion_Activity_Related_Data__r.length > 0) {
                relatedData = this.theActivity.Promotion_Activity_Related_Data__r;
            }

            const brandComponents = this.template.querySelectorAll('c-activity-pre-evaluation-brand');
            let brandItems = [];
            if (brandComponents != undefined && brandComponents.length > 0) {
                brandComponents.forEach(b => {                    
                    brandItems.push(b.getBrandItem());
                });
            }

            /*
            let bannerGroupItems = [];
            console.log('[save] selectedBannergroups', this.selectedBannerGroups);
            if (this.selectedBannerGroups != undefined && this.selectedBannerGroups.length > 0) {
                this.selectedBannerGroups.forEach(bg => {
                    if (relatedData.find(rd => rd.RecordType.Name == 'Banner Group' && rd.Banner_Group__c == bg) == undefined) {
                        bannerGroupItems.push(bg);
                    }
                });
            }
            */
            saveActivity({
                activity: evalForm,
                relatedData: relatedData,
                brands: brandItems,
                bannerGroups: this.selectedBannerGroups,
                publish: publish
            })
            .then(result => {
                this.showToast('success', 'Success', this.labels.saveSuccess.message);

                this.wiredActivity = refreshApex(this.wiredActivity);
                this.isWorking = false;
            })
            .catch(error => {
                this.error = error;
                this.showToast('error', 'Warning!!', error.body.message);
            });

        }catch(ex) {
            console.log('[save] exception', ex);
            this.isWorking = false;
        }        
    }

    calculateSplits(isAdding) {    

        let totalPercentSplit = 0;
        let totalAmountSplit = 0;
        let manualSetPercentSplit = 0;
        let manualSetAmountSplit = 0;
        let manualCount = 0;

        let numberOfBrands = this.brandInputList == undefined ? 0 : this.brandInputList.length;
        if (isAdding) {
            numberOfBrands++;
        }

        let brandList = [];
        const brandComponents = this.template.querySelectorAll('c-activity-pre-evaluation-brand');
        brandComponents.forEach(bc => {
            let item = bc.getBrandItem();
            if (item.Split_Manually_Set__c) {
                manualSetAmountSplit += parseFloat(item.Amount_Split__c);
                manualSetPercentSplit += parseFloat(item.Percent_Split__c);
                manualCount++;
            } else {
                totalAmountSplit += parseFloat(item.Amount_Split__c);
                totalPercentSplit += parseFloat(item.Percent_Split__c);
            }

            brandList.push(item);
        });

        let remainingPercentSplit = 100 - manualSetPercentSplit;
        let remainingAmountSplit = this.projectedAPSpend - manualSetAmountSplit;
        
        this.defaultPercentSplit = (100 / (numberOfBrands - manualCount)).toFixed(2);
        this.defaultAmountSplit = (this.projectedAPSpend * (this.defaultPercentSplit / 100)).toFixed(2);

        if (remainingPercentSplit > 0) {
            let remainingCount = numberOfBrands - manualCount;
            this.defaultPercentSplit = parseFloat((remainingPercentSplit / remainingCount).toFixed(2));
            this.defaultAmountSplit = parseFloat((remainingAmountSplit / remainingCount).toFixed(2));

            let pRemainder = parseFloat((100 - ((this.defaultPercentSplit * remainingCount) + manualSetPercentSplit)).toFixed(2));
            let aRemainder = parseFloat((this.projectedAPSpend - ((this.defaultAmountSplit * remainingCount) + manualSetAmountSplit)).toFixed(2));

            let newList = [];
            brandList.forEach((b, idx, arr) => {
                if (b.Split_Manually_Set__c) {
                    newList.push(b);
                } else {
                    let t = {...b};
                    t.Percent_Split__c = this.defaultPercentSplit;
                    t.Amount_Split__c = this.defaultAmountSplit;
                    if (idx == arr.length - 1) {
                        t.Percent_Split__c += pRemainder;
                        t.Amount_Split__c += aRemainder;

                        t.Percent_Split__c = parseFloat(t.Percent_Split__c.toFixed(2));
                        t.Amount_Split__c = parseFloat(t.Amount_Split__c.toFixed(2));
                    }
                    newList.push(t);
                }
            });
            this.brandInputList = [...newList];
            
        }

    }

    updateTotals() {
        this.totalNumberOfOutlets = 0;
        this.totalIncrementalBrandProfit = 0;
        this.totalProjectedGP = 0;
        this.totalProjectedSNS = 0;
        this.totalProjectedSalesVolume = 0;
        this.totalROI = 0;

        const brandComponents = this.template.querySelectorAll('c-activity-pre-evaluation-brand');
        brandComponents.forEach(bc => {
            let item = bc.getBrandItem();

            this.totalNumberOfOutlets += parseFloat(item.Number_of_Outlets__c);
            this.totalIncrementalBrandProfit += parseFloat(item.Incremental_Brand_Profit__c);
            this.totalProjectedGP += parseFloat(item.Projected_GP__c);
            this.totalProjectedSNS += parseFloat(item.Projected_SNS__c);
            this.totalProjectedSalesVolume += parseFloat(item.Projected_Sales_Volume__c);            
        });

        this.totalROI = (this.totalIncrementalBrandProfit / this.projectedAPSpend) * 100;
    }
}