package com.iSport.main.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.iSport.main.models.Events;
import com.iSport.main.models.LoginUser;
import com.iSport.main.models.User;
import com.iSport.main.services.EventsService;
import com.iSport.main.services.UserService;

@Controller
public class iSportController {

    @Autowired
    private UserService userService;

    @Autowired
    private EventsService eventsService;

    // Show login/register page
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("newUser", new User());
        model.addAttribute("newLogin", new LoginUser());
        return "index";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("newUser") User newUser, 
                           BindingResult result, Model model, HttpSession session) {

        User user = userService.register(newUser, result);

        if (result.hasErrors()) {
            model.addAttribute("newLogin", new LoginUser());
            return "index";
        }

        session.setAttribute("userId", user.getId());
        return "redirect:/dashboard";
    }

    @PostMapping("/login")
    public String login(@Valid @ModelAttribute("newLogin") LoginUser newLogin, 
                        BindingResult result, Model model, HttpSession session) {

        User user = userService.login(newLogin, result);

        if (result.hasErrors()) {
            model.addAttribute("newUser", new User());
            return "index";
        }

        session.setAttribute("userId", user.getId());
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return "redirect:/";
        }

        User user = userService.findById(userId);
        List<Events> allEvents = eventsService.findByUser(user);

        // Filter events that occur today
        LocalDate today = LocalDate.now();
        List<Events> todayEvents = allEvents.stream()
            .filter(e -> e.getDate().isEqual(today))
            .collect(Collectors.toList());

        model.addAttribute("user", user);
        model.addAttribute("today", today);
        model.addAttribute("todayEventsCount", todayEvents.size());

        return "dashboard";
    }

}
