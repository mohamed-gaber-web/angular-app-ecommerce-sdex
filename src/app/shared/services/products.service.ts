import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiProducts, getProductByCategory, productDetails, getProductByBrand } from "../api/api";
import { Product } from "../models/product";



@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    limit: number = 5;
    offset: number = 0;

    queryParams = `?Offset=${this.offset}&Limit=${this.limit}`

    constructor(private http: HttpClient) {}

    getProducts(productQuery: string) {
        return this.http.get(`${ApiProducts}/${productQuery}` + this.queryParams);
    }

    getProductById(id: number) {
        const params = `?id=${id}`;
        return this.http.get<Product>(`${productDetails}` + params);
    }

    getProductByCategory(catId: string, currentPage: number, orderPerPage: number) {
        const params = `?Offset=${currentPage}&limit=${orderPerPage}&categoryId=${catId}`;
        return this.http.get<Product>(`${getProductByCategory}` + params);
    }

    getProductByBrand(brandId: string) {
        const params = `?BrandId=${brandId}&Offset=0&Limit=10`;
        return this.http.get(`${getProductByBrand}` + params);
    }

}