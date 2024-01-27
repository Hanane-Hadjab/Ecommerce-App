package com.myapp.ecommerce.dto;

import com.myapp.ecommerce.entity.Address;
import com.myapp.ecommerce.entity.Customer;
import com.myapp.ecommerce.entity.Order;
import com.myapp.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address billingAddress;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
