package com.iSport.main.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iSport.main.models.Events;
import com.iSport.main.models.User;
import com.iSport.main.repositories.EventsRepository;

import jakarta.validation.Valid;

@Service
public class EventsService {

    @Autowired
    private EventsRepository repo;

    // List all events
    public List<Events> all() {
        return repo.findAll();
    }

    // Create a new event
    public Events create(@Valid Events event) {
        return repo.save(event);
    }

    // Find event by ID
    public Events findById(Long id) {
        Optional<Events> optionalEvent = repo.findById(id);
        return optionalEvent.orElse(null);
    }

    // Update an existing event
    public Events update(@Valid Events event) {
        return repo.save(event);
    }

    // Delete an event by ID
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // Find events by user
    public List<Events> findByUser(User user) {
        return repo.findByUser(user);
    }

    // Find events by event name
    public List<Events> findByEventName(String eventName) {
        return repo.findByEventName(eventName);
    }

    // Find events by location
    public List<Events> findByLocation(String location) {
        return repo.findByLocation(location);
    }

    // Find events by date
    public List<Events> findByDate(LocalDate date) {
        return repo.findByDate(date);
    }

    // Find events by time
    public List<Events> findByTime(LocalTime time) {
        return repo.findByTime(time);
    }

}
