import { LightningElement, api } from 'lwc';

export default class BfLookupItem extends LightningElement {
    @api 
    item;

    @api
    nameField = 'Name';

    handleClick(event) {
        try {        
            const name = this.item[this.nameField];
            const selectedEvent = new CustomEvent('selected', {
                detail: { itemId: this.item.Id, itemName: name, imageUrl: this.item.SmallPhotoUrl }
            });
            this.dispatchEvent(selectedEvent);
        }catch(ex) {
            console.log('[lookupitemlwc.handleclick] exception', ex);
        }
    }

}