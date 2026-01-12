package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Employee{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long Id;

    private String name;
    private String profession;

    public Employee(){}

    public Employee(long Id, String name, String profession){
        this.Id = Id;
        this.name=name;
        this.profession=profession;
    }

    public long getId(){
        return Id;
    }
    public void setId(long Id){
        this.Id=Id;
    }

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getProfession(){
        return profession;
    }
    public void setProfession(String profession){
        this.profession=profession;
    }













}
