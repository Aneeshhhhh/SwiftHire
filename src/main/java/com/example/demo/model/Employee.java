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
    private int age;
    private double salary;

    public Employee(){}

    public Employee(long Id, String name, String profession, int age, double salary){
        this.Id = Id;
        this.name=name;
        this.profession=profession;
        this.age=age;
        this.salary=salary;
    }

    public long getId(){
        return Id;
    }
    public void setId(long Id){
        this.Id=Id;
    }
    public void setAge(int age){
        this.age=age;
    }
    public int getAge(){
        return age;
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
    public double getSalary(){
        return salary;
    }
    public void setSalary(double salary){
        this.salary=salary;
    }













}
