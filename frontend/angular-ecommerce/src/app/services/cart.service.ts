import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, ReplaySubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];

    // Subject is a subclass of Observable, donc se sont des observable qui peuvent envoyer des evènements
    // ReplaySubject is subclass of Subject !!
    // BehaviorSubject is a subclass of Subject

    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    constructor() {
    }

    addToCart(theCartItem: CartItem) {
        let alreadyExistsInCat = false;
        let existingCartItem = undefined;

        if (this.cartItems.length > 0) {
            existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

            alreadyExistsInCat = (existingCartItem != undefined);

        }


        if (alreadyExistsInCat) {
            // @ts-ignore
            existingCartItem.quantity++;
        } else {
            this.cartItems.push(theCartItem);
        }

        this.computeCarteTotals();
    }

    computeCarteTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for (let cartItem of this.cartItems) {
            totalPriceValue += cartItem.quantity * cartItem.unitPrice;
            totalQuantityValue += cartItem.quantity;
        }

        // ---------------------- Publish event to publish data ------------------------
        // publier la valeur au composants, de sorte que tous les abonnées (composant) reçoivent la data
        // next() =>  publich / send event

        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // log cart data just for debugging
        this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log("Contents of the cart");

        for (let cartItem of this.cartItems) {
            const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
            console.log(`name: ${cartItem.name}, quantity ${cartItem.quantity}, unitPrice: ${cartItem.unitPrice}, subtotal price ${subTotalPrice}`);
        }

        console.log(`total price ${totalPriceValue.toFixed(2)}, total quantity is ${totalQuantityValue}`);
    }

    decrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity--;
        if (theCartItem.quantity === 0) {
            this.remove(theCartItem);
        } else {
            this.computeCarteTotals();
        }
    }

    remove(theCartItem: CartItem) {
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

        if (itemIndex > -1) {
            // remove one element à partie de l'index => l'eement en question
            this.cartItems.splice(itemIndex, 1);
            this.computeCarteTotals();
        }
    }
}
