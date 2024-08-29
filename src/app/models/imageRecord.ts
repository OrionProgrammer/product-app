import { SafeResourceUrl } from '@angular/platform-browser';

export class ImageRecord {
    
    public name: string;
    public imgUrlSafe: SafeResourceUrl;

    constructor(name: string,
                imgUrlSafe?: SafeResourceUrl)
    {
        this.name = name;
        if (imgUrlSafe)
        {
            this.imgUrlSafe = imgUrlSafe;
        }
        else
        {
            this.imgUrlSafe = '';
        }
        

    }
}