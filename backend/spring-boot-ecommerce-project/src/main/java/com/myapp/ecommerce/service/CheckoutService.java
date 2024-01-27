package com.myapp.ecommerce.service;

import com.myapp.ecommerce.dto.Purchase;
import com.myapp.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
