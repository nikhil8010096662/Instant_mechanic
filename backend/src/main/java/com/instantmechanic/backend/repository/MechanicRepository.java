package com.instantmechanic.backend.repository;

import com.instantmechanic.backend.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MechanicRepository extends JpaRepository<Mechanic, Long> {

    long countByStatus(String status);
}