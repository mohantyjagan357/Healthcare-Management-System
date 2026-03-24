package com.example.HealthManagementSystem.controller;


import com.example.HealthManagementSystem.model.Patient;
import com.example.HealthManagementSystem.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> getPatients() { return patientService.getPatients(); }

    @PostMapping
    public ResponseEntity<Patient> addPatient(@Valid @RequestBody Patient p) {
        Patient created = patientService.addPatient(p);
        return ResponseEntity.created(URI.create("/api/patients/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.findPatientById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @Valid @RequestBody Patient p) {
        return patientService.findPatientById(id).map(existing -> {
            existing.setName(p.getName());
            existing.setAddress(p.getAddress());
            existing.setContact(p.getContact());
            existing.setDob(p.getDob());
            Patient saved = patientService.updatePatient(existing);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}

