package com.myapp.ecommerce.service;

import com.myapp.ecommerce.dao.CustomerRepositry;
import com.myapp.ecommerce.dto.Purchase;
import com.myapp.ecommerce.dto.PurchaseResponse;
import com.myapp.ecommerce.entity.Customer;
import com.myapp.ecommerce.entity.Order;
import com.myapp.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepositry customerRepositry;

    @Autowired
    public CheckoutServiceImpl(CustomerRepositry customerRepositry) {
        this.customerRepositry = customerRepositry;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();

        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAddress());

        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();
        customer.add(order);

        customerRepositry.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // random uuid number
        return UUID.randomUUID().toString();
    }
}
