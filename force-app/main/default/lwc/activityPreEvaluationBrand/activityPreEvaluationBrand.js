import { LightningElement, api, track } from 'lwc';

import LABEL_ACTUAL_BRAND_PROFIT from '@salesforce/label/c.Actual_Brand_Profit';
import LABEL_ACTUAL_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_ActualBrandProfit_Help';
import LABEL_ACTUAL_GP from '@salesforce/label/c.Actual_GP';
import LABEL_ACTUAL_GP_HELP from '@salesforce/label/c.PreEval_ActualGP_Help';
import LABEL_ACTUAL_SALES_VOLUME from '@salesforce/label/c.Actual_Sales_Volume';
import LABEL_ACTUAL_SALES_VOLUME_HELP from '@salesforce/label/c.PreEval_ActualSalesVolume_Help';
import LABEL_ACTUAL_SNS from '@salesforce/label/c.Actual_SNS';
import LABEL_ACTUAL_SNS_HELP from '@salesforce/label/c.PreEval_ActualSNS_Help';
import LABEL_ACTUAL_INCREMENTAL_BRAND_PROFIT from '@salesforce/label/c.Actual_Incremental_Brand_Profit';
import LABEL_ACTUAL_INCREMENTAL_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_ActualIncrementalBrandProfit_Help';
import LABEL_ACTUAL_ROI from '@salesforce/label/c.Actual_ROI';
import LABEL_ACTUAL_ROI_HELP from '@salesforce/label/c.PreEval_ActualROI_Help';
import LABEL_AMOUNT_SPLIT from '@salesforce/label/c.PreEval_Amount_Split';
import LABEL_AWARENESS_INCREASE from '@salesforce/label/c.AwarenessIncrease';
import LABEL_AWARENESS_INCREASE_HELP from '@salesforce/label/c.AwarenessIncreaseHelp';
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
import LABEL_COST_PER_ENGAGEMENT from '@salesforce/label/c.CostPerEngagement';
import LABEL_COST_PER_ENGAGEMENT_HELP from '@salesforce/label/c.PreEval_CostPerEngagement_Help';
import LABEL_ENGAGEMENT_RATES from '@salesforce/label/c.EngagementRates';
import LABEL_ENGAGEMENT_RATES_HELP from '@salesforce/label/c.PreEval_EngagementRates_Help';
import LABEL_ESOV from '@salesforce/label/c.ESOV';
import LABEL_ESOV_HELP from '@salesforce/label/c.PreEval_ESOV_Help';
import LABEL_GP_RATE from '@salesforce/label/c.GP_Rate';
import LABEL_INCREMENTAL_BRAND_PROFIT from '@salesforce/label/c.IncrementalBrandProfit';
import LABEL_INCREMENTAL_BRAND_PROFIT_HELP from '@salesforce/label/c.PreEval_IncrementalBrandProfit_Help';
import LABEL_INCREMENTAL_DISTRIBUTION_POINTS from '@salesforce/label/c.IncrementalDistributionPoints';
import LABEL_INCREMENTAL_DISTRIBUTION_POINTS_HELP from '@salesforce/label/c.PreEval_IncrementalDistributionPoints_Help';
import LABEL_MEANINGFUL_DIFFERENCE from '@salesforce/label/c.MeaningfulDifference';
import LABEL_MEANINGFUL_DIFFERENCE_HELP from '@salesforce/label/c.PreEval_MeaningfulDifference_Help';
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
import LABEL_SNS_RATE from '@salesforce/label/c.SNS_Rate';
import LABEL_SPLIT_ERROR from '@salesforce/label/c.PreEval_Split_Error';

export default class ActivityPreEvaluationBrand extends LightningElement {
    labels = {
        actualSalesVolume               : { label: LABEL_ACTUAL_SALES_VOLUME, help: LABEL_ACTUAL_SALES_VOLUME_HELP },
        actualSNS                       : { label: LABEL_ACTUAL_SNS, help: LABEL_ACTUAL_SNS_HELP },
        actualGP                        : { label: LABEL_ACTUAL_GP, help: LABEL_ACTUAL_GP_HELP },
        actualBrandProfit               : { label: LABEL_ACTUAL_BRAND_PROFIT, help: LABEL_ACTUAL_BRAND_PROFIT_HELP },
        actualIncrementalBrandProfit    : { label: LABEL_ACTUAL_INCREMENTAL_BRAND_PROFIT, help: LABEL_ACTUAL_INCREMENTAL_BRAND_PROFIT_HELP },
        actualROIPercentage             : { label: LABEL_ACTUAL_ROI, help: LABEL_ACTUAL_ROI_HELP },
        amountSplit                     : { label: LABEL_AMOUNT_SPLIT },
        awarenessIncrease               : { label: LABEL_AWARENESS_INCREASE, help: LABEL_AWARENESS_INCREASE_HELP },
        baselineSalesVolume             : { label: LABEL_BASELINE_SALES_VOLUME, help: LABEL_BASELINE_SALES_VOLUME_HELP },
        baselineSNS                     : { label: LABEL_BASELINE_SNS, help: LABEL_BASELINE_SNS_HELP },
        baselineGP                      : { label: LABEL_BASELINE_GP, help: LABEL_BASELINE_GP_HELP },
        baselineBrandProfit             : { label: LABEL_BASELINE_BRAND_PROFIT, help: LABEL_BASELINE_BRAND_PROFIT_HELP },
        brand                           : { label: LABEL_BRAND },
        broadreach                      : { title: LABEL_BROADREACH_TITLE },
        btlActivation                   : { title: LABEL_BTL_ACTIVATION },
        costPerEngagement               : { label: LABEL_COST_PER_ENGAGEMENT, help: LABEL_COST_PER_ENGAGEMENT_HELP },
        engagementRates                 : { label: LABEL_ENGAGEMENT_RATES, helpe: LABEL_ENGAGEMENT_RATES_HELP },
        esov                            : { label: LABEL_ESOV, help: LABEL_ESOV_HELP },
        gpRate                          : { label: LABEL_GP_RATE },
        incrementalBrandProfit          : { label: LABEL_INCREMENTAL_BRAND_PROFIT, help: LABEL_INCREMENTAL_BRAND_PROFIT_HELP },
        incrementalDistributionPoints   : { label: LABEL_INCREMENTAL_DISTRIBUTION_POINTS, help: LABEL_INCREMENTAL_DISTRIBUTION_POINTS_HELP },
        meaningfulDifference            : { label: LABEL_MEANINGFUL_DIFFERENCE, help: LABEL_MEANINGFUL_DIFFERENCE_HELP },
        numberOfOutlets                 : { label: LABEL_NUMBER_OF_OUTLETS, help: LABEL_NUMBER_OF_OUTLETS_HELP },
        penetration                     : { label: LABEL_PENETRATION, help: LABEL_PENETRATION_HELP },
        percentageOfCustomerUniverse    : { label: LABEL_PERCENTAGE_CUSTOMER_UNIVERSE, help: LABEL_PERCENTAGE_CUSTOMER_UNIVERSE_HELP },
        picosDelivery                   : { label: LABEL_PICOS_DELIVERY, help: LABEL_PICOS_DELIVERY_HELP },
        percentSplit                    : { label: LABEL_PERCENT_SPLIT },
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
        snsRate                         : { label: LABEL_SNS_RATE },
        split                           : { error: LABEL_SPLIT_ERROR },
    };

    _item;
    
    @api 
    get item() {
        return this._item;
    };
    set item(value) {
        this._item = value;
        
        this.brandId = value.Brand__c;
        this.brandImage = value.Brand__r == undefined || value.Brand__r.Primary_Logo__c == undefined ? '' : 'https://salesforce-static.b-fonline.com/images/brand_logos/'+ value.Brand__r.Primary_Logo__c;
        this.brandGPRate = value.Brand_GP_Rate__c;
        this.brandSNSRate = value.Brand_SNS_Rate__c;
        this.numberOfOutlets = value.Number_of_Outlets__c;
        this.percentageOfCustomerUniverse = value.Percentage_of_Customer_Universe__c;
        this.incrementalDistributionPoints = value.Incremental_Distribution_Points__c;
        this.baselineSalesVolume = value.Baseline_Sales_Volume_9L__c;
        this.projectedSalesVolume = value.Projected_Sales_Volume__c;
        this.actualSalesVolume = value.Actual_Sales_Volume__c;
        this.reach = value.Reach__c;
        this.esov = value.ESOV__c;
        this.engagementRates = value.Engagement_Rates__c;
        this.penetration = value.Penetration__c;
        this.awarenessIncreases = value.Awareness_Increases__c;
        this.purchaseIntent = value.Purchase_Intent__c;
        this.meaningfulDifference = value.Meaningful_Difference__c;
        this.costPerEngagement = value.Cost_per_Engagement__c;
        this.reachPremium = value.Reach_Premium__c;
        this.brandSNSRate = value.Brand_SNS_Rate__c;
        this.brandGPRate = value.Brand_GP_Rate__c;
        this.percentSplit = value.Percent_Split__c;
        this.amountSplit = value.Amount_Split__c;
        this.manuallySet = value.Split_Manually_Set__c;
    }

    @api 
    typeOfSpend;

    @api 
    startDate;

    @api 
    endDate;

    @api 
    brands;

    @api 
    selectedBrands;

    @api 
    theActivity;

    @api
    projectedSpend;

    _defaultAmountSplit = 0;
    @api 
    get defaultAmountSplit() {
        return this._defaultAmountSplit;
    }
    set defaultAmountSplit(value) {
        this._defaultAmountSplit = value;
        if (!this.manuallySet && value > 0) {
            this.amountSplit = value;
        }
    }

    _defaultPercentSplit = 0;
    @api 
    get defaultPercentSplit() {
        return this._defaultPercentSplit;
    }
    set defaultPercentSplit(value) {
        this._defaultPercentSplit = value;
        if (!this.manuallySet && value > 0) { 
            this.percentSplit = value;
        }
    }

    @api 
    amountSpit;

    @api 
    percentSplit;

    @api 
    getBrandItem() {
        return {
            Id: this.item.Id,
            Activity__c: this.theActivity.Id,
            RecordTypeId: this.item.RecordTypeId == undefined ? '' : this.item.RecordTypeId,
            Brand__c: this.brandId,
            Brand_GP_Rate__c: this.brandGPRate,
            Brand_SNS_Rate__c: this.brandSNSRate,
            Number_of_Outlets__c: this.numberOfOutlets || 0,
            Percentage_of_Customer_Universe__c: this.percentageOfCustomerUniverse || 0,
            Incremental_Distribution_Points__c: this.incrementalDistributionPoints || 0,
            PICOS_Delivery__c: this.picosDelivery,
            Rate_of_Sales__c: this.rateOfSale || 0,
            Actual_Sales_Volume__c: this.actualSalesVolume || 0,
            Actual_SNS__c: this.actualSNS,
            Actual_GP__c: this.actualGP,
            Actual_Brand_Profit__c: this.actualBrandProfit,
            Baseline_Sales_Volume_9L__c: this.baselineSalesVolume || 0,
            Baseline_SNS__c: this.baselineSNS,
            Baseline_GP__c: this.baselineGP,
            Baseline_Brand_Profit__c: this.baselineBrandProfit,
            Projected_Sales_Volume__c: this.projectedSalesVolume || 0,
            Projected_SNS__c: this.projectedSNS,
            Projected_GP__c: this.projectedGP,
            Projected_Brand_Profit__c: this.projectedBrandProfit,
            Incremental_Brand_Profit__c: this.incrementalBrandProfit,
            ROI_Percent__c: this.roiPercent || 0,
            Reach__c: this.reach || 0,
            ESOV__c: this.esov || 0,
            Engagement_Rates__c: this.engagementRates || 0,
            Penetration__c: this.penetration || 0,
            Awareness_Increases__c: this.awarenessIncreases || 0,
            Purchase_Intent__c: this.purchaseIntent || 0,
            Meaningful_Difference__c: this.meaningfulDifference || 0,
            Cost_per_Engagement__c: this.costPerEngagement || 0,
            Reach_Premium__c: this.reachPremium || 0,
            Percent_Split__c: this.percentSplit || 0,
            Amount_Split__c: this.amountSplit || 0,
            Split_Manually_Set__c: this.manuallySet || 0
        };
    }

    @track
    availableBrands;

    isConnected = false;
    connectedCallback() {
        if (this.isConnected) { return; }

        this.isConnected = true;

        let l = [];
        try {
            if (this.selectedBrands != undefined && this.selectedBrands.length > 0) {
                l = this.brands.filter(b => this.selectedBrands.find(sb => sb.id ==b.id) == undefined);
            } else {
                l = [...this.brands];
            }
        }catch(ex) {
            console.log('[activitybrand.availableBrands] exception', ex);
        }

        this.availableBrands = [...l];
    }

    manuallySet = false;

    brandId;
    brandImage;
    brandSNSRate;
    brandGPRate;
    numberOfOutlets;
    percentageOfCustomerUniverse;
    incrementalDistributionPoints;
    
    actualSalesVolume;
    baselineSalesVolume;
    projectedSalesVolume;

    reach;
    esov;
    engagementRates;
    penetration;
    awarenessIncreases;
    purchaseIntent;
    meaningfulDifference;
    costPerEngagement;
    reachPremium;

    get isLocked() {
        //return this.theActivity && (this.theActivity.Status__c == 'Submitted' || this.theActivity.Status__c == 'Approved');
        return false;
    }
    get isBroadreach() {
        return this.typeOfSpend != undefined && this.typeOfSpend == 'Broadreach';
    }
    get isBTL() {
        return this.typeOfSpend != undefined && this.typeOfSpend == 'Activation';
    }
    get title() {
        let brandName = '';
        if (this.brandId != undefined && this.brandId != null && this.brandId != '') {
            brandName = this.brands.find(b => b.value == this.brandId).label;
        }
        let groupTitle = 'Non Working';
        if (this.isBTL) {
            groupTitle = this.labels.btlActivation.title;
        } else if (this.isBroadreach) {
            groupTitle = this.labels.broadreach.title;
        }

        let t = `${brandName} ${groupTitle}`;
        //let t = `${brandName} ${this.isBTL ? this.labels.btlActivation.title : this.labels.broadreach.title}`;

        return t;
    }


    get picosDelivery() {
        return 'Attachment';
    }
    get rateOfSale() {
        if (this.numberOfOutlets == 0 || this.startDate == undefined || this.endDate == undefined) { return; }
        const oneDay = 24 * 60 * 60 * 1000;  // hours * minutes * seconds * milliseconds
        let days = Math.round(Math.abs((this.endDate - this.startDate) / oneDay));
        let v = this.projectedSalesVolume / this.numberOfOutlets / (days / 7);
        return v.toFixed(2);
    }

    get actualSNS() {
        let v = this.actualSalesVolume * this.brandSNSRate;
        return v.toFixed(2);
    }
    get actualGP() {
        let v = this.actualSalesVolume * this.brandGPRate;
        return v.toFixed(2);
    }
    get actualBrandProfit() {
        let v = this.actualGP - this.amountSplit;
        return v.toFixed(2);
    }
    get baselineSNS() {
        let v = this.baselineSalesVolume * this.brandSNSRate;
        return v.toFixed(2);        
    }
    get baselineGP() {        
        let v = this.baselineSalesVolume * this.brandGPRate;
        return v.toFixed(2);
    }
    get baselineBrandProfit() {
        return this.baselineGP;
    }

    get projectedSNS() {
        let v = this.projectedSalesVolume * this.brandSNSRate;

        return v.toFixed(2);
    }
    get projectedGP() {
        let v = this.projectedSalesVolume * this.brandGPRate;

        return v.toFixed(2);
    }
    get projectedBrandProfit() {
        let v = this.projectedGP - this.amountSplit;
        return v.toFixed(2);
    }
    get actualIncrementalBrandProfit() {
        let v = this.actualBrandProfit - this.baselineBrandProfit;
        return v.toFixed(2);
    }
    get incrementalBrandProfit() {
        let v = this.projectedBrandProfit - this.baselineBrandProfit;
        return v.toFixed(2);
    }
    get actualROIPercent() {
        let v = (this.actualIncrementalBrandProfit / this.amountSplit) * 100;
        return v.toFixed(2);
    }
    get roiPercent() {
        let v = 0;
        try {
            v = (this.incrementalBrandProfit / this.amountSplit) * 100;
        }catch(ex) {
            console.log('[roiPercentage] exception', ex);
        }

        return v.toFixed(2);
    }

    handleRemoveBrandButtonClick(event) {
        this.dispatchEvent(new CustomEvent('remove', { detail: { brand: this.brandId, index: this.item.index }}));
    }

    handleBrandChange(event) {
        try {
            this.brandId = event.detail.value;
            this.brand = this.brands.find(b => b.id == event.detail.value);
            this.brandImage = this.brand.imageUrl;
            this.brandSNSRate = this.brand.snsRate;
            this.brandGPRate = this.brand.gpRate;
            
            this.dispatchEvent(new CustomEvent('selected', { detail: { brandId: event.detail.value, name: this.brand.name, index: this.item.index }}));
        }catch(ex) {
            console.log('[brand.handleBrandChange] exception', ex);
        }
    }

    handleNumberOfOutletsChange(event) {
        this.numberOfOutlets = event.detail.value;
    }
    handleNumberOfOutletsCommit(event) {
        try {
            const d = {
                brandId: this.brandId,
                index: this.item.index,
                numberOfOutlets: this.numberOfOutlets
            };
            this.dispatchEvent(new CustomEvent('updated', { detail: d }));
        }catch(ex) {
            console.log('[handleNumberOfOutletsCommit] exception', ex);
        }
    }
    handlePercentageOfCustomerUniverseChange(event) {
        this.percentageOfCustomerUniverse = event.detail.value;
    }
    handleIncrementalDistributionPointsChange(event) {
        this.incrementalDistributionPoints = event.detail.value;
    }
    handleActualSalesVolumeChange(event) {
        this.actualSalesVolume = event.detail.value;
    }
    handleBaselineSalesVolumeChange(event) {
        this.baselineSalesVolume = event.detail.value;
    }
    handleProjectedSalesVolumeChange(event) {
        this.projectedSalesVolume = event.detail.value;
    }
    handleProjectedSalesVolumeCommit(event) {
        const ev = {
            brandId: this.brandId,
            index: this.item.index,
            projectedSalesVolume: this.projectedSalesVolume,
            projectedGP: this.projectedGP,
            projectedSNS: this.projectedSNS,
            incrementalBrandProfit: this.incrementalBrandProfit,
            roi: this.roiPercent
        };
        this.dispatchEvent(new CustomEvent('updated', { detail: ev }));        
    }
    handleReachChange(event) {
        this.reach = event.detail.value;
    }
    handleESOVChange(event) {
        this.esov = event.detail.value;
    }
    handleEngagementRatesChange(event) {
        this.engagementRates = event.detail.value;
    }
    handlePenetrationChange(event) {
        this.penetration = event.detail.value;
    }
    handleAwarenessIncreasesChange(event) {
        this.awarenessIncreases = event.detail.value;
    }
    handlePurchaseIntentChange(event) {
        this.purchaseIntent = event.detail.value;
    }
    handleMeaningfulDifferenceChange(event) {
        this.meaningfulDifference = event.detail.value;
    }
    handleCostPerEngagementChange(event) {
        this.costPerEngagement = event.detail.value;
    }
    handleReachPremiumChange(event) {
        this.reachPremium = event.detail.value;
    }

    handlePercentSplitChange(event) {
        this.percentSplit = event.detail.value;
        this.manuallySet = true;

        this.amountSplit = (this.projectedSpend * (this.percentSplit / 100)).toFixed(2);

    }
    handlePercentSplitCommit() {
        let splitDetail = {
            brandId: this.brandId, 
            amountSplit: this.amountSplit,
            percentSplit: this.percentSplit
        };

        this.dispatchEvent(new CustomEvent('split', { detail: splitDetail }));
    }
    handleAmountSplitChange(event) {
        this.amountSplit = event.detail.value;
        this.manuallySet = true;

        this.percentSplit = ((this.amountSplit / this.projectedSpend) * 100).toFixed(2);

        let splitDetail = {
            brandId: this.brandId, 
            amountSplit: this.amountSplit,
            percentSplit: this.percentSplit
        };
        
        this.dispatchEvent(new CustomEvent('split', { detail: splitDetail }));
    }
    handleAmountSplitCommit() {
        let splitDetail = {
            brandId: this.brandId, 
            amountSplit: this.amountSplit,
            percentSplit: this.percentSplit
        };

        this.dispatchEvent(new CustomEvent('split', { detail: splitDetail }));
    }

 
}