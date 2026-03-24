package com.example.HealthManagementSystem.service;

import com.example.HealthManagementSystem.model.Patient;
import com.example.HealthManagementSystem.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    private final PatientRepository repo;

    public PatientService(PatientRepository repo) { this.repo = repo; }

    public Patient addPatient(Patient p) { return repo.save(p); }
    public List<Patient> getPatients() { return repo.findAll(); }
    public Optional<Patient> findPatientById(Long id) { return repo.findById(id); }
    public Patient updatePatient(Patient p) { return repo.save(p); }
    public void deletePatient(Long id) { repo.deleteById(id); }
}

