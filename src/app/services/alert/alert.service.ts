import { Injectable, computed, signal } from '@angular/core';
import { AlertType } from '../../models/alert.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
    message = signal('');
    class = signal('');

    showAlert(message: string, type: AlertType){
        this.message.set(message);

        switch(type){
            case AlertType.Info: this.class.set('alert alert-info');
                break;
            case AlertType.Error: this.class.set('alert alert-error');
                break;
            case AlertType.Success: this.class.set('alert alert-success');
                break;
            case AlertType.Warning: this.class.set('alert alert-warning');
                break;
            default: this.class.set('');
        }
    }

    close(){
        this.message.set('');
        this.class.set('');
    }

}