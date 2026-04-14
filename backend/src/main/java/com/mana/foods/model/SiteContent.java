package com.mana.foods.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class SiteContent {
    @Id
    private String contentKey;
    
    @Column(columnDefinition="TEXT")
    private String contentValue;

    public SiteContent() {}

    public SiteContent(String contentKey, String contentValue) {
        this.contentKey = contentKey;
        this.contentValue = contentValue;
    }

    public String getContentKey() {
        return contentKey;
    }

    public void setContentKey(String contentKey) {
        this.contentKey = contentKey;
    }

    public String getContentValue() {
        return contentValue;
    }

    public void setContentValue(String contentValue) {
        this.contentValue = contentValue;
    }
}
