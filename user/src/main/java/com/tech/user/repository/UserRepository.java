package com.tech.user.repository;

import com.tech.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    // No additional methods are needed here if you only need basic CRUD operations.
    // Spring Data MongoDB provides CRUD operations out of the box.
    // You can add custom query methods if needed.
}
