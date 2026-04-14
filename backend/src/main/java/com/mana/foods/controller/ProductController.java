package com.mana.foods.controller;

import com.mana.foods.model.Category;
import com.mana.foods.model.Product;
import com.mana.foods.model.StockLevel;
import com.mana.foods.repository.CategoryRepository;
import com.mana.foods.repository.ProductRepository;
import com.mana.foods.repository.StockLevelRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development convenience
public class ProductController {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final StockLevelRepository stockLevelRepository;

    @Autowired
    public ProductController(CategoryRepository categoryRepository, ProductRepository productRepository, StockLevelRepository stockLevelRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.stockLevelRepository = stockLevelRepository;
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll().stream()
            .sorted((c1, c2) -> Integer.compare(c1.getDisplayOrder(), c2.getDisplayOrder()))
            .toList();
    }
    
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/categories/reorder")
    public ResponseEntity<Void> reorderCategories(@RequestBody List<Category> categories) {
        for (Category c : categories) {
            categoryRepository.findById(c.getId()).ifPresent(existing -> {
                existing.setDisplayOrder(c.getDisplayOrder());
                categoryRepository.save(existing);
            });
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(categoryDetails.getName());
            category.setImageUrl(categoryDetails.getImageUrl());
            category.setDescription(categoryDetails.getDescription());
            category.setDisplayOrder(categoryDetails.getDisplayOrder());
            return ResponseEntity.ok(categoryRepository.save(category));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            return categoryRepository.findById(product.getCategory().getId()).map(category -> {
                product.setCategory(category);
                if (product.getStockLevels() != null) {
                    for (StockLevel stock : product.getStockLevels()) {
                        stock.setProduct(product);
                    }
                }
                Product saved = productRepository.save(product);
                return ResponseEntity.ok(saved);
            }).orElse(ResponseEntity.badRequest().body(null));
        }
        return ResponseEntity.badRequest().body("Category ID is required");
    }
    
    @PostMapping("/products/{id}/stock")
    public ResponseEntity<StockLevel> addStockVariant(@PathVariable Long id, @RequestBody StockLevel stock) {
        return productRepository.findById(id).map(product -> {
            stock.setProduct(product);
            return ResponseEntity.ok(stockLevelRepository.save(stock));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/stock/{id}/price")
    public ResponseEntity<StockLevel> updatePrice(@PathVariable Long id, @RequestParam Double price) {
        return stockLevelRepository.findById(id).map(stock -> {
            stock.setPrice(price);
            return ResponseEntity.ok(stockLevelRepository.save(stock));
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/stock/{id}/toggle")
    public ResponseEntity<StockLevel> toggleStock(@PathVariable Long id) {
        return stockLevelRepository.findById(id).map(stock -> {
            stock.setInStock(!stock.getInStock());
            return ResponseEntity.ok(stockLevelRepository.save(stock));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            if (productDetails.getCategory() != null) {
                product.setCategory(productDetails.getCategory());
            }
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/stock/{id}")
    public ResponseEntity<StockLevel> updateStock(@PathVariable Long id, @RequestBody StockLevel stockDetails) {
        return stockLevelRepository.findById(id).map(stock -> {
            stock.setWeight(stockDetails.getWeight());
            stock.setPrice(stockDetails.getPrice());
            stock.setInStock(stockDetails.getInStock());
            return ResponseEntity.ok(stockLevelRepository.save(stock));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/stock/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        if (stockLevelRepository.existsById(id)) {
            stockLevelRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            // Remove all products in this category first to avoid FK constraint
            List<Product> catProducts = productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
                .toList();
            productRepository.deleteAll(catProducts);
            categoryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            File dir = new File("uploads");
            if (!dir.exists()) {
                dir.mkdirs();
            }
            
            String originalFileName = file.getOriginalFilename();
            if (originalFileName == null) originalFileName = "image.png";
            
            String filename = System.currentTimeMillis() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            File dest = new File(dir.getAbsolutePath() + File.separator + filename);
            
            file.transferTo(dest);
            
            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", "/uploads/" + filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(500).body(err);
        }
    }
}
