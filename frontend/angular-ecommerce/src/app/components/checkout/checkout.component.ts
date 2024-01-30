import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {ShopValidators} from "../../validators/shop-validators";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup!: FormGroup;

    totalPrice: number = 0;
    totalQuantity: number = 0;

    creditCadYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];

    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    constructor(private formBuilder: FormBuilder,
                private shopFormService: ShopFormService,
                private cartService: CartService,
                private checkoutService: CheckoutService,
                private router: Router
    ) {

    }

    ngOnInit(): void {
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new FormControl('',
                    [Validators.required,
                        Validators.minLength(2),
                        ShopValidators.notOnlyWhiteSpace]),
                lastName: new FormControl('',
                    [Validators.required,
                        Validators.minLength(2),
                        ShopValidators.notOnlyWhiteSpace]),
                email: new FormControl('',
                    [Validators.required,
                        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                    ])
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required,
                    Validators.minLength(2),
                    ShopValidators.notOnlyWhiteSpace
                ]),
                city: new FormControl('', [Validators.required,
                    Validators.minLength(2), ShopValidators.notOnlyWhiteSpace
                ]),
                zipCode: new FormControl('', [Validators.required,
                    Validators.minLength(2),
                    ShopValidators.notOnlyWhiteSpace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [Validators.required,
                    Validators.minLength(2),
                    ShopValidators.notOnlyWhiteSpace
                ]),
                city: new FormControl('', [Validators.required,
                    Validators.minLength(2), ShopValidators.notOnlyWhiteSpace
                ]),
                zipCode: new FormControl('', [Validators.required,
                    Validators.minLength(2),
                    ShopValidators.notOnlyWhiteSpace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                nameOnCard: new FormControl('', [Validators.required,
                    Validators.minLength(2), ShopValidators.notOnlyWhiteSpace
                ]),
                cardNumber: new FormControl('', [Validators.required,
                    Validators.pattern('[0-9]{16}')
                ]),
                securityCode: new FormControl('', [Validators.required,
                    Validators.pattern('[0-9]{3}')]),
                expirationMonth: [''],
                expirationYear: ['']
            }),
        });

        // populate credit card months
        const startMonth = new Date().getMonth() + 1;

        this.shopFormService.getCreditCardMonths(startMonth).subscribe(
            data => {
                this.creditCardMonths = data;
            }
        )
        // populate credit card years

        this.shopFormService.getCreditCardYears().subscribe(
            data => {
                this.creditCadYears = data;
            }
        )

        this.shopFormService.getCountries().subscribe(
            data => {
                console.log("the countries data  is ", data);
                this.countries = data;
            }
        )

        this.reviewCartDetails();
    }

    onSubmit() {
        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }
        /* call service to update order  ------------- Steps ----------------------- */
        // set up order
        // get cart items
        // create orderItems from cartItems
        //           *********** setup purchase ************
        // populate purchase - customer
        // populate purchase - shipping address
        // populate purchase - billing address
        // populate purchase - billing order and orderItems
        // call REST API via CheckoutService

        // @ts-ignore
        let purchase = new Purchase();

        // @ts-ignore
        let order: Order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        const cartItems = this.cartService.cartItems;

        // order items
        let orderItemsShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

        // shipping address
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        // billing address
        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        // customer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;

        purchase.order = order;

        purchase.orderItems = orderItemsShort;

        // Call API REST

        this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                    alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`);

                    // reset cart

                    this.resetCart();
                },
                error: err => {
                    alert(`There was an error: ${err.message}`);
                }
            }
        );
    }

    copyShippingAddressToBillingAddress(event: any) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress']
                .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

            this.billingAddressStates = this.shippingAddressStates;
        } else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            this.billingAddressStates = [];
        }
    }

    handleMonthsAndYears() {
        const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

        const currentYear: number = new Date().getFullYear();

        const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

        let startMonth: number;

        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1;
        } else {
            startMonth = 1;
        }

        this.shopFormService.getCreditCardMonths(startMonth).subscribe(
            data => {
                this.creditCardMonths = data;
            }
        )
    }

    getStates(formGroupName: string) {

        const formGroup = this.checkoutFormGroup.get(formGroupName);

        const countryCode = formGroup?.value.country.code;

        this.shopFormService.getStates(countryCode).subscribe(
            data => {
                if (formGroupName === 'shippingAddress') {
                    this.shippingAddressStates = data;
                } else {
                    this.billingAddressStates = data;
                }

                // select first element s default
                formGroup?.get('state')?.setValue(data[0]);
            }
        );
    }

    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }

    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }

    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }

    get shippingAddressStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }

    get shippingAddressCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }

    get shippingAddressCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }

    get shippingAddressState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }

    get shippingAddressZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }

    get billingAddressStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }

    get billingAddressCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }

    get billingAddressCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }

    get billingAddressState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }

    get billingAddressZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }

    get creditCardType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }

    get creditNameOnCard() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }

    get creditCardNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }

    get creditCardSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }

    private reviewCartDetails() {
        this.cartService.totalPrice.subscribe(
            data => this.totalPrice = data
        );

        this.cartService.totalQuantity.subscribe(
            data => this.totalQuantity = data
        );
    }

    private resetCart() {

        // reset cart data
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        //reset form
        this.checkoutFormGroup.reset();

        // navigate back to the products pages
        this.router.navigateByUrl("/products");
    }
}
