package com.instantmechanic.backend.service;

import com.instantmechanic.backend.repository.BookingRepository;
import com.instantmechanic.backend.repository.CustomerRepository;
import com.instantmechanic.backend.repository.MechanicRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final MechanicRepository mechanicRepository;

    public DashboardService(
            BookingRepository bookingRepository,
            CustomerRepository customerRepository,
            MechanicRepository mechanicRepository) {

        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.mechanicRepository = mechanicRepository;
    }

    public Map<String, Object> getDashboardStats() {

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("totalBookings", bookingRepository.count());

        stats.put(
                "todayBookings",
                bookingRepository.countByBookingDateBetween(
                        startOfDay,
                        endOfDay
                )
        );

        stats.put(
                "completedBookings",
                bookingRepository.countByStatus("COMPLETED")
        );

        stats.put(
                "pendingBookings",
                bookingRepository.countByStatus("PENDING")
        );

        stats.put(
                "cancelledBookings",
                bookingRepository.countByStatus("CANCELLED")
        );

        stats.put(
                "totalRevenue",
                bookingRepository.getTotalRevenue()
        );

        stats.put(
                "completedRevenue",
                bookingRepository.getCompletedRevenue()
        );

        stats.put(
                "totalCustomers",
                customerRepository.count()
        );

        stats.put(
                "activeMechanics",
                mechanicRepository.countByStatus("AVAILABLE")
        );

        return stats;
    }
}