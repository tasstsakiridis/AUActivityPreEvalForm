import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';

import getActivity from '@salesforce/apex/PreEvaluationForm_Controller.getActivity';
import getUserDetails from '@salesforce/apex/PreEvaluationForm_Controller.getUserDetails';
import sendPDF from '@salesforce/apex/PreEvaluationForm_Controller.sendPDF';

import LABEL_AMOUNT_SPLIT from '@salesforce/label/c.PreEval_Amount_Split';
import LABEL_AWARENESS_INCREASE from '@salesforce/label/c.AwarenessIncrease';
import LABEL_AWARENESS_INCREASE_HELP from '@salesforce/label/c.AwarenessIncreaseHelp';
import LABEL_BANNER_GROUP from '@salesforce/label/c.Banner_Groups';
import LABEL_BANNER_GROUP_HELP from '@salesforce/label/c.PreEval_BannerGroup_Help';
import LABEL_BASELINE_BRAND_PROFIT from '@salesforce/label/c.BaselineBrandProfit';
import LABEL_BASELINE_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_BaselineBrandProfit_Help';
import LABEL_BASELINE_GP from '@salesforce/label/c.BaselineGP';
import LABEL_BASELINE_GP_HELP from '@salesforce/label/c.PreEval_BaselineGP_Help';
import LABEL_BASELINE_SALES_VOLUME from '@salesforce/label/c.BaselineSalesVolume';
import LABEL_BASELINE_SALES_VOLUME_HELP from '@salesforce/label/c.PreEval_BaselineSalesVolume_Help';
import LABEL_BASELINE_SNS from '@salesforce/label/c.BaselineSNS';
import LABEL_BASELINE_SNS_HELP from '@salesforce/label/c.PreEval_BaselineSNS_Help';
import LABEL_BRAND from '@salesforce/label/c.Brand';
import LABEL_BROADREACH_TITLE from '@salesforce/label/c.Broadreach_Title';
import LABEL_BTL_ACTIVATION from '@salesforce/label/c.BTL_Activation_Title';
import LABEL_CANCEL from '@salesforce/label/c.Cancel';
import LABEL_CHANNEL from '@salesforce/label/c.Channel';
import LABEL_CHANNEL_HELP from '@salesforce/label/c.PreEval_Channel_Help';
import LABEL_CONSUMER_DRIVER from '@salesforce/label/c.ConsumerDriver';
import LABEL_CONSUMER_DRIVER_HELP from '@salesforce/label/c.PreEval_ConsumerDriver_Help';
import LABEL_COST_PER_ENGAGEMENT from '@salesforce/label/c.CostPerEngagement';
import LABEL_COST_PER_ENGAGEMENT_HELP from '@salesforce/label/c.PreEval_CostPerEngagement_Help';
import LABEL_DESCRIPTION from '@salesforce/label/c.Description';
import LABEL_DESCRIPTION_HELP from '@salesforce/label/c.PreEval_Description_Help';
import LABEL_END_DATE from '@salesforce/label/c.End_Date';
import LABEL_END_DATE_HELP from '@salesforce/label/c.PreEval_EndDate_Help';
import LABEL_ENGAGEMENT_RATES from '@salesforce/label/c.EngagementRates';
import LABEL_ENGAGEMENT_RATES_HELP from '@salesforce/label/c.PreEval_EngagementRates_Help';
import LABEL_ESOV from '@salesforce/label/c.ESOV';
import LABEL_ESOV_HELP from '@salesforce/label/c.PreEval_ESOV_Help';
import LABEL_GP_RATE from '@salesforce/label/c.GP_Rate';
import LABEL_HELP from '@salesforce/label/c.Help';
import LABEL_INCREMENTAL_BRAND_PROFIT from '@salesforce/label/c.IncrementalBrandProfit';
import LABEL_INCREMENTAL_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_IncrementalBrandProfit_Help';
import LABEL_INCREMENTAL_DISTRIBUTION_POINTS from '@salesforce/label/c.IncrementalDistributionPoints';
import LABEL_INCREMENTAL_DISTRIBUTION_POINTS_HELP from '@salesforce/label/c.PreEval_IncrementalDistributionPoints_Help';
import LABEL_INFO from '@salesforce/label/c.Info';
import LABEL_MEANINGFUL_DIFFERENCE from '@salesforce/label/c.MeaningfulDifference';
import LABEL_MEANINGFUL_DIFFERENCE_HELP from '@salesforce/label/c.PreEval_MeaningfulDifference_Help';
import LABEL_MECHANIC from '@salesforce/label/c.Activity_Mechanic';
import LABEL_MECHANIC_HELP from '@salesforce/label/c.PreEval_Mechanic_Help';
import LABEL_NUMBER_OF_OUTLETS from '@salesforce/label/c.NumberOfOutlets'
import LABEL_NUMBER_OF_OUTLETS_HELP from '@salesforce/label/c.PreEval_NumberOfOutlets_Help'
import LABEL_PENETRATION from '@salesforce/label/c.Penetration';
import LABEL_PENETRATION_HELP from '@salesforce/label/c.PreEval_Penetration_Help';
import LABEL_PERCENT_SPLIT from '@salesforce/label/c.PreEval_Percent_Split';
import LABEL_PERCENTAGE_CUSTOMER_UNIVERSE from '@salesforce/label/c.PercentageOfCustomerUniverse';
import LABEL_PERCENTAGE_CUSTOMER_UNIVERSE_HELP from '@salesforce/label/c.PreEval_PercentageOfCustomerUniverse_Help';
import LABEL_PICOS_DELIVERY from '@salesforce/label/c.PicosDelivery';
import LABEL_PICOS_DELIVERY_HELP from '@salesforce/label/c.PreEval_PICOSDelivery_Help';
import LABEL_PROJECTED_BRAND_PROFIT from '@salesforce/label/c.ProjectedBrandProfit';
import LABEL_PROJECTED_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_ProjectedBrandProfit_Help';
import LABEL_PROJECTED_GP from '@salesforce/label/c.ProjectedGP';
import LABEL_PROJECTED_GP_HELP from '@salesforce/label/c.PreEval_ProjectedGP_Help';
import LABEL_PROJECTED_SALES_VOLUME from '@salesforce/label/c.ProjectedSalesVolume';
import LABEL_PROJECTED_SALES_VOLUME_HELP from '@salesforce/label/c.PreEval_ProjectedSalesVolume_Help';
import LABEL_PROJECTED_SPEND from '@salesforce/label/c.ProjectedSpend';
import LABEL_PROJECTED_SPEND_HELP from '@salesforce/label/c.PreEval_ProjectedSpend_Help';
import LABEL_PROJECTED_SNS from '@salesforce/label/c.ProjectedSNS';
import LABEL_PROJECTED_SNS_HELP from '@salesforce/label/c.PreEval_ProjectedSNS_Help';
import LABEL_PURCHASE_INTENT from '@salesforce/label/c.PurchaseIntent';
import LABEL_PURCHASE_INTENT_HELP from '@salesforce/label/c.PreEval_PurchaseIntent_Help';
import LABEL_RATE_OF_SALE from '@salesforce/label/c.RateOfSale';
import LABEL_RATE_OF_SALE_HELP from '@salesforce/label/c.PreEval_RateOfSale_Help';
import LABEL_REACH from '@salesforce/label/c.Reach';
import LABEL_REACH_HELP from '@salesforce/label/c.PreEval_Reach_Help';
import LABEL_REACH_PREMIUM from '@salesforce/label/c.ReachPremium';
import LABEL_REACH_PREMIUM_HELP from '@salesforce/label/c.PreEval_ReachPremium_Help';
import LABEL_REMOVE from '@salesforce/label/c.Remove';
import LABEL_ROI_PERCENTAGE from '@salesforce/label/c.ROI_Percentage';
import LABEL_ROI_PERCENTAGE_HELP from '@salesforce/label/c.PreEval_ROI_Help';
import LABEL_SEGMENT_TYPE from '@salesforce/label/c.SegmentType';
import LABEL_SEGMENT_TYPE_HELP from '@salesforce/label/c.PreEval_SegmentType_Help';
import LABEL_SEND_PDF from '@salesforce/label/c.Send_PDF';
import LABEL_SEND_PDF_SUCCESS_MESSAGE from '@salesforce/label/c.Send_PDF_Success';
import LABEL_SNS_RATE from '@salesforce/label/c.SNS_Rate';
import LABEL_SPLIT_ERROR from '@salesforce/label/c.PreEval_Split_Error';
import LABEL_START_DATE from '@salesforce/label/c.Start_Date';
import LABEL_START_DATE_HELP from '@salesforce/label/c.PreEval_StartDate_Help';
import LABEL_STRATEGIC_PILLAR from '@salesforce/label/c.StrategicPillar';
import LABEL_STRATEGIC_PILLAR_HELP from '@salesforce/label/c.PreEval_StrategicPillar_Help';
import LABEL_SUMMARY from '@salesforce/label/c.Summary';
import LABEL_TYPE_OF_SPEND from '@salesforce/label/c.TypeOfSpend';
import LABEL_TYPE_OF_SPEND_HELP from '@salesforce/label/c.PreEval_TypeOfSpend_Help';

export default class ActivityPreEvaluationFormSummary extends NavigationMixin(LightningElement) {
    labels = {
        amountSplit                     : { label: LABEL_AMOUNT_SPLIT },
        awarenessIncrease               : { label: LABEL_AWARENESS_INCREASE, help: LABEL_AWARENESS_INCREASE_HELP },
        bannerGroup                     : { label: LABEL_BANNER_GROUP, help: LABEL_BANNER_GROUP_HELP },
        baselineSalesVolume             : { label: LABEL_BASELINE_SALES_VOLUME, help: LABEL_BASELINE_SALES_VOLUME_HELP },
        baselineSNS                     : { label: LABEL_BASELINE_SNS, help: LABEL_BASELINE_SNS_HELP },
        baselineGP                      : { label: LABEL_BASELINE_GP, help: LABEL_BASELINE_GP_HELP },
        baselineBrandProfit             : { label: LABEL_BASELINE_BRAND_PROFIT, help: LABEL_BASELINE_BRAND_PROFIT_HELP },
        brand                           : { label: LABEL_BRAND },
        broadreach                      : { title: LABEL_BROADREACH_TITLE },
        btlActivation                   : { title: LABEL_BTL_ACTIVATION },
        cancel                          : { label: LABEL_CANCEL },
        channel                         : { label: LABEL_CHANNEL, help: LABEL_CHANNEL_HELP },
        consumerDriver                  : { label: LABEL_CONSUMER_DRIVER, help: LABEL_CONSUMER_DRIVER_HELP },
        costPerEngagement               : { label: LABEL_COST_PER_ENGAGEMENT, help: LABEL_COST_PER_ENGAGEMENT_HELP },
        description                     : { label: LABEL_DESCRIPTION, help: LABEL_DESCRIPTION_HELP },
        endDate                         : { label: LABEL_END_DATE, help: LABEL_END_DATE_HELP },
        engagementRates                 : { label: LABEL_ENGAGEMENT_RATES, helpe: LABEL_ENGAGEMENT_RATES_HELP },
        esov                            : { label: LABEL_ESOV, help: LABEL_ESOV_HELP },
        gpRate                          : { label: LABEL_GP_RATE },
        help                            : { label: LABEL_HELP },
        incrementalBrandProfit          : { label: LABEL_INCREMENTAL_BRAND_PROFIT, help: LABEL_INCREMENTAL_BRAND_PROFIT_HELP },
        incrementalDistributionPoints   : { label: LABEL_INCREMENTAL_DISTRIBUTION_POINTS, help: LABEL_INCREMENTAL_DISTRIBUTION_POINTS_HELP },
        info                            : { label: LABEL_INFO },
        meaningfulDifference            : { label: LABEL_MEANINGFUL_DIFFERENCE, help: LABEL_MEANINGFUL_DIFFERENCE_HELP },
        mechanic                        : { label: LABEL_MECHANIC, help: LABEL_MECHANIC_HELP },
        numberOfOutlets                 : { label: LABEL_NUMBER_OF_OUTLETS, help: LABEL_NUMBER_OF_OUTLETS_HELP },
        penetration                     : { label: LABEL_PENETRATION, help: LABEL_PENETRATION_HELP },
        percentageOfCustomerUniverse    : { label: LABEL_PERCENTAGE_CUSTOMER_UNIVERSE, help: LABEL_PERCENTAGE_CUSTOMER_UNIVERSE_HELP },
        picosDelivery                   : { label: LABEL_PICOS_DELIVERY, help: LABEL_PICOS_DELIVERY_HELP },
        percentSplit                    : { label: LABEL_PERCENT_SPLIT },
        print                           : { label: 'Print' },
        projectedAPSpend                : { label: LABEL_PROJECTED_SPEND, help: LABEL_PROJECTED_SPEND_HELP },
        projectedBrandProfit            : { label: LABEL_PROJECTED_BRAND_PROFIT, help: LABEL_PROJECTED_BRAND_PROFIT_HELP },
        projectedGP                     : { label: LABEL_PROJECTED_GP, help: LABEL_PROJECTED_GP_HELP },
        projectedSalesVolume            : { label: LABEL_PROJECTED_SALES_VOLUME, help: LABEL_PROJECTED_SALES_VOLUME_HELP },
        projectedSNS                    : { label: LABEL_PROJECTED_SNS, help: LABEL_PROJECTED_SNS_HELP },        
        purchaseIntent                  : { label: LABEL_PURCHASE_INTENT, help: LABEL_PURCHASE_INTENT_HELP },
        rateOfSale                      : { label: LABEL_RATE_OF_SALE, help: LABEL_RATE_OF_SALE_HELP },
        reach                           : { label: LABEL_REACH, help: LABEL_REACH_HELP },
        reachPremium                    : { label: LABEL_REACH_PREMIUM, help: LABEL_REACH_PREMIUM_HELP },
        removeBrand                     : { label: `${LABEL_REMOVE} ${LABEL_BRAND}`},
        roiPercentage                   : { label: LABEL_ROI_PERCENTAGE, help: LABEL_ROI_PERCENTAGE_HELP },
        segmentType                     : { label: LABEL_SEGMENT_TYPE, help: LABEL_SEGMENT_TYPE_HELP },
        sendPDF                         : { label: LABEL_SEND_PDF, successMessage: LABEL_SEND_PDF_SUCCESS_MESSAGE },
        snsRate                         : { label: LABEL_SNS_RATE },
        split                           : { error: LABEL_SPLIT_ERROR },
        startDate                       : { label: LABEL_START_DATE, help: LABEL_START_DATE_HELP },
        strategicPillar                 : { label: LABEL_STRATEGIC_PILLAR, help: LABEL_STRATEGIC_PILLAR_HELP },
        summary                         : { label: LABEL_SUMMARY },
        typeOfSpend                     : { label: LABEL_TYPE_OF_SPEND, help: LABEL_TYPE_OF_SPEND_HELP },
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


    wiredActivity;
    activity;
    @wire(getActivity, {activityId: '$activityId'})
    wiredGetActivity(value) {
        console.log('[getFormData] activityId', this.activityId);
        this.wiredActivity = value;
        if (value.error) {
            this.error = value.error;
            this.activity = undefined;
        } else {
            console.log('[getFormData] result', value.data);
            this.error = undefined;
            this.activity = value.data;
            this.loadData();
        }
    }

    activityName;
    panNumber;
    status;
    formattedStartDate;
    formattedEndDate;
    bannerGroups;
    segmentTypes;
    brandData;

    loadData() {
        console.log('[loadData] activity', this.activity);
        if (this.activity == undefined) { return; }

        try {
            this.activityName = this.activity.Name;
            this.status = this.activity.Status__c;
            this.panNumber = this.activity.Promotion_Activity_Number__c;
            this.isBroadreach = this.activity.Type_of_Spend__c == 'Broadreach';
            this.isActivation = this.activity.Type_of_Spend__c == 'Activation';

            let dt;
            if (this.activity.Begin_Date__c) {
                dt = new Date(this.activity.Begin_Date__c);
                this.formattedStartDate = dt.toISOString();    
            }

            if (this.activity.End_Date__c) {
                dt = new Date(this.activity.End_Date__c);
                this.formattedEndDate = dt.toISOString();    
            }

            this.bannerGroups = '';
            this.brandData = [];

            if (this.activity.Promotion_Activity_Related_Data__r != undefined) {
                this.activity.Promotion_Activity_Related_Data__r.forEach(pard => {
                    if (pard.RecordType.Name == 'Banner Group') {
                        this.bannerGroups += pard.Banner_Group__r.Name + ', ';
                    } else if (pard.RecordType.Name == 'Activation') {
                        this.brandData.push(pard);
                    } else if (pard.RecordType.Name == 'Broadreach') {
                        this.brandData.push(pard);
                    }
                });
                this.bannerGroups = this.bannerGroups.substr(0, this.bannerGroups.length - 2);
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

    handleSendPDFButtonClick() {
        this.isWorking = true;
        sendPDF({activityId: this.recordId})
            .then(result => {
                this.isWorking = false;
                if (result == 'OK') {
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


}