package com.oop.appa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.oop.appa.service.UserService;
// import com.oop.appa.dao.UserRepository;
import com.oop.appa.entity.User;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET endpoints
    @GetMapping()
    public List<User> findAll() {
        return userService.findAll();
    }

    @GetMapping("/paged")
    public Page<User> findAllPaged(Pageable pageable) {
        return userService.findAllPaged(pageable);
    }

    // POST endpoint
    @PostMapping
    public void save(User user) {
        userService.save(user);
    }

    @PutMapping
    public void updateUser(@RequestBody User user) {
        userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable int id) {
        userService.deleteById(id);
    }

    @DeleteMapping
    public void delete(@RequestBody User user) {
        userService.delete(user);
    }
}

