package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private String title;
    private String department;
    private double compensation;
    
    public Position() {}

    public Position(String title, String department, double compensation){
        this.title = title;
        this.department =department;
        this.compensation=compensation;
    
    }
    
    public long getId(){
        return id;
    }
    public void setId(long id){
        this.id = id;
    }
    
    public String getTitle(){
        return title;
    }
    public void setTitle(String title){
    this.title = title;
    }
    public String getDepartment(){
        return department;
    }
    public void setDepartment(String department){
        this.department = department;
    }
    public double getCompensation(){
        return compensation;

    }
    public void setCompensation(double compensation){
        this.compensation = compensation;
    }

}
