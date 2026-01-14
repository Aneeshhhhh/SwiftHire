package com.example.demo.Repository;

import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository

public interface EmployeeRepo extends JpaRepository<Employee, Long>{
    List<Employee> findByProfession(String profession);
    List<Employee> findByAgeGreaterThan(int age);
    List<Employee> findBySalaryBetween(double minSalary, double maxSalary);
    List<Employee> findByNameContaining(String substring);
    List<Employee> findByAgeBetween(int minAge, int maxAge);
}
