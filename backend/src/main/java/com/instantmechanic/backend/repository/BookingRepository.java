package com.instantmechanic.backend.repository;

import com.instantmechanic.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    long countByStatus(String status);

    long countByBookingDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("SELECT COALESCE(SUM(b.amount), 0) FROM Booking b")
    Double getTotalRevenue();

    @Query("""
            SELECT COALESCE(SUM(b.amount), 0)
            FROM Booking b
            WHERE b.status = 'COMPLETED'
            """)
    Double getCompletedRevenue();
}