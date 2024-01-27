package com.myapp.ecommerce.dao;

import com.myapp.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepositry extends JpaRepository<Customer, Long> {
}
