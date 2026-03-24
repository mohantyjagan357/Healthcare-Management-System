package com.example.HealthManagementSystem.controller;


import com.example.HealthManagementSystem.model.Appointment;
import com.example.HealthManagementSystem.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAppointmentList() { return appointmentService.getAppointmentList(); }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentByID(@PathVariable Long id) {
        return appointmentService.getAppointmentByID(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody Appointment appt) {
        try {
            Appointment created = appointmentService.bookAppointment(appt);
            return ResponseEntity.created(URI.create("/api/appointments/" + created.getId())).body(created);
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment cancelled = appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(cancelled);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
