package com.oop.appa.dao;

import com.oop.appa.entity.User;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
//    Page<User> findAll(Pageable pageable);
    Optional<User>findByEmail(String email);
     @NotNull
     Optional<User> findById(@NotNull Integer id);
}
