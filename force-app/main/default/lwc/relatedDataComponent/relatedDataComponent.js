import { LightningElement, api, wire } from 'lwc';

export default class RelatedDataComponent extends LightningElement {

    @api 
    objectApiName;

    @api
    fields;

    objectInfo;
    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    wireGetObjectInfo(value) {
        if (value.error) {
            this.error = value.error;
            this.objectInfo = undefined;
        } else if (value.data) {
            this.objectInfo = value.data;
            
        }
    }

}