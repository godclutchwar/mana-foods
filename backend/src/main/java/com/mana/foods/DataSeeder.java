package com.mana.foods;

import com.mana.foods.model.Category;
import com.mana.foods.model.Product;
import com.mana.foods.model.StockLevel;
import com.mana.foods.model.SiteContent;
import com.mana.foods.repository.CategoryRepository;
import com.mana.foods.repository.ProductRepository;
import com.mana.foods.repository.SiteContentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SiteContentRepository siteContentRepository;

    @Autowired
    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository,
            SiteContentRepository siteContentRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.siteContentRepository = siteContentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (siteContentRepository.count() == 0) {
            siteContentRepository.save(new SiteContent("HERO_TITLE", "Authentic Taste, Handcrafted with Love"));
            siteContentRepository.save(new SiteContent("HERO_SUBTITLE", "MANA Desi-Licious"));
            siteContentRepository.save(new SiteContent("HERO_CTA",
                    "Handcrafted with love, delivered with care. Experience the true soul of Home Made food."));
            siteContentRepository.save(new SiteContent("CONTACT_NUMBER", "7829029995"));
            siteContentRepository.save(new SiteContent("NOTICE_1", "Takes 24-48 hrs to prepare"));
            siteContentRepository.save(new SiteContent("NOTICE_2", "We accept bulk orders on a pre-order basis"));
            siteContentRepository.save(new SiteContent("FOOTER_TEXT", "Taste the Tradition of India in Every Bite."));
        }

        if (categoryRepository.count() == 0) {

            // --- CATEGORIES ---
            Category pootarekuluCat = new Category();
            pootarekuluCat.setName("Pootarekulu");
            pootarekuluCat.setDescription("Traditional paper sweet made with love and authentic ingredients.");

            Category laddusCat = new Category();
            laddusCat.setName("Laddus");
            laddusCat.setDescription("Classic soft and nutritious handcrafted Laddus.");

            Category chikkisCat = new Category();
            chikkisCat.setName("Chikkis");
            chikkisCat.setDescription("Crunchy and authentic nutty treats.");

            Category sunnundaluCat = new Category();
            sunnundaluCat.setName("Sunnundalu");
            sunnundaluCat.setDescription("Nutritious and traditional Urad Dal delicacies.");

            Category traditionalCat = new Category();
            traditionalCat.setName("Traditional");
            traditionalCat.setDescription("Timeless favorites like Ariselu and Kajjikayalu.");

            Category savouries = new Category();
            savouries.setName("Savouries");
            savouries.setDescription("Crunchy, crispy, and spicy evening snacks.");

            Category picklesValue = new Category();
            picklesValue.setName("Pickles");
            picklesValue.setDescription("Spicy, tangy, and authentic house-made Andhra Pickles.");

            Category powdersValue = new Category();
            powdersValue.setName("Powders");
            powdersValue.setDescription("Authentic aromatic Spice Powders (Podulu).");

            Category papadsValue = new Category();
            papadsValue.setName("Papads");
            papadsValue.setDescription("Crispy and delicious meal accompaniments.");

            Category bobbatuluCat = new Category();
            bobbatuluCat.setName("Bobbatulu");
            bobbatuluCat.setDescription("Traditional stuffed sweet flatbreads (Puran Poli).");

            Category gheeCat = new Category();
            gheeCat.setName("Ghee");
            gheeCat.setDescription("Pure and aromatic handmade Buffalo Ghee.");

            Category instantCat = new Category();
            instantCat.setName("Instant Mixes");
            instantCat.setDescription("Quick and easy traditional meal mixes.");

            Category pasteCat = new Category();
            pasteCat.setName("Paste");
            pasteCat.setDescription("Authentic rich cooking pastes for quick meals.");

            Category nonVegCat = new Category();
            nonVegCat.setName("Non-Veg Pickles");
            nonVegCat.setDescription("Spicy and intense non-veg cravings (Available on Pre-order).");

            pootarekuluCat.setDisplayOrder(1);
            laddusCat.setDisplayOrder(2);
            chikkisCat.setDisplayOrder(3);
            sunnundaluCat.setDisplayOrder(4);
            traditionalCat.setDisplayOrder(5);
            savouries.setDisplayOrder(6);
            picklesValue.setDisplayOrder(7);
            powdersValue.setDisplayOrder(8);
            papadsValue.setDisplayOrder(9);
            bobbatuluCat.setDisplayOrder(10);
            gheeCat.setDisplayOrder(11);
            instantCat.setDisplayOrder(12);
            pasteCat.setDisplayOrder(13);
            nonVegCat.setDisplayOrder(14);

            categoryRepository.save(pootarekuluCat);
            categoryRepository.save(laddusCat);
            categoryRepository.save(savouries);
            categoryRepository.save(sunnundaluCat);
            categoryRepository.save(traditionalCat);
            categoryRepository.save(chikkisCat);
            categoryRepository.save(picklesValue);
            categoryRepository.save(powdersValue);
            categoryRepository.save(papadsValue);
            categoryRepository.save(bobbatuluCat);
            categoryRepository.save(gheeCat);
            categoryRepository.save(instantCat);
            categoryRepository.save(pasteCat);
            categoryRepository.save(nonVegCat);

            // --- INDIVIDUAL PRODUCTS PER VARIETY ---

            // Pootarekulu Varieties
            String[] pootaVarieties = { "Bellam", "Sugar", "Dryfruit", "Horlicks", "Oreo", "Chocolate", "Pineapple",
                    "Strawberry", "Orange", "Vanilla", "Butterscotch" };
            for (String v : pootaVarieties) {
                Product p = createProduct(v, null, pootarekuluCat, "/images/pootharekulu.png");
                addVariant(p, "10 Pcs", v.equals("Bellam") ? 200.0 : v.equals("Sugar") ? 180.0 : 250.0);
                productRepository.save(p);
            }

            // Laddu Varieties
            productRepository.save(setupProduct("Sesame", laddusCat, "250 Gms", 190.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Dryfruit", laddusCat, "250 Gms", 300.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Ragi", laddusCat, "250 Gms", 200.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Ravva", laddusCat, "250 Gms", 160.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Coconut", laddusCat, "250 Gms", 170.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Groundnut", laddusCat, "250 Gms", 170.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Gond", laddusCat, "250 Gms", 200.0, "/images/laddoos.png"));
            productRepository.save(setupProduct("Boondi", laddusCat, "250 Gms", 150.0, "/images/laddoos.png"));

            // Chikkis
            productRepository.save(setupProduct("Sesame", chikkisCat, "250 Gms", 180.0, "/images/chikkis.png"));
            productRepository.save(setupProduct("Groundnut", chikkisCat, "250 Gms", 150.0, "/images/chikkis.png"));

            // Sunnundalu
            productRepository.save(setupProduct("Bellam", sunnundaluCat, "250 Gms", 190.0, "/images/sunnundalu.png"));
            productRepository.save(setupProduct("Sugar", sunnundaluCat, "250 Gms", 180.0, "/images/sunnundalu.png"));

            // Traditional
            productRepository
                    .save(setupProduct("Ariselu", traditionalCat, "250 Gms", 200.0, "/images/traditional.png"));
            productRepository
                    .save(setupProduct("Kajjikayalu", traditionalCat, "250 Gms", 160.0, "/images/traditional.png"));

            // Savouries
            productRepository.save(setupProduct("Jantikalu", savouries, "250 Gms", 150.0, "/images/savouries.png"));
            productRepository.save(setupProduct("Chekka Carelu", savouries, "250 Gms", 180.0, "/images/savouries.png"));
            productRepository.save(setupProduct("Karam Boondi", savouries, "250 Gms", 140.0, "/images/savouries.png"));
            productRepository.save(setupProduct("Ragi Muruku", savouries, "250 Gms", 140.0, "/images/savouries.png"));

            // Pickles
            productRepository.save(setupProduct("Tomato", picklesValue, "250 Gms", 130.0, "/images/pickles.png"));
            productRepository.save(setupProduct("Mango Avakai", picklesValue, "250 Gms", 130.0, "/images/pickles.png"));
            productRepository.save(setupProduct("Amla", picklesValue, "250 Gms", 200.0, "/images/pickles.png"));

            // Powders
            productRepository.save(setupProduct("Rasam", powdersValue, "100 Gms", 60.0, "/images/powders.png"));
            productRepository.save(setupProduct("Nalla Karam", powdersValue, "100 Gms", 60.0, "/images/powders.png"));
            productRepository.save(setupProduct("Curry Leaves", powdersValue, "100 Gms", 60.0, "/images/powders.png"));
            productRepository.save(setupProduct("Coconut Karam", powdersValue, "100 Gms", 60.0, "/images/powders.png"));
            productRepository.save(setupProduct("Chutney", powdersValue, "70 Gms", 70.0, "/images/powders.png"));

            // Papads
            productRepository.save(setupProduct("Raagi", papadsValue, "100 Gms", 80.0, "/images/papads.png"));
            productRepository.save(setupProduct("Saggubiyyam", papadsValue, "100 Gms", 80.0, "/images/papads.png"));
            productRepository.save(setupProduct("Rice Flour", papadsValue, "100 Gms", 60.0, "/images/papads.png"));
            productRepository.save(setupProduct("Curd Chillies", papadsValue, "100 Gms", 70.0, "/images/papads.png"));

            // Bobbatulu
            productRepository.save(setupProduct("Kova Bobbatulu", bobbatuluCat, "1 PC", 40.0, "/images/bobbatulu.png"));
            productRepository.save(setupProduct("Dal Bobbatulu", bobbatuluCat, "1 PC", 30.0, "/images/bobbatulu.png"));

            // Ghee
            productRepository.save(setupProduct("Buffalo Ghee", gheeCat, "250 Gms", 250.0, "/images/traditional.png"));

            // Instant Mixes
            productRepository
                    .save(setupProduct("Instant Dosa Mix", instantCat, "100 Gms", 60.0, "/images/instantmixes.png"));
            productRepository
                    .save(setupProduct("Instant Upma Mix", instantCat, "100 Gms", 40.0, "/images/instantmixes.png"));

            // Paste
            productRepository.save(setupProduct("Tamarind Paste", pasteCat, "250 Gms", 125.0, "/images/paste.png"));

            // Non-Veg Pickles
            productRepository
                    .save(setupProduct("Prawns Pickle", nonVegCat, "250 Gms", 500.0, "/images/nonvegpickles.png"));
            productRepository
                    .save(setupProduct("Chicken Pickle", nonVegCat, "250 Gms", 300.0, "/images/nonvegpickles.png"));
            productRepository
                    .save(setupProduct("Mutton Pickle", nonVegCat, "250 Gms", 550.0, "/images/nonvegpickles.png"));
        }
    }

    private Product setupProduct(String name, Category cat, String weight, Double price, String image) {
        Product p = createProduct(name, null, cat, image);
        addVariant(p, weight, price);
        return p;
    }

    private Product createProduct(String name, String desc, Category cat, String image) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setCategory(cat);
        p.setImageUrl(image);
        p.setStockLevels(new ArrayList<>());
        return p;
    }

    private void addVariant(Product p, String weight, Double price) {
        StockLevel s = new StockLevel();
        s.setWeight(weight);
        s.setPrice(price);
        s.setProduct(p);
        p.getStockLevels().add(s);
    }
}
