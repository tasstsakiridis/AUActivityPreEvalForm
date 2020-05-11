import { LightningElement, api } from 'lwc';

export default class ActivityCommunicationMethod extends LightningElement {
    labels = {
        name: { label: 'Name' },
        primary: { label: 'Primary' },
        secondary: { label: 'Secondary' },
        reach: { label: 'Reach' }
    };

    @api 
    record;

    @api
    isreadonly;
    
    get name() {
        console.log('[acm] record', this.record);
        return this.record == undefined ? '' : this.record.Name;
    }
    get isPrimary() {
        return this.record == undefined ? false : this.record.Primary__c;
    }
    get isSecondary() {
        return this.record == undefined ? false : this.record.Secondary__c;
    }
    get reachCount() {
        return this.record == undefined ? 0 : this.record.Reach__c;
    }

    handleIsPrimaryChange(event) {
        this.sendDataToParent('primary', event.detail.checked);
    }
    handleIsSecondaryChange(event) {
        this.sendDataToParent('secondary', event.detail.checked);
    }
    handleReachChange(event) {
        this.sendDataToParent('reach', event.detail.value);
    }

    sendDataToParent(fieldName, fieldValue) {
        const ev = new CustomEvent('change', { detail: {field: fieldName, name: this.name, value: fieldValue }});
        console.log('[sendDataToParent', ev);
        this.dispatchEvent(ev)
    }
}