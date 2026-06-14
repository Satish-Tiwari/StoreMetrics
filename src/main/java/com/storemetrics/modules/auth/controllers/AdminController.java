package com.storemetrics.modules.auth.controllers;

import com.storemetrics.modules.auth.entities.User;
import com.storemetrics.modules.auth.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/manager")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // In a real scenario, you'd have a specific DTO for password changing
    @PostMapping("/change-password/{id}")
    public ResponseEntity<String> changeUserPassword(@PathVariable UUID id, @RequestBody String newPasswordHash) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Assuming password encoding is done here or before passing to this endpoint
        user.setPasswordHash(newPasswordHash);
        userRepository.save(user);
        return ResponseEntity.ok("Password changed successfully for user");
    }
}
