package com.mana.foods.controller;

import com.mana.foods.model.SiteContent;
import com.mana.foods.repository.SiteContentRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(origins = "*")
public class SiteContentController {

    @Autowired
    private SiteContentRepository siteContentRepository;

    @GetMapping
    public List<SiteContent> getAllContent() {
        return siteContentRepository.findAll();
    }
    
    @PostMapping
    public ResponseEntity<String> saveContent(@RequestBody List<SiteContent> contents) {
        siteContentRepository.saveAll(contents);
        return ResponseEntity.ok("Published");
    }
}
