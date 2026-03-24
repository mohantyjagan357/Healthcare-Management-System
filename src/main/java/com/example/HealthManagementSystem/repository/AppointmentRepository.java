package com.example.HealthManagementSystem.repository;

import com.example.HealthManagementSystem.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Find appointments for a provider overlapping a time window
    @Query("SELECT a FROM Appointment a WHERE a.provider = :provider AND a.status = 'SCHEDULED' AND " +
            "((a.startTime < :end) AND (a.endTime > :start))")
    List<Appointment> findOverlapping(@Param("provider") String provider,
                                      @Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end);
}
