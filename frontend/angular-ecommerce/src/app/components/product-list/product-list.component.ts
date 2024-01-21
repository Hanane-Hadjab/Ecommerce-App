import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategory: number = 1;
    searchMode: boolean = false;
    previousKeyWord: string = "";

    // Properties for Pagination
    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private carteService: CartService
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });
    }

    listProducts() {
        this.searchMode = this.route.snapshot.paramMap.has("keyword");
        if (this.searchMode) {
            // La recherche Par nom
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }

    handleListProducts() {
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            // get ID param string, convert to number using '+' symbole
            // ! => pour dire au compélateur que la valeur ne peut pas etre null
            this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
        } else {
            this.currentCategoryId = 1;
        }

        // Check if we have a different category than previous,
        // If we have a different category id than previous then set thePageNumber = 1

        if (this.previousCategory != this.currentCategoryId) {
            this.thePageNumber = 1;
        }

        this.previousCategory = this.currentCategoryId;

        console.log(`current category id ${this.currentCategoryId}, the page number ${this.thePageNumber}`);

        this.productService.getProductListPagination(this.thePageNumber - 1,
            this.thePageSize,
            this.currentCategoryId)
            .subscribe(this.processResult());
    }

    handleSearchProducts() {

        const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;

        if (this.previousKeyWord != theKeyWord) {
            this.thePageNumber = 1;
        }

        this.previousKeyWord = theKeyWord;

        this.productService.searchProductPagination(this.thePageNumber - 1,
            this.thePageSize,
            theKeyWord)
            .subscribe(this.processResult());
    }

    updatePageSize(myPageSize: string) {
        this.thePageNumber = +myPageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }

    private processResult() {
        return (data: any) => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        }
    }

    addToCart(product: Product) {
        console.log(`the product name is ${product.name}, ${product.unitPrice}`);

        const cartItem = new CartItem(product);

        this.carteService.addToCart(cartItem);

    }
}
