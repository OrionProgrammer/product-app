import { ImageRecord } from "./imageRecord";

export interface Product {
    productId: number;
    name: string;
    code: string;
    description: string;
    price: number;
    ImageBase64String: any;
    ImageType: string;
    ImageRecord: ImageRecord;
    Image: any;
    categoryId: number;
  }