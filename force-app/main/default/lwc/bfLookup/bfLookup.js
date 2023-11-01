import { LightningElement, api, track, wire } from 'lwc';

import doSearch from '@salesforce/apex/bfLookup_Controller.doSearch';

export default class BfLookup extends LightningElement {
    @api
    fieldName;

    @api 
    objectName;

    @api 
    showImages;

    @api 
    imageLocation;

    @api 
    searchLabel;

    @api 
    limitToMarket;

    @api 
    marketId;

    @api 
    marketName;

    @api 
    marketFieldName;

    @api 
    useMarketId;

    @api 
    isActiveFieldName;

    @api 
    showRequiredIndicator;
    
    @track 
    lookupItems;

    get hasLookupItems() {
        return this.lookupItems && this.lookupItems.length > 0;
    }

    error;
    isLoading;
    showLookupItems = true;
    queryTerm;
    /*
    @wire(doSearch, {queryTerm: '$queryTerm', objectName: this.objectName, showImages: this.showImages})
    wiredDoSearch(value) {
        console.log('getwiredsearch.value', value);
        
        if (value.error) {
            this.error = value.error;
            this.lookupItems = undefined;
        } else if (value.data) {
            this.error = undefined;
            this.lookupItems = value.data;
        }
        
    };
    */
    /*
    handleSearchTermChange(event) {
        this.queryTerm = event.detail.value;
        console.log('queryTerm', this.queryTerm);
    }
    */
    handleKeyUp(event) {
        const isEnterKey = event.keyCode === 13;
        console.log('[handlekeyup] isEnterKey', isEnterKey);
        if (isEnterKey) {
            if (event.target.value == undefined || event.target.value == '') {
                console.log('query term', event.target.value);
                this.lookupItems = [];
            } else {
                this.isLoading = true;
                this.queryTerm = event.target.value;
                this.doTheSearch();    
            }
        }
    }
    handleQueryTermChange(event) {
        try {
            console.log('[handlequerytermchange] event.detail', event.detail.value);
            if (event.detail.value == undefined || event.detail.value == '') {
                console.log('event.detail is null');
                const emptyArray = [];
                this.lookupItems = emptyArray;
            }    
        }catch(ex) {
            console.log('exception', ex);
        }
    }

    handleItemSelected(event) {
        try {
            console.log('[bflookup.handleIitemselected] item id', event.detail.itemId);
            console.log('[bflookup.handleIitemselected] item name', event.detail.itemName);
            const lookupSelectedEvent = new CustomEvent('lookupselected', {
                detail: { itemId: event.detail.itemId, itemName: event.detail.itemName, imageUrl: event.detail.imageUrl, fieldName: this.fieldName }
            });
            this.dispatchEvent(lookupSelectedEvent);
            //this.showLookupItems = false;
    
        } catch(ex) {
            console.log('[bflookup.handleitemselected] exception', ex);
        }
    }

    doTheSearch() {
        doSearch({queryTerm: this.queryTerm, objectName: this.objectName, showImages: this.showImages, limitToMarket: this.limitToMarket, 
                    marketId: this.marketId, marketName: this.marketName, marketFieldName: this.marketFieldName, useMarketId: this.useMarketId,
                    isActiveFieldName: this.isActiveFieldName })
        .then(result => {
            console.log('result', result);            
            this.lookupItems = result;
            this.isLoading = false;
        })
        .catch(error => {
            console.log('error', error);
        });
    }
}