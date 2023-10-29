package com.oop.appa.dto;

import java.util.HashMap;
import java.util.Map;

public class RebalancingTargetPercentagesDTO {
    private Map<String, Double> targetPercentages;

    public RebalancingTargetPercentagesDTO() {
        this.targetPercentages = new HashMap<>();
    }

    public Map<String, Double> getTargetPercentages() {
        return targetPercentages;
    }

    public void setTargetPercentages(Map<String, Double> targetPercentages) {
        this.targetPercentages = targetPercentages;
    }

    // Add methods to add, remove, or update percentages for specific groups
    public void addPercentage(String group, Double percentage) {
        targetPercentages.put(group, percentage);
    }

    public void removePercentage(String group) {
        targetPercentages.remove(group);
    }

    public Double getPercentage(String group) {
        return targetPercentages.get(group);
    }

    // You can also add other helper methods as required
}
