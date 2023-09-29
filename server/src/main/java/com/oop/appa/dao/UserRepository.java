package com.oop.appa.dao;

import com.oop.appa.entity.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Page<User> findAll(Pageable pageable);

}
