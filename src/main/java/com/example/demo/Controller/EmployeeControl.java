package com.example.demo.Controller;

import com.example.demo.Repository.EmployeeRepo;
import com.example.demo.model.Employee;
import com.example.demo.Service.EmployeeServe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeControl {
    private final EmployeeServe employeeServe;

    @Autowired
    public EmployeeControl(EmployeeServe employeeServe){
        this.employeeServe = employeeServe;
    }

    @PostMapping
    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee){
        Employee savedEmployee = employeeServe.addprofile(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> specificEmployee(@PathVariable Long id){
        Employee employee = employeeServe.findIt(id);
        return ResponseEntity.ok(employee);

    }

    @GetMapping
    public ResponseEntity<List<Employee>> getEm(){
        List<Employee> employees = employeeServe.getEmAll();
        return ResponseEntity.ok(employees);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id){
        employeeServe.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetail){
        Employee updated = employeeServe.updateProfile(id, employeeDetail);
        return ResponseEntity.ok(updated);
    }

}




