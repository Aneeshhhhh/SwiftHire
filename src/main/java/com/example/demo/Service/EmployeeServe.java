package com.example.demo.Service;
import com.example.demo.model.Employee;
import com.example.demo.Repository.EmployeeRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;



@Service
public class EmployeeServe {

    private final EmployeeRepo employeeRepo;

    @Autowired
    public EmployeeServe(EmployeeRepo employeeRepo){
        this.employeeRepo=employeeRepo;
    }

    public Employee addprofile(Employee profile){
        return employeeRepo.save(profile);
    }

    public void deleteProfile(Long id){
        employeeRepo.deleteById(id);
    }

    public List<Employee> getEmAll(){
        return employeeRepo.findAll();
    }

    public Employee findIt(Long id){
        return employeeRepo.findById(id).get();
    }

    public Employee updateProfile(Long id, Employee profileDetail){
        Employee employee= employeeRepo.findById(id).get();
        employee.setName(profileDetail.getName());
        employee.setProfession(profileDetail.getProfession());
        employee.setAge(profileDetail.getAge());
        employee.setSalary(profileDetail.getSalary());

        return employeeRepo.save(employee);
    }

}
