import { LightningElement, api } from 'lwc';

export default class ImageTile extends LightningElement {
    @api 
    item;

    @api 
    field;

    @api 
    label;

    @api 
    isreadonly;

    handleClick(event) {        
        try {
            if (this.isreadonly) { return; }
            
            this.dispatchEvent(new CustomEvent('change', { detail: this.field }));
        }catch(ex) {
            console.log('[imageTile.handleClick] exception', ex);
        }
    }
}