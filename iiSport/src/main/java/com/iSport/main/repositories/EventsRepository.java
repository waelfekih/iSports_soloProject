package com.iSport.main.repositories;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iSport.main.models.Events;
import com.iSport.main.models.User;

@Repository
public interface EventsRepository extends JpaRepository<Events, Long> {

    // Find all events by a user
    List<Events> findByUser(User user);

    // Find events with a specific name
    List<Events> findByEventName(String eventName);

    // Find events by location
    List<Events> findByLocation(String location);

    // Find events by date
    List<Events> findByDate(LocalDate date);

    // Find events by time
    List<Events> findByTime(LocalTime time);
    
    @EntityGraph(attributePaths = {"user"})
    List<Events> findAll();

    

}



