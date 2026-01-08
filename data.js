const inventory = [
    // --- WINES ---
    {
        id: "wine_001",
        category: "wine",
        name: "Mercedes Vodka",
        price: 120.00,
        image: "/images/wine17.jpg",
        summary: "A bold red with notes of dark cherry.",
        history: "Inspired by the strength of the Benin warriors, this red blend is aged in oak barrels for 12 years, symbolizing endurance.",
        founder: "Dr. E. Osagie",
        stock: 50,
        reviews: [
            { user: "Tunde A.", text: "The finish is incredible. Truly royal." },
            { user: "Sarah J.", text: "Worth every penny." }
        ]
    },
    {
        id: "wine_002",
        category: "wine",
        name: "Paso D'oro",
        price: 250.00,
        image: "/images/wine4.jpg",
        summary: "Aged white wine, crisp and royal.",
        history: "Harvested from the high-altitude regions, this wine mimics the purity of gold used in the ancient guilds.",
        founder: "Lady I. Obaseki",
        stock: 35,
        reviews: [
            { user: "Michael B.", text: "Crisp, clean, and luxurious." }
        ]
    },
    {
        id: "wine_003",
        category: "wine",
        name: "Manchester Gin",
        price: 180.00,
        image: "/images/wine16.jpg",
        summary: "Earthy tones representing the red clay of Benin.",
        history: "A tribute to the bronze casters, this wine is robust and full-bodied.",
        founder: "Chief Igbinedion (Tribute)",
        stock: 40,
        reviews: []
    },
    {
        id: "wine_004", // CHANGED from wine_001 (Duplicate Fix)
        category: "wine",
        name: "Opaline Pinot Noir Brut Rosé",
        price: 35.00,
        image: "/images/wine1.jpg",
        summary: "An elegant French sparkling wine presented in a faceted bottle, featuring delicate bubbles and notes of red berries.",
        history: "Sourced from the south of France, this brut rosé highlights the versatility and elegance of the Pinot Noir grape.",
        founder: "Opaline Wines",
        stock: 100,
        reviews: []
    },
    {
        id: "wine_007",
        category: "wine",
        name: "Emmolo Sauvignon Blanc 2023",
        price: 30.00,
        image: "/images/wine7.jpg",
        summary: "A crisp and bright white wine with flavors of melon and citrus, sourced from Napa Valley.",
        history: "Created by the Wagner family, utilizing grapes from family-owned vineyards to produce a wine that is distinctively fresh.",
        founder: "Jenny Wagner",
        stock: 60,
        reviews: []
    },
    {
        id: "wine_008",
        category: "wine",
        name: "Perfekt Small Batch",
        price: 40.00,
        image: "/images/wine8.jpg",
        summary: "A modern, minimalist wine focused on purity, distinct varietal character, and clean finishing notes.",
        history: "Produced in limited quantities to ensure the highest quality control and expression of the vineyard's terroir.",
        founder: "Perfekt Winery",
        stock: 25,
        reviews: []
    },
    {
        id: "wine_011",
        category: "wine",
        name: "Bumbu XO Handcrafted Rum",
        price: 65.00,
        image: "/images/wine11.jpg",
        summary: "A smooth, rich rum aged up to 18 years in bourbon barrels and finished in white oak sherry casks.",
        history: "Distilled in Panama, Bumbu XO pays homage to the 16th-century sailors who blended Caribbean fruits and spices into their rum.",
        founder: "The Bumbu Rum Company",
        stock: 45,
        reviews: []
    },
    {
        id: "wine_012",
        category: "wine",
        name: "Dictador 12 Year Rum",
        price: 55.00,
        image: "/images/wine12.jpg",
        summary: "A Colombian rum made via fermentation of virgin sugar cane honey and aged using the solera system.",
        history: "Established in 1913 in Cartagena de Indias, Dictador combines Colombian traditions with European design and Japanese bottle aesthetics.",
        founder: "Severo Arango y Ferro",
        stock: 30,
        reviews: []
    },
    {
        id: "wine_013",
        category: "wine",
        name: "Grey Goose Vodka",
        price: 50.00,
        image: "/images/wine13.jpg",
        summary: "A premium French vodka made from the finest winter wheat and Gensac spring water.",
        history: "Distilled in France using a field-to-bottle process designed to express the true character of the ingredients.",
        founder: "Sidney Frank & François Thibault",
        stock: 120,
        reviews: []
    },
    {
        id: "wine_014",
        category: "wine",
        name: "Tekirdağ Rakısı Trakya Serisi",
        price: 45.00,
        image: "/images/wine14.jpg",
        summary: "A premium Turkish Raki distilled from fresh grapes of the Thrace region.",
        history: "Produced using the traditional copper alembic distillation method, utilizing high-quality aniseed and the finest grapes from Western Turkey.",
        founder: "Mey İçki",
        stock: 20,
        reviews: []
    },
    {
        id: "wine_015",
        category: "wine",
        name: "Bacardi Dragonberry",
        price: 25.00,
        image: "/images/wine15.jpg",
        summary: "A bold fusion of strawberry and crisp dragon fruit flavor infused into white rum.",
        history: "Created by the masters of rum blending, this spirit combines the sweet, juicy taste of strawberries with the exotic zest of dragon fruit.",
        founder: "Facundo Bacardí Massó",
        stock: 80,
        reviews: []
    },
    {
        id: "wine_018",
        category: "wine",
        name: "Hennessy Paradis",
        price: 1500.00,
        image: "/images/wine18.jpg",
        summary: "A sensual and voluptuous cognac, created from a blend of over 100 rare eaux-de-vie aged for decades.",
        history: "Created in 1979 by Maurice Fillioux, this cognac is defined by its graceful, silky character and aromatic richness.",
        founder: "Richard Hennessy",
        stock: 5, // High value, low stock
        reviews: []
    },
    {
        id: "wine_019",
        category: "wine",
        name: "The Dalmore 40 Year Old",
        price: 8500.00,
        image: "/images/wine19.jpg",
        summary: "An ultra-rare Highland Single Malt, matured in American white oak and Gonzalez Byass Matusalem oloroso sherry butts.",
        history: "A pinnacle of whisky making, this bottle represents four decades of careful maturation in the Scottish Highlands.",
        founder: "Alexander Matheson",
        stock: 2, // Very Rare
        reviews: []
    },

    // --- MOTIVATION (PEOPLE) ---
    {
        id: "mov_001",
        category: "motivation",
        name: "Barack Obama",
        role: "44th President of the USA",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg",
        summary: "The Audacity of Hope.",
        quote: "The future rewards those who press on. I don't have time to feel sorry for myself. I don't have time to complain. I'm going to press on.",
        history: "From a community organizer in Chicago to the leader of the free world, his journey represents the pinnacle of intellectual resilience and grace under fire.",
        reviews: []
    },
    {
        id: "mov_002",
        category: "motivation",
        name: "Dr. Osahon Enabulele",
        role: "President, World Medical Association (2022-2023)",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBOrFVTYGM4CE4US3tTOIozgIRldMoS7DPzQ&s",
        summary: "A Great Benin Alumnus on the World Stage.",
        quote: "We must build systems that are resilient, just as the African spirit has proven to be time and time again.",
        history: "A proud graduate of the University of Benin (UNIBEN). He rose through the ranks of the Nigerian Medical Association to become the first Nigerian to head the World Medical Association.",
        reviews: []
    },

    // --- ACCESSORIES (BEADS) ---
    {
        id: "acc_001",
        category: "accessories", // Changed from "clothing" to "accessories" for better filtering
        name: "The Obsidian Strand",
        price: 350.00,
        image: "/images/beads12.jpg",
        summary: "Triple-layer black cylindrical beads. Dark, sleek, and mysterious.",
        history: "Black beads traditionally signify wisdom and age. We polished these to a mirror finish to reflect the modern leader's clarity of thought.",
        founder: "Tenacity Beads",
        stock: 15,
        reviews: []
    },
    {
        id: "acc_002",
        category: "accessories",
        name: "The Royal Peach Coral",
        price: 600.00,
        image: "/images/beads3.jpg",
        summary: "Authentic peach coral set with a centerpiece gemstone pendant.",
        history: "Sourced from the deep seas, peach coral is known as the 'stone of diplomacy.' A perfect accessory for high-stakes negotiations.",
        founder: "The Royal Guild",
        stock: 10,
        reviews: []
    },
    {
        id: "acc_003",
        category: "accessories",
        name: "The Gilded Sunset",
        price: 550.00,
        image: "/images/beads4.jpg",
        summary: "Vibrant orange coral interlaced with intricate gold filigree spacers.",
        history: "Orange represents joy and creativity; gold represents wealth. Together, they form the 'Prosperity Set,' worn during celebrations of success.",
        founder: "The Royal Guild",
        stock: 12,
        reviews: []
    },
    {
        id: "acc_004",
        category: "accessories",
        name: "The Amber Legacy",
        price: 300.00,
        image: "/images/beads1.jpg",
        summary: "Long strands of rectangular amber and brown agate beads.",
        history: "Earthy tones that ground the wearer. These beads are designed for the elder statesman who remains connected to his roots while reaching for the sky.",
        founder: "Tenacity Beads",
        stock: 18,
        reviews: []
    },
    {
        id: "acc_005",
        category: "accessories",
        name: "The Bronze Armor",
        price: 400.00,
        image: "/images/beads11.jpg",
        summary: "Metallic bronze cylindrical beads with a heavy, industrial luxury weight.",
        history: "Unlike traditional coral, these metallic beads are forged. They represent the 'Iron Will' of the wearer—unbreakable and shining under pressure.",
        founder: "Tenacity Beads",
        stock: 20,
        reviews: []
    },
    {
        id: "acc_006",
        category: "accessories",
        name: "The Dual Heritage Bangle",
        price: 250.00,
        image: "/images/beads10.jpg",
        summary: "A wrist set featuring red coral and white ivory-toned beads.",
        history: "Red for vitality, White for peace. This combination balances the fire of ambition with the calmness of strategy.",
        founder: "The Royal Guild",
        stock: 30,
        reviews: []
    },

    // --- CLOTHING (SUITS/SENATORS) ---
    {
        id: "cloth_020",
        category: "clothing",
        name: "The Verdant Houndstooth",
        price: 850.00,
        image: "/images/suits4.jpg",
        summary: "A double-breasted masterpiece in forest green check, paired with pristine ivory trousers.",
        history: "Inspired by the British countryside but tailored for the tenacious modern leader. The houndstooth pattern signifies a complex mind that finds order in chaos.",
        founder: "Tenacity Bespoke",
        stock: 10,
        reviews: []
    },
    {
        id: "cloth_021",
        category: "clothing",
        name: "The Executive Pinstripe",
        price: 950.00,
        image: "/images/suits2.jpg",
        summary: "A three-piece charcoal power suit with razor-sharp pinstripes.",
        history: "The pinstripe was originally the uniform of the bank; we reclaimed it as the armor of the self-made tycoon. Precision-cut to impose authority without saying a word.",
        founder: "Tenacity Bespoke",
        stock: 8,
        reviews: []
    },
    {
        id: "cloth_022",
        category: "clothing",
        name: "The Artiste Senator",
        price: 450.00,
        image: "/images/senator3.jpg",
        summary: "Navy blue traditional wear featuring a hand-painted avant-garde chest patch.",
        history: "A fusion of traditional silhouette and modern art. The patch represents the 'Canvas of Life'—reminding the wearer that they are the artist of their own destiny.",
        founder: "Tenacity Culture",
        stock: 15,
        reviews: []
    },
    {
        id: "cloth_023",
        category: "clothing",
        name: "The Gilded Noir",
        price: 1200.00,
        image: "/images/suits7.jpg",
        summary: "Deepest black evening wear accented by a striking gold surrealist lapel brooch.",
        history: "Designed for the gala, this piece is about the 'Golden Silence.' The bespoke gold face brooch signifies that true power watches and listens more than it speaks.",
        founder: "Tenacity Gold",
        stock: 5,
        reviews: []
    },
    {
        id: "cloth_024",
        category: "clothing",
        name: "The Diplomat Navy",
        price: 780.00,
        image: "/images/suits1.jpg",
        summary: "Single-breasted classic navy pinstripe. The definition of reliability.",
        history: "Woven from 120s Italian wool, this suit is the backbone of the tenacious man's wardrobe. It is designed to look as sharp at 8 PM as it did at 8 AM.",
        founder: "Tenacity Bespoke",
        stock: 20,
        reviews: []
    },
    {
        id: "cloth_025",
        category: "clothing",
        name: "The Sovereign Drape",
        price: 500.00,
        image: "/images/senator2.jpg",
        summary: "A minimalist, structural navy kaftan with a unique cape-like silhouette.",
        history: "Drawing inspiration from royal robes, this piece removes all unnecessary noise. It focuses purely on structure and drape, allowing the wearer's presence to fill the room.",
        founder: "Tenacity Culture",
        stock: 12,
        reviews: []
    },
    {
        id: "cloth_026",
        category: "clothing",
        name: "The Crimson Heritage",
        price: 480.00,
        image: "/images/senator4.jpg",
        summary: "Rich burgundy Senator wear with geometric embroidery and matching cap.",
        history: "The deep red signifies the blood and sweat of the hustle. The geometric embroidery is a nod to ancient architectural stability. Wear this to celebrate a victory.",
        founder: "Tenacity Culture",
        stock: 15,
        reviews: []
    },
    {
        id: "cloth_027",
        category: "clothing",
        name: "The Rose Quartz Statement",
        price: 820.00,
        image: "/images/suits6.jpg",
        summary: "A daring double-breasted suit in soft dusty pink. For the man who fears nothing.",
        history: "It takes true tenacity to wear pink with power. This suit challenges traditional masculinity, proving that strength can exist in softness and unparalleled style.",
        founder: "Tenacity Bespoke",
        stock: 6,
        reviews: []
    },
    {
        id: "cloth_028",
        category: "clothing",
        name: "The Ivory & Mocha Duo",
        price: 880.00,
        image: "/images/suits3.jpg",
        summary: "Cream double-breasted jacket paired with rich chocolate trousers.",
        history: "A masterclass in contrast. Reminiscent of Italian summers, this combination is for the leisure class—the man who has worked hard enough to finally enjoy the sun.",
        founder: "Tenacity Bespoke",
        stock: 8,
        reviews: []
    }
];