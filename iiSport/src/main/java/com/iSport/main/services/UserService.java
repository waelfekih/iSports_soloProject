package com.iSport.main.services;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.iSport.main.models.LoginUser;
import com.iSport.main.models.User;
import com.iSport.main.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    // Register a new user
    public User register(User newUser, BindingResult result) {
        Optional<User> potentialUser = userRepo.findByEmail(newUser.getEmail());

        if (potentialUser.isPresent()) {
            result.rejectValue("email", "Matches", "An account with that email already exists!");
        }

        // Uncomment and fix if you add a confirmPassword field
        // if (!newUser.getPassword().equals(newUser.getConfirmPassword())) {
        //     result.rejectValue("confirmPassword", "Matches", "The Confirm Password must match Password!");
        // }

        if (result.hasErrors()) {
            return null;
        }

        String hashed = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
        newUser.setPassword(hashed);
        return userRepo.save(newUser);
    }

    // Login an existing user
    public User login(LoginUser newLoginUser, BindingResult result) {
        Optional<User> potentialUser = userRepo.findByEmail(newLoginUser.getEmail());

        if (!potentialUser.isPresent()) {
            result.rejectValue("email", "Matches", "User not found!");
            return null;
        }

        User user = potentialUser.get();

        if (!BCrypt.checkpw(newLoginUser.getPassword(), user.getPassword())) {
            result.rejectValue("password", "Matches", "Invalid Password!");
        }

        if (result.hasErrors()) {
            return null;
        }

        return user;
    }

    // Find a user by ID
    public User findById(Long id) {
        Optional<User> potentialUser = userRepo.findById(id);
        return potentialUser.orElse(null);
    }

    // Find a user by Email (added method)
    
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepo.findByEmail(email);
        return userOpt.orElse(null);
    }

    public User save(User user) {
        return userRepo.save(user);
    }

}
