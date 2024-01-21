import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private basUrl: string = "http://localhost:8080/api/products";

    private categoryUrl = 'http://localhost:8080/api/product-category'

    constructor(private httpClient: HttpClient) {
    }

    // Get product by page, and size => Pagination
    getProductListPagination(thePage: number,
                             thePageSize: number,
                             theCategoryId: number): Observable<GetResponseProducts> {

        const searchUrl = `${this.basUrl}/search/findByCategoryId?id=${theCategoryId}`
            + `&page=${thePage}&size=${thePageSize}`
        ;

        return this.httpClient.get<GetResponseProducts>(searchUrl);

    }

    // Get Search product with pagination
    searchProductPagination(thePage: number,
                            thePageSize: number,
                            theKeyWord: string
    ): Observable<GetResponseProducts> {

        console.log(`the page number ${thePage} size ${thePageSize}`);
        const searchUrl = `${this.basUrl}/search/findByNameContaining`
            + `?name=${theKeyWord}&page=${thePage}&size=${thePageSize}`
        ;

        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    // Get detail for on Product
    getProduct(productId: number): Observable<Product> {

        const searchUrl = `${this.basUrl}/${productId}`;

        return this.httpClient.get<Product>(searchUrl);
    }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }
}

interface GetResponseProducts {
    _embedded: {
        products: Product[]
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
