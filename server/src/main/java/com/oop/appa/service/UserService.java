package com.oop.appa.service;

import java.util.List;
// import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.User;

@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // get all users
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Page<User> findAllPaged(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // POST and UPDATE
    public void save(User user) {
        userRepository.save(user);
    }

    // DELETE
    public void delete(User user) {
        userRepository.delete(user);
    }

    public void deleteById(int id) {
        userRepository.deleteById(id);
    }
}
