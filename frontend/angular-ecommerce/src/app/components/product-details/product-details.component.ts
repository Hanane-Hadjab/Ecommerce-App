import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

    product!: Product;

    constructor(private productService: ProductService,
                private cartService: CartService,
                private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.getProductDetails();
        });
    }

    getProductDetails() {
        const productId = +this.route.snapshot.paramMap.get('id')!;

        this.productService.getProduct(productId).subscribe(
            data => {
                console.log("the data is " + JSON.stringify(data));

                this.product = data;
            }
        );
    }

    addToCart(product: Product) {

        const cartIem: CartItem = new CartItem(product);

        this.cartService.addToCart(cartIem);
    }
}
