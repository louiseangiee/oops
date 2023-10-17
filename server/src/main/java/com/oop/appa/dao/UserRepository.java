package com.oop.appa.dao;

import com.oop.appa.entity.Portfolio;
import com.oop.appa.entity.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
//    Page<User> findAll(Pageable pageable);
    Optional<User>findByEmail(String email);
    Optional<User>findById(Integer id);
}
