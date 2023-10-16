package com.oop.appa.dto;

public class PortfolioCreationDTO {

    private String name;
    private String description;
    private double totalCapital;
    private UserReference user;  // Nested UserReference

    // Default constructor
    public PortfolioCreationDTO() {}

    // Parameterized constructor
    public PortfolioCreationDTO(String name, String description, double totalCapital, UserReference user) {
        this.name = name;
        this.description = description;
        this.totalCapital = totalCapital;
        this.user = user;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getTotalCapital() {
        return totalCapital;
    }

    public void setTotalCapital(double totalCapital) {
        this.totalCapital = totalCapital;
    }

    public UserReference getUser() {
        return user;
    }

    public void setUser(UserReference user) {
        this.user = user;
    }

    // Nested UserReference class
    public static class UserReference {
        private int id;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }
    }
}
