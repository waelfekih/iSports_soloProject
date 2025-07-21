package com.iSport.main;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

import com.iSport.main.models.Events;
import com.iSport.main.models.User;
import com.iSport.main.services.EventsService;
import com.iSport.main.services.UserService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private EventsService eventsService;
    
    

    // ---------- AUTH ----------

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            System.out.println(">>> /api/login endpoint hit");

            String email = loginData.get("email");
            String password = loginData.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
            }

            User user = userService.findByEmail(email);
            if (user == null || !BCrypt.checkpw(password, user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
            }

            System.out.println("Login successful: " + email);
            return ResponseEntity.ok(new LoginResponse("Login successful", user));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Internal server error"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User newUser) {
        if (userService.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity.badRequest().body(Map.of("email", "Email already exists"));
        }

        String hashed = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
        newUser.setPassword(hashed);

        User savedUser = userService.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    // Global exception handler for validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(errors);
    }
    
    // Show user details
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.findById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());

        // Only update password if it's different (to avoid rehashing)
        if (!updatedUser.getPassword().equals(user.getPassword())) {
            String hashed = BCrypt.hashpw(updatedUser.getPassword(), BCrypt.gensalt());
            user.setPassword(hashed);
        }

        userService.save(user);

        return ResponseEntity.ok(user);
    }
    
    //Log Out
    @GetMapping("/logout")
    public String logout(HttpSession session) {
    	session.invalidate();
    	return "redirect:/";
    }



    // ---------- EVENTS ----------

    @GetMapping("/events")
    public List<Events> getAllEvents() {
        return eventsService.all();
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<Events> getEvent(@PathVariable Long id) {
        Events event = eventsService.findById(id);
        return event != null ? ResponseEntity.ok(event) : ResponseEntity.notFound().build();
    }

    @PostMapping("/events")
    public Events createEvent(@RequestBody Events event) {
        return eventsService.create(event);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<Events> updateEvent(@PathVariable Long id, @RequestBody Events updatedEvent) {
        Events event = eventsService.findById(id);
        if (event == null) return ResponseEntity.notFound().build();

        updatedEvent.setId(id);
        return ResponseEntity.ok(eventsService.update(updatedEvent));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventsService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ---------- EVENTS BY USER ----------

    @GetMapping("/users/{id}/events")
    public ResponseEntity<List<Events>> getEventsByUser(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(eventsService.findByUser(user));
    }
}
