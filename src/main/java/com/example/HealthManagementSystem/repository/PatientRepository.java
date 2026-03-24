package com.example.HealthManagementSystem.repository;


import com.example.HealthManagementSystem.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Add custom methods later (findByContact, etc.)
}
