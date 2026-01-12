package com.example.demo.Service;
import com.example.demo.model.Employee;
import com.example.demo.Repository.EmployeeRepo;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;



@Service
public class bookserve {

    private final EmployeeRepo bookRepo;

    @Autowired
    public bookserve(EmployeeRepo bookRepo){
        this.bookRepo=bookRepo;
    }

    public Employee addbook(Employee book){
        return bookRepo.save(book);
    }

    public void deleteBook(Long id){
        bookRepo.deleteById(id);
    }

    public List<Employee> getEmAll(){
        return bookRepo.findAll();
    }

    public Employee findIt(Long id){
        return bookRepo.findById(id).get();

    }

    public Employee updateBook(Long id, Employee bookDetail){
        Employee book= bookRepo.findById(id).get();
        book.setTitle(bookDetail.getTitle());
        book.setAuthor(bookDetail.getAuthor());

        return bookRepo.save(book);
    }

}
