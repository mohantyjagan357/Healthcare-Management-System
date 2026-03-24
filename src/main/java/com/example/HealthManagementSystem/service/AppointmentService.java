package com.example.HealthManagementSystem.service;

import com.example.HealthManagementSystem.model.Appointment;
import com.example.HealthManagementSystem.model.Patient;
import com.example.HealthManagementSystem.repository.AppointmentRepository;
import com.example.HealthManagementSystem.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    private final AppointmentRepository repo;
    private final PatientRepository patientRepo;

    public AppointmentService(AppointmentRepository repo, PatientRepository patientRepo) {
        this.repo = repo;
        this.patientRepo = patientRepo;
    }

    public List<Appointment> getAppointmentList() { return repo.findAll(); }

    public Optional<Appointment> getAppointmentByID(Long id) { return repo.findById(id); }

    // Book appointment with overlap check (transactional)
    @Transactional
    public Appointment bookAppointment(Appointment appt) {
        // ensure patient exists
        Long pid = appt.getPatient().getId();
        Patient patient = patientRepo.findById(pid)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + pid));
        appt.setPatient(patient);

        // Check overlapping appointments for provider
        List<Appointment> overlapping = repo.findOverlapping(
                appt.getProvider(), appt.getStartTime(), appt.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Time slot is not available for provider.");
        }

        return repo.save(appt);
    }

    public Appointment cancelAppointment(Long id) {
        Appointment a = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        a.setStatus("CANCELLED");
        return repo.save(a);
    }
}
