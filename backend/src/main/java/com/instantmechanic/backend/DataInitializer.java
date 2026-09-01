package com.instantmechanic.backend;

import com.instantmechanic.backend.entity.Customer;
import com.instantmechanic.backend.entity.Mechanic;
import com.instantmechanic.backend.entity.ServiceEntity;
import com.instantmechanic.backend.repository.BookingRepository;
import com.instantmechanic.backend.repository.CustomerRepository;
import com.instantmechanic.backend.repository.MechanicRepository;
import com.instantmechanic.backend.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.instantmechanic.backend.entity.Booking;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final MechanicRepository mechanicRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public DataInitializer(
            CustomerRepository customerRepository,
            MechanicRepository mechanicRepository,
            ServiceRepository serviceRepository,
            BookingRepository bookingRepository) {

        this.customerRepository = customerRepository;
        this.mechanicRepository = mechanicRepository;
        this.serviceRepository = serviceRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {

        if (customerRepository.count() > 0) {
            System.out.println("Data already exists. Skipping initialization.");
            return;
        }

        // Customers
        for (int i = 1; i <= 50; i++) {
            Customer customer = new Customer(
                    "Customer " + i,
                    "customer" + i + "@gmail.com",
                    "98" + String.format("%08d", i)
            );

            customerRepository.save(customer);
        }

        // Mechanics
        String[] mechanicStatuses = {
                "AVAILABLE",
                "BUSY",
                "OFFLINE"
        };

        for (int i = 1; i <= 20; i++) {
            Mechanic mechanic = new Mechanic(
                    "Mechanic " + i,
                    "97" + String.format("%08d", i),
                    mechanicStatuses[i % 3],
                    i * 5
            );

            mechanicRepository.save(mechanic);
        }

        // Services
        ServiceEntity[] services = {
                new ServiceEntity("Oil Change", "Maintenance", 499.0),
                new ServiceEntity("Brake Service", "Repair", 999.0),
                new ServiceEntity("Battery Replacement", "Electrical", 2499.0),
                new ServiceEntity("AC Service", "AC", 799.0),
                new ServiceEntity("General Service", "Maintenance", 1499.0)
        };

        for (ServiceEntity service : services) {
            serviceRepository.save(service);
        }

        System.out.println("Base data inserted successfully!");

        // Fetch saved data
        List<Customer> customers = customerRepository.findAll();
        List<Mechanic> mechanics = mechanicRepository.findAll();
        List<ServiceEntity> serviceList = serviceRepository.findAll();

        Random random = new Random();

        String[] bookingStatuses = {
                "PENDING",
                "ASSIGNED",
                "MECHANIC_ON_THE_WAY",
                "COMPLETED",
                "CANCELLED"
        };

        String[] vehicleModels = {
                "Maruti Swift",
                "Hyundai i20",
                "Tata Nexon",
                "Honda City",
                "Mahindra XUV700",
                "Toyota Innova",
                "Kia Seltos"
        };

        // Create 500 bookings
        for (int i = 1; i <= 500; i++) {

            Customer customer = customers.get(random.nextInt(customers.size()));
            Mechanic mechanic = mechanics.get(random.nextInt(mechanics.size()));
            ServiceEntity service = serviceList.get(random.nextInt(serviceList.size()));

            String vehicleNumber = "DL" +
                    String.format("%02d", random.nextInt(99) + 1) +
                    "AB" +
                    String.format("%04d", i);

            String vehicleModel =
                    vehicleModels[random.nextInt(vehicleModels.length)];

            String status =
                    bookingStatuses[random.nextInt(bookingStatuses.length)];

            Double amount = service.getPrice();

            LocalDateTime bookingDate = LocalDateTime.now()
                    .minusDays(random.nextInt(30))
                    .minusHours(random.nextInt(24))
                    .minusMinutes(random.nextInt(60));

            Booking booking = new Booking(
                    customer,
                    mechanic,
                    service,
                    vehicleNumber,
                    vehicleModel,
                    status,
                    amount,
                    bookingDate
            );

            bookingRepository.save(booking);
        }

        System.out.println("500 bookings inserted successfully!");
    }
}