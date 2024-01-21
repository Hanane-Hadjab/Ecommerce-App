import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
    selector: 'app-cart-details',
    templateUrl: './cart-details.component.html',
    styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    totalQuantity: number = 0;

    constructor(private carteService: CartService) {
    }

    ngOnInit(): void {
        this.listCartDetails();
    }

    listCartDetails() {
        this.cartItems = this.carteService.cartItems;

        this.carteService.totalPrice.subscribe(
            data => this.totalPrice = data
        );

        this.carteService.totalQuantity.subscribe(
            data => this.totalQuantity = data
        );

        this.carteService.computeCarteTotals();
    }

    incrementQuantity(theCartItem: CartItem) {
        this.carteService.addToCart(theCartItem);
    }

    decrementQuantity(theCartItem: CartItem) {
        this.carteService.decrementQuantity(theCartItem);
    }

    removeElement(theCartItem: CartItem) {
        this.carteService.remove(theCartItem);
    }

}
