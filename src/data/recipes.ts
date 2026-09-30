import type { DetailedRecipe } from '../types/index.ts';

export const ALL_RECIPES: DetailedRecipe[] = [
  // ==================== BREAKFASTS ====================
  {
    id: 'rec_b1',
    title: 'Hass Avocado & Sourdough with Poached Omega-3 Eggs',
    category: 'breakfast',
    dietStyle: 'Mediterranean',
    difficulty: 'Easy',
    estimatedCalories: 430,
    prepTimeMinutes: 12,
    servings: 1,
    portion: '2 slices toast with pasture eggs (320g)',
    proteinG: 22,
    carbsG: 34,
    fatG: 21,
    cuisine: 'Mediterranean & Coastal',
    tags: ['Good Fats', 'High Protein', 'Heart Healthy', 'Lutein Rich'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    items: [
      '2 slices rustic stone-ground whole wheat sourdough bread',
      '1 ripe Hass avocado mashed with lime & pink sea salt',
      '2 pasture-raised organic poached eggs',
      '1 tbsp organic hemp hearts & microgreens',
      '1/4 tsp crushed Aleppo red chili flakes'
    ],
    instructions: [
      'Toast sourdough slices in a toaster or on a dry cast-iron skillet until crisp and golden brown.',
      'In a ceramic bowl, mash ripe avocado with 1 tbsp fresh lime juice, flaky sea salt, and freshly cracked black pepper.',
      'Bring 3 inches of water to a gentle simmer in a saucepan with a dash of apple cider vinegar. Swirl to create a vortex and slide in cracked eggs; poach for 3 minutes.',
      'Generously spread avocado mash over toast, gently nestle poached eggs on top, and garnish with hemp hearts, microgreens, and chili flakes.'
    ],
    chefTip: 'Adding a teaspoon of apple cider vinegar to your poaching water helps egg whites firm up cleanly without altering flavor.',
    micronutrients: {
      fiberG: 9,
      potassiumMg: 780,
      calciumMg: 85,
      ironMg: 3.4,
      magnesiumMg: 95,
      zincMg: 2.1,
      vitaminAMcg: 220,
      vitaminCMg: 14,
      vitaminDIU: 88,
      vitaminB12Mcg: 1.4,
      omega3Mg: 1200,
      keyPolyphenols: ['Lutein', 'Zeaxanthin', 'Oleuropein'],
      healthBenefits: [
        'High bioavailable choline for neurological focus',
        'Monounsaturated oleic acid supports cardiovascular tone',
        'Slow-fermented sourdough provides prebiotic fructans'
      ]
    }
  },
  {
    id: 'rec_b2',
    title: 'Ceremonial Kyoto Matcha Green Superfood Smoothie Bowl',
    category: 'breakfast',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 345,
    prepTimeMinutes: 8,
    servings: 1,
    portion: '1 bowl (360g)',
    proteinG: 25,
    carbsG: 44,
    fatG: 8,
    cuisine: 'East Asian & Clean',
    tags: ['L-Theanine Clean Energy', 'Antioxidants', 'Cellular Renewal'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    items: [
      '1.5 tsp organic Japanese ceremonial Uji matcha powder',
      '1 frozen ripe banana & 1/2 cup baby spinach',
      '1 scoop vanilla pea & brown rice sprouted protein',
      '1 cup unsweetened fortified almond milk',
      'Toppings: 1 tbsp pumpkin seeds, 1 kiwi sliced, chia seeds'
    ],
    instructions: [
      'Sift matcha powder through a fine mesh strainer into a high-speed blender to prevent clumping.',
      'Add frozen banana chunks, raw spinach, protein powder, and chilled almond milk.',
      'Blend on high for 45-60 seconds until thick, glossy, and spoonable.',
      'Pour into a chilled bowl and artfully arrange sliced kiwi, pumpkin seeds, and chia seeds across the surface.'
    ],
    chefTip: 'Use frozen banana slices instead of ice cubes to achieve an authentic silky soft-serve texture without diluting flavors.',
    micronutrients: {
      fiberG: 8,
      potassiumMg: 690,
      calciumMg: 340,
      ironMg: 4.8,
      magnesiumMg: 120,
      zincMg: 2.8,
      vitaminAMcg: 450,
      vitaminCMg: 72,
      vitaminDIU: 100,
      vitaminB12Mcg: 2.4,
      omega3Mg: 850,
      keyPolyphenols: ['EGCG (Epigallocatechin Gallate)', 'Chlorophyll', 'Quercetin'],
      healthBenefits: [
        'EGCG promotes cellular autophagy and mitochondrial health',
        'L-Theanine fosters relaxed alertness without caffeine jitters',
        'High vitamin C from kiwi enhances plant-based non-heme iron absorption'
      ]
    }
  },
  {
    id: 'rec_b3',
    title: 'Greek Mediterranean Herb & Feta Shakshuka',
    category: 'breakfast',
    dietStyle: 'Vegetarian',
    difficulty: 'Medium',
    estimatedCalories: 410,
    prepTimeMinutes: 20,
    servings: 1,
    portion: '1 cast-iron skillet (380g)',
    proteinG: 24,
    carbsG: 32,
    fatG: 19,
    cuisine: 'Mediterranean & Coastal',
    tags: ['Lycopene Rich', 'Complete Protein', 'Warm Comfort'],
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
    items: [
      '2 large pasture-raised eggs',
      '1 cup San Marzano crushed tomatoes with garlic & oregano',
      '1/2 sweet red bell pepper diced & 1/4 yellow onion',
      '35g authentic Greek barrel-aged sheep feta crumbled',
      '1 slice warm whole grain pita or rustic sourdough',
      'Fresh Italian flat-leaf parsley & extra virgin olive oil'
    ],
    instructions: [
      'Heat 1 tbsp olive oil in an 8-inch cast-iron skillet over medium heat. Sauté diced bell peppers and onions until translucent (5 mins).',
      'Stir in crushed tomatoes, minced garlic, smoked paprika, ground cumin, and sea salt. Simmer for 8 minutes until sauce thickens.',
      'Make two slight indentations with a spoon and gently crack eggs directly into the wells.',
      'Cover with a lid and cook on low for 4-5 minutes until egg whites are set and yolks remain velvety runny.',
      'Remove from heat, scatter crumbled feta and fresh parsley, and serve immediately with warm crusty bread.'
    ],
    chefTip: 'Cooking tomatoes in extra virgin olive oil dramatically increases the bioavailability of lycopene, a potent lipid-soluble antioxidant.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 710,
      calciumMg: 240,
      ironMg: 3.6,
      magnesiumMg: 62,
      zincMg: 2.2,
      vitaminAMcg: 380,
      vitaminCMg: 88,
      vitaminDIU: 95,
      vitaminB12Mcg: 1.6,
      omega3Mg: 450,
      keyPolyphenols: ['Lycopene', 'Capsanthin', 'Naringenin'],
      healthBenefits: [
        'Lycopene provides robust vascular and prostate protection',
        'Pasture egg yolk delivers bioavailable lutein and zeaxanthin for vision',
        'Fermented sheep feta delivers natural probiotics and bioavailable calcium'
      ]
    }
  },
  {
    id: 'rec_b4',
    title: 'Smoked Wild Alaskan Salmon Scramble with Fresh Dill',
    category: 'breakfast',
    dietStyle: 'Pescatarian',
    difficulty: 'Easy',
    estimatedCalories: 380,
    prepTimeMinutes: 10,
    servings: 1,
    portion: '1 plate (290g)',
    proteinG: 34,
    carbsG: 18,
    fatG: 18,
    cuisine: 'Nordic Clean',
    tags: ['Wild Caught', 'High Omega-3', 'High Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    items: [
      '75g wild Alaskan smoked sockeye salmon flaked',
      '2 organic pasture-raised eggs + 1 egg white beaten',
      '1 slice sprouted Ezekiel whole grain bread toasted',
      '1 tbsp fresh chopped dill & chopped chives',
      '1/4 avocado sliced with lemon wedge'
    ],
    instructions: [
      'Whisk eggs with a splash of water, black pepper, and half the fresh dill in a bowl.',
      'Melt 1 tsp grass-fed ghee or olive oil in a non-stick pan over medium-low heat.',
      'Pour eggs in and gently push curds with a spatula for 2 minutes for a soft, creamy scramble.',
      'Remove from heat just before fully set, fold in flaked smoked salmon, and plate alongside toasted Ezekiel toast and sliced avocado.',
      'Garnish with remaining dill, chives, and fresh lemon juice.'
    ],
    chefTip: 'Never overheat smoked salmon; folding it in off the heat preserves its natural omega-3 EPA/DHA fatty acids and tender texture.',
    micronutrients: {
      fiberG: 5,
      potassiumMg: 650,
      calciumMg: 78,
      ironMg: 2.9,
      magnesiumMg: 58,
      zincMg: 2.4,
      vitaminAMcg: 210,
      vitaminCMg: 9,
      vitaminDIU: 440,
      vitaminB12Mcg: 4.8,
      omega3Mg: 1950,
      keyPolyphenols: ['Astaxanthin', 'Anethofuran'],
      healthBenefits: [
        'Exceptionally high EPA & DHA omega-3s combat systemic inflammation',
        'Astaxanthin from wild sockeye salmon offers superior skin photo-protection',
        'Substantial Vitamin B12 and Vitamin D3 support immune vitality'
      ]
    }
  },
  {
    id: 'rec_b5',
    title: 'Overnight Golden Turmeric Chia & Wild Berry Parfait',
    category: 'breakfast',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 320,
    prepTimeMinutes: 5,
    servings: 1,
    portion: '1 jar (300g)',
    proteinG: 14,
    carbsG: 38,
    fatG: 13,
    cuisine: 'Ayurvedic Fusion',
    tags: ['Curcumin Anti-Inflammatory', 'High Soluble Fiber', 'Gut Mucosa'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    items: [
      '3 tbsp black organic chia seeds',
      '1 cup unsweetened oat or coconut milk',
      '1/2 tsp golden turmeric powder + pinch black pepper',
      '1/2 tsp Ceylon cinnamon & 1 tsp pure maple syrup',
      '1/2 cup fresh wild blueberries & sliced strawberries'
    ],
    instructions: [
      'In a wide mason jar, whisk chia seeds, plant milk, ground turmeric, black pepper, cinnamon, and maple syrup.',
      'Let sit for 5 minutes, then whisk vigorously again to break any clumps.',
      'Seal and refrigerate overnight (or minimum 3 hours) until a luscious pudding forms.',
      'In the morning, top with wild blueberries, sliced strawberries, and optional toasted coconut flakes.'
    ],
    chefTip: 'The pinch of black pepper contains piperine, which boosts turmeric curcumin absorption by up to 2,000%.',
    micronutrients: {
      fiberG: 12,
      potassiumMg: 420,
      calciumMg: 380,
      ironMg: 3.2,
      magnesiumMg: 110,
      zincMg: 1.8,
      vitaminAMcg: 60,
      vitaminCMg: 34,
      vitaminDIU: 60,
      vitaminB12Mcg: 1.2,
      omega3Mg: 2800,
      keyPolyphenols: ['Curcumin', 'Anthocyanins', 'Cinnamaldehyde'],
      healthBenefits: [
        'Plant-based ALA omega-3 fatty acids reinforce brain cell membranes',
        'Abundant mucilage fiber nourishes Akkermansia muciniphila in the gut',
        'Potent anthocyanin antioxidants neutralize reactive oxygen species'
      ]
    }
  },
  {
    id: 'rec_b6',
    title: 'Fluffy High-Protein Ricotta & Wild Blueberry Hotcakes',
    category: 'breakfast',
    dietStyle: 'Vegetarian',
    difficulty: 'Medium',
    estimatedCalories: 440,
    prepTimeMinutes: 15,
    servings: 1,
    portion: '3 hotcakes (340g)',
    proteinG: 32,
    carbsG: 48,
    fatG: 12,
    cuisine: 'California Clean',
    tags: ['High Protein', 'Calcium Rich', 'Slow Carbs'],
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
    items: [
      '1/2 cup part-skim ricotta cheese or cottage cheese pureed',
      '2 egg whites + 1 whole egg',
      '1/3 cup gluten-free oat flour',
      '1/2 scoop unflavored whey or pea protein isolate',
      '1/2 cup fresh organic blueberries',
      '1 tsp raw honey or pure maple drizzle'
    ],
    instructions: [
      'In a blender, whiz ricotta, eggs, oat flour, and protein powder until batter is satiny smooth.',
      'Warm a ceramic non-stick skillet over medium-low heat with a brush of coconut oil.',
      'Pour batter into 3 rounds. Gently press whole blueberries into each cake surface.',
      'Cook for 3 minutes until bubbles form on top, flip gently, and cook 2 more minutes until golden.',
      'Stack high, scatter fresh blueberries, and drizzle with a touch of maple.'
    ],
    chefTip: 'Cooking on medium-low heat allows the high-protein batter to cook through evenly without burning on the exterior.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 490,
      calciumMg: 310,
      ironMg: 2.6,
      magnesiumMg: 68,
      zincMg: 2.1,
      vitaminAMcg: 180,
      vitaminCMg: 18,
      vitaminDIU: 70,
      vitaminB12Mcg: 1.8,
      omega3Mg: 380,
      keyPolyphenols: ['Anthocyanins', 'Resveratrol'],
      healthBenefits: [
        'Complete amino acid profile stimulates muscle protein synthesis',
        'Bioavailable dairy calcium reinforces bone density',
        'Blueberry flavonoids support memory and cognitive processing speed'
      ]
    }
  },

  // ==================== LUNCHES ====================
  {
    id: 'rec_l1',
    title: 'Rainbow Quinoa, Spiced Chickpea & Garlic Tahini Buddha Bowl',
    category: 'lunch',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 540,
    prepTimeMinutes: 18,
    servings: 1,
    portion: '1 large bowl (460g)',
    proteinG: 24,
    carbsG: 72,
    fatG: 16,
    cuisine: 'Mediterranean & Coastal',
    tags: ['Plant Protein', 'High Fiber', 'Gut Diversity'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 cup fluffy cooked tri-color quinoa',
      '1 cup oven-roasted chickpeas with ground cumin & smoked paprika',
      '1/2 cup diced Persian cucumber & cherry tomatoes',
      '1/4 cup shredded purple cabbage & grated carrot',
      '2 tbsp whole sesame tahini whisked with lemon & garlic',
      'Fresh mint leaves & toasted white sesame seeds'
    ],
    instructions: [
      'Spread quinoa evenly across the base of a wide ceramic bowl.',
      'Arrange spiced chickpeas, cucumbers, cherry tomatoes, purple cabbage, and carrots in vivid contrasting sections.',
      'In a ramekin, whisk sesame tahini with 1 tbsp fresh lemon juice, 1 minced garlic clove, and 2 tbsp warm water until smooth and pourable.',
      'Generously drizzle garlic tahini dressing across the bowl and garnish with fresh mint.'
    ],
    chefTip: 'To get chickpeas exceptionally crispy, pat them completely dry with a paper towel before tossing in spices and roasting.',
    micronutrients: {
      fiberG: 15,
      potassiumMg: 890,
      calciumMg: 190,
      ironMg: 5.6,
      magnesiumMg: 160,
      zincMg: 3.8,
      vitaminAMcg: 480,
      vitaminCMg: 48,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 420,
      keyPolyphenols: ['Sesamin', 'Kaempferol', 'Quercetin'],
      healthBenefits: [
        'Tri-color quinoa offers all 9 essential amino acids',
        'Exceptional 15g prebiotic dietary fiber supports colon lining integrity',
        'Sesame lignans (sesamin) support healthy lipid metabolism and liver function'
      ]
    }
  },
  {
    id: 'rec_l2',
    title: 'Herb-Crusted Wild Salmon with Warm Farro & Charred Asparagus',
    category: 'lunch',
    dietStyle: 'Pescatarian',
    difficulty: 'Medium',
    estimatedCalories: 580,
    prepTimeMinutes: 22,
    servings: 1,
    portion: '1 fillet with sides (440g)',
    proteinG: 46,
    carbsG: 38,
    fatG: 24,
    cuisine: 'Mediterranean & Coastal',
    tags: ['Omega-3 Powerhouse', 'Lean Muscle', 'Selenium Rich'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    items: [
      '180g wild Alaskan coho or king salmon fillet',
      '1 cup cooked warm Italian farro with lemon zest & olive oil',
      '1 bundle baby pencil asparagus spears trimmed',
      'Fresh dill, parsley, and garlic herb crust',
      '1 tbsp cold-pressed extra virgin olive oil',
      'Charred lemon half'
    ],
    instructions: [
      'Pat salmon skin dry. Season both sides with flaky sea salt and cracked pepper.',
      'Heat 1 tsp olive oil in a heavy stainless-steel or cast-iron skillet over medium-high heat. Place salmon skin-side down, press gently with spatula, and cook 4 minutes until crisp.',
      'Flip salmon and sear for 2-3 minutes until center is just cooked through.',
      'In the same skillet, toss asparagus spears with garlic and lemon zest for 3 minutes until charred yet tender-crisp.',
      'Plate alongside warm farro, spooning pan juices and fresh chopped herbs over the fish.'
    ],
    chefTip: 'Dry skin is the secret to restaurant-quality crispy fish skin; moisture creates steam and prevents crisping.',
    micronutrients: {
      fiberG: 7,
      potassiumMg: 920,
      calciumMg: 82,
      ironMg: 3.8,
      magnesiumMg: 110,
      zincMg: 2.9,
      vitaminAMcg: 310,
      vitaminCMg: 28,
      vitaminDIU: 680,
      vitaminB12Mcg: 5.4,
      omega3Mg: 2350,
      keyPolyphenols: ['Astaxanthin', 'Ferulic Acid', 'Apigenin'],
      healthBenefits: [
        'Superior natural Vitamin D3 and Selenium for immune modulation',
        'Long-chain Omega-3 EPA/DHA improves endothelial vascular flexibility',
        'Ancient grain farro provides slow-burning complex energy and B vitamins'
      ]
    }
  },
  {
    id: 'rec_l3',
    title: 'Mediterranean Lemon Herb Chicken with Kalamata & Tzatziki',
    category: 'lunch',
    dietStyle: 'High Protein',
    difficulty: 'Easy',
    estimatedCalories: 510,
    prepTimeMinutes: 20,
    servings: 1,
    portion: '1 plate (420g)',
    proteinG: 48,
    carbsG: 26,
    fatG: 18,
    cuisine: 'Greek Mediterranean',
    tags: ['High Protein', 'Lean Muscle', 'Gut Probiotics'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    items: [
      '180g organic chicken breast marinated in lemon, oregano & garlic',
      '1 cup chopped romaine hearts & Persian cucumber',
      '6 kalamata olives pitted & halved',
      '3 tbsp authentic Greek yogurt cucumber tzatziki',
      '1/2 whole grain pita pocket toasted',
      'Fresh mint & Greek extra virgin olive oil'
    ],
    instructions: [
      'Toss chicken breast with olive oil, dried wild oregano, lemon juice, minced garlic, and sea salt.',
      'Grill or pan-sear on medium-high heat for 6 minutes per side until internal temperature reaches 165°F (74°C). Let rest 3 minutes, then slice.',
      'Toss crisp romaine lettuce with sliced cucumbers, kalamata olives, and a touch of red wine vinegar.',
      'Plate the sliced warm chicken over the salad with creamy tzatziki and toasted pita points.'
    ],
    chefTip: 'Resting grilled poultry for 3-5 minutes allows muscle fibers to relax, redistributing moisture evenly throughout the meat.',
    micronutrients: {
      fiberG: 5,
      potassiumMg: 820,
      calciumMg: 140,
      ironMg: 2.8,
      magnesiumMg: 65,
      zincMg: 3.1,
      vitaminAMcg: 290,
      vitaminCMg: 32,
      vitaminDIU: 25,
      vitaminB12Mcg: 1.1,
      omega3Mg: 310,
      keyPolyphenols: ['Hydroxytyrosol', 'Carvacrol', 'Thymol'],
      healthBenefits: [
        '48g lean biological protein maximizes muscle protein synthesis',
        'Tzatziki provides live Lactobacillus bulgaricus cultures for microbiome balance',
        'Kalamata olives supply hydroxytyrosol, one of nature\'s strongest free radical scavengers'
      ]
    }
  },
  {
    id: 'rec_l4',
    title: 'Crispy Ginger Sesame Tofu Bowl with Edamame & Baby Bok Choy',
    category: 'lunch',
    dietStyle: 'Vegan',
    difficulty: 'Medium',
    estimatedCalories: 480,
    prepTimeMinutes: 20,
    servings: 1,
    portion: '1 bowl (430g)',
    proteinG: 28,
    carbsG: 46,
    fatG: 18,
    cuisine: 'East Asian & Umami',
    tags: ['Plant Protein', 'Calcium Rich', 'Glucosinolates'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    items: [
      '175g extra-firm organic tofu pressed and cubed',
      '1/2 cup shelled green edamame beans steamed',
      '2 baby bok choy heads halved and flash-seared',
      '3/4 cup steamed short-grain brown rice',
      'Sauce: Tamari, grated fresh ginger, toasted sesame oil, rice vinegar',
      'Garnish: Black sesame seeds & sliced scallions'
    ],
    instructions: [
      'Press tofu with paper towels to extract moisture. Toss with 1 tsp cornstarch and pinch of salt.',
      'Sear tofu cubes in 1 tsp toasted sesame oil over medium-high heat for 6-8 minutes, rotating until all sides are crunchy and golden.',
      'Whisk tamari, ginger, rice vinegar, and a splash of water. Pour over tofu during last minute to glaze.',
      'Flash-steam baby bok choy and edamame for 3 minutes until vibrant green.',
      'Assemble brown rice base, glazed tofu, bok choy, and edamame in a bowl; sprinkle with scallions and black sesame seeds.'
    ],
    chefTip: 'Lightly dusting pressed tofu with cornstarch or arrowroot ensures an addictive crispy shell without deep frying.',
    micronutrients: {
      fiberG: 9,
      potassiumMg: 790,
      calciumMg: 420,
      ironMg: 5.2,
      magnesiumMg: 145,
      zincMg: 3.4,
      vitaminAMcg: 410,
      vitaminCMg: 58,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 650,
      keyPolyphenols: ['Isoflavones (Genistein)', 'Gingerol', 'Indole-3-Carbinol'],
      healthBenefits: [
        'Calcium sulfate set tofu provides over 40% of daily calcium needs',
        'Cruciferous bok choy delivers indole-3-carbinol for cellular detoxification',
        'Fresh gingerol accelerates gastric emptying and digestive comfort'
      ]
    }
  },
  {
    id: 'rec_l5',
    title: 'Roasted Sweet Potato & Black Bean Fiesta Bowl',
    category: 'lunch',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 495,
    prepTimeMinutes: 20,
    servings: 1,
    portion: '1 bowl (450g)',
    proteinG: 19,
    carbsG: 78,
    fatG: 12,
    cuisine: 'Mexican & Latino Fiesta',
    tags: ['Beta-Carotene', 'Resistant Starch', 'Fiber Dense'],
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 medium sweet potato cubed and roasted with cumin & chili powder',
      '1 cup organic black beans rinsed and simmered with garlic',
      '1/2 cup fresh sweet corn kernels & diced red bell pepper',
      '1/3 Hass avocado diced with lime juice',
      'Cilantro lime dressing with cold-pressed olive oil',
      'Handful crisp pumpkin seeds (pepitas)'
    ],
    instructions: [
      'Toss sweet potato cubes with olive oil, chili powder, cumin, and sea salt. Roast at 400°F (200°C) for 22 minutes until caramelized.',
      'Warm black beans with minced garlic and a pinch of ground oregano.',
      'Layer warm black beans and sweet potatoes in a bowl with corn and diced bell pepper.',
      'Top with ripe diced avocado, toasted pumpkin seeds, and fresh cilantro lime drizzle.'
    ],
    chefTip: 'Chilling cooked sweet potatoes and reheating slightly increases resistant starch, which feeds beneficial Bifidobacteria in the gut.',
    micronutrients: {
      fiberG: 17,
      potassiumMg: 960,
      calciumMg: 110,
      ironMg: 4.6,
      magnesiumMg: 135,
      zincMg: 2.7,
      vitaminAMcg: 1100,
      vitaminCMg: 65,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 410,
      keyPolyphenols: ['Beta-Carotene', 'Anthocyanins', 'Lutein'],
      healthBenefits: [
        'Exceeds 100% daily Vitamin A requirement via natural beta-carotene',
        '17g of prebiotic fiber stabilizes blood glucose and maintains satiety',
        'High potassium-to-sodium ratio regulates healthy blood pressure'
      ]
    }
  },
  {
    id: 'rec_l6',
    title: 'Seared Yellowfin Tuna Poke Bowl with Wakame & Brown Rice',
    category: 'lunch',
    dietStyle: 'Pescatarian',
    difficulty: 'Medium',
    estimatedCalories: 520,
    prepTimeMinutes: 15,
    servings: 1,
    portion: '1 bowl (410g)',
    proteinG: 44,
    carbsG: 52,
    fatG: 14,
    cuisine: 'Pacific Rim & Umami',
    tags: ['Ultra Lean Protein', 'Thyroid Iodine', 'Selenium Rich'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-d98382ae9734?auto=format&fit=crop&w=800&q=80',
    items: [
      '160g sushi-grade wild yellowfin tuna cubed',
      '1 cup warm short-grain brown rice or cauliflower rice',
      '2 tbsp Japanese wakame seaweed salad',
      '1/2 Persian cucumber sliced into ribbons & 1/4 avocado',
      'Dressing: Low-sodium tamari, toasted sesame oil, ginger juice, lime',
      'Toasted nori strips and white sesame seeds'
    ],
    instructions: [
      'Gently toss cubed yellowfin tuna with 1 tbsp tamari, 1/2 tsp sesame oil, and fresh ginger juice. Chill for 5 minutes.',
      'Spoon warm brown rice into the base of a ceramic bowl.',
      'Arrange seasoned tuna, wakame seaweed, cucumber ribbons, and avocado slices neatly over the rice.',
      'Drizzle remaining dressing over the top and scatter toasted nori ribbons and sesame seeds.'
    ],
    chefTip: 'Keep tuna chilled right until serving; combining cool marinated fish with warm rice creates the classic contrasting temperature of authentic poke.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 780,
      calciumMg: 65,
      ironMg: 3.2,
      magnesiumMg: 105,
      zincMg: 2.3,
      vitaminAMcg: 190,
      vitaminCMg: 12,
      vitaminDIU: 210,
      vitaminB12Mcg: 6.2,
      omega3Mg: 1450,
      keyPolyphenols: ['Fucoidan', 'Sesamol'],
      healthBenefits: [
        'Wakame seaweed delivers natural trace mineral iodine for thyroid hormone T3/T4 synthesis',
        'Yellowfin tuna provides massive selenium protecting against heavy metal oxidative stress',
        'High biological value protein promotes efficient tissue repair'
      ]
    }
  },

  // ==================== DINNERS ====================
  {
    id: 'rec_d1',
    title: 'Golden Coconut Lentil Dal Tadka with Aged Basmati & Greens',
    category: 'dinner',
    dietStyle: 'Vegetarian',
    difficulty: 'Easy',
    estimatedCalories: 490,
    prepTimeMinutes: 25,
    servings: 1,
    portion: '1 full dinner plate (440g)',
    proteinG: 22,
    carbsG: 74,
    fatG: 12,
    cuisine: 'Modern Indian & Spiced',
    tags: ['Turmeric Healing', 'Fiber Rich', 'Warm Comfort'],
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    items: [
      '3/4 cup yellow split moong dal rinsed',
      '1 cup steamed aged brown basmati rice',
      '2 cups tender baby spinach leaves wilted with garlic',
      'Tadka: Sliced garlic, cumin seeds, mustard seeds sizzled in virgin coconut oil',
      '1/2 tsp golden turmeric, grated ginger, sea salt',
      'Fresh cilantro and lemon squeeze'
    ],
    instructions: [
      'Simmer rinsed moong lentils with water, turmeric, grated ginger, and pink sea salt for 20 minutes until creamy and velvety.',
      'In a small skillet, heat coconut oil over medium-high heat. Add cumin seeds and mustard seeds until they crackle; add sliced garlic and sizzle until golden brown.',
      'Immediately pour the aromatic sizzling tadka into the cooked dal and stir.',
      'In the same skillet, toss fresh baby spinach for 90 seconds with a drop of water until wilted.',
      'Plate the creamy dal alongside fluffy brown basmati and garlic greens, finishing with fresh cilantro and lemon.'
    ],
    chefTip: 'Moong dal is the gentlest and most digestible legume in culinary traditions, minimizing bloating while delivering complete comfort.',
    micronutrients: {
      fiberG: 14,
      potassiumMg: 820,
      calciumMg: 155,
      ironMg: 5.4,
      magnesiumMg: 130,
      zincMg: 3.2,
      vitaminAMcg: 490,
      vitaminCMg: 38,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 380,
      keyPolyphenols: ['Curcumin', 'Quercetin', 'Ferulic Acid'],
      healthBenefits: [
        'Curcumin combined with healthy lipids down-regulates inflammatory NF-kB pathways',
        'Lentil polyphenols promote gut barrier repair and peptide YY satiety signaling',
        'Rich in bioavailable folate and iron for healthy red blood cell synthesis'
      ]
    }
  },
  {
    id: 'rec_d2',
    title: 'Grass-Fed Ribeye Steak with Garlic Herb Asparagus & Puree',
    category: 'dinner',
    dietStyle: 'Keto',
    difficulty: 'Medium',
    estimatedCalories: 590,
    prepTimeMinutes: 25,
    servings: 1,
    portion: '1 plate (420g)',
    proteinG: 48,
    carbsG: 12,
    fatG: 38,
    cuisine: 'Rustic French & Herb',
    tags: ['Zero Glycemic Spike', 'Bioavailable Iron', 'High Zinc'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    items: [
      '180g grass-fed beef ribeye or strip steak',
      '1.5 cups steamed cauliflower florets pureed with grass-fed butter & roasted garlic',
      '1 cup pencil asparagus spears trimmed',
      '1 tbsp grass-fed butter infused with fresh rosemary and thyme',
      'Coarse Maldon sea salt & cracked black peppercorns'
    ],
    instructions: [
      'Take steak out of refrigeration 20 minutes before cooking. Season generously with coarse salt.',
      'Heat a heavy cast-iron skillet until smoking hot. Sear steak for 3 minutes without moving.',
      'Flip steak, add butter, rosemary, and smashed garlic cloves. Baste foaming herb butter over steak for 2.5 minutes for medium-rare (130°F/54°C).',
      'Transfer steak to a warm cutting board to rest for 6 minutes.',
      'Puree steamed cauliflower with butter, roasted garlic, and salt until as velvety as mashed potatoes.',
      'Flash sauté asparagus in the steak pan drippings for 2 minutes. Slice steak and plate over cauliflower puree.'
    ],
    chefTip: 'Basting steak with foaming butter and aromatic herbs creates complex Maillard reaction compounds that elevate simple cuts into gourmet cuisine.',
    micronutrients: {
      fiberG: 5,
      potassiumMg: 880,
      calciumMg: 68,
      ironMg: 4.8,
      magnesiumMg: 75,
      zincMg: 7.2,
      vitaminAMcg: 220,
      vitaminCMg: 45,
      vitaminDIU: 40,
      vitaminB12Mcg: 4.2,
      omega3Mg: 450,
      keyPolyphenols: ['Rosmarinic Acid', 'Carnosic Acid'],
      healthBenefits: [
        'Grass-fed beef delivers highly bioavailable heme iron and zinc for immune and hormone support',
        'Zero simple carbohydrates avoids nighttime glucose and insulin spikes',
        'Rosemary and thyme polyphenols mitigate lipid oxidation during cooking'
      ]
    }
  },
  {
    id: 'rec_d3',
    title: 'Oven-Baked Lemon Herb Cod with Heirloom Tomatoes & Wild Rice',
    category: 'dinner',
    dietStyle: 'Pescatarian',
    difficulty: 'Easy',
    estimatedCalories: 440,
    prepTimeMinutes: 22,
    servings: 1,
    portion: '1 plate (410g)',
    proteinG: 42,
    carbsG: 44,
    fatG: 9,
    cuisine: 'Mediterranean & Coastal',
    tags: ['Ultra Lean Fish', 'Heart Healthy', 'Lycopene Rich'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    items: [
      '190g fresh Atlantic cod or halibut fillet',
      '1 cup multicolor heirloom cherry tomatoes halved',
      '3/4 cup cooked fragrant Minnesota wild rice blend',
      '1 tbsp cold-pressed extra virgin olive oil',
      '1 tbsp capers drained & 2 garlic cloves minced',
      'Fresh basil ribbons & lemon juice'
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Place cod fillet in a ceramic baking dish.',
      'Surround fish with halved heirloom cherry tomatoes, capers, minced garlic, and extra virgin olive oil.',
      'Season cod with sea salt, dried oregano, and freshly squeezed lemon juice.',
      'Bake for 15-18 minutes until cod flakes effortlessly with a fork and tomatoes have burst into a rich savory sauce.',
      'Serve over a bed of warm nutty wild rice and scatter fresh basil ribbons over the top.'
    ],
    chefTip: 'White cod is delicate; baking gently inside a tomato-caper bath keeps it moist and infuses deep Mediterranean aromas.',
    micronutrients: {
      fiberG: 5,
      potassiumMg: 740,
      calciumMg: 52,
      ironMg: 2.4,
      magnesiumMg: 85,
      zincMg: 1.8,
      vitaminAMcg: 140,
      vitaminCMg: 36,
      vitaminDIU: 90,
      vitaminB12Mcg: 2.8,
      omega3Mg: 580,
      keyPolyphenols: ['Lycopene', 'Quercetin', 'Kaempferol'],
      healthBenefits: [
        'Lean white cod provides exceptional protein density with minimal caloric overhead',
        'Roasted heirloom tomatoes release concentrated lycopene for arterial elasticity',
        'Wild rice contains double the protein and fiber of standard white rice'
      ]
    }
  },
  {
    id: 'rec_d4',
    title: 'Spiced Paneer Tikka with Cauliflower Rice & Charred Peppers',
    category: 'dinner',
    dietStyle: 'Vegetarian',
    difficulty: 'Medium',
    estimatedCalories: 460,
    prepTimeMinutes: 25,
    servings: 1,
    portion: '1 plate (390g)',
    proteinG: 26,
    carbsG: 18,
    fatG: 31,
    cuisine: 'Modern Indian & Spiced',
    tags: ['Low Carb', 'Calcium Rich', 'Spiced Aromatics'],
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    items: [
      '140g artisanal fresh paneer cubed',
      '1.5 cups grated cauliflower rice sautéed with cumin & cilantro',
      '1/2 red bell pepper & 1/2 green bell pepper cut into chunks',
      'Marinade: Greek yogurt, roasted cumin, garam masala, turmeric, ginger',
      'Fresh mint coriander chutney drizzle & lemon wedges'
    ],
    instructions: [
      'Whisk Greek yogurt with garam masala, turmeric, minced ginger-garlic, sea salt, and lemon juice.',
      'Toss paneer cubes and bell pepper chunks in the spiced yogurt marinade; let sit for 10 minutes.',
      'Thread onto skewers or arrange on a parchment-lined baking sheet. Broil on high for 8-10 minutes, flipping once, until charred at edges.',
      'In a pan, quickly sauté riced cauliflower with 1 tsp ghee, whole cumin seeds, and a pinch of salt for 4 minutes.',
      'Serve charred paneer skewers over warm cauliflower rice with fresh mint coriander chutney.'
    ],
    chefTip: 'High-heat broiling creates authentic tandoor-style char without drying out the succulent paneer inside.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 680,
      calciumMg: 490,
      ironMg: 2.8,
      magnesiumMg: 55,
      zincMg: 3.4,
      vitaminAMcg: 340,
      vitaminCMg: 94,
      vitaminDIU: 45,
      vitaminB12Mcg: 1.4,
      omega3Mg: 290,
      keyPolyphenols: ['Curcumin', 'Capsaicin', 'Cineole'],
      healthBenefits: [
        'Paneer supplies almost 50% of daily bioavailable calcium for skeletal matrix support',
        'Low glycemic cauliflower rice prevents nocturnal insulin spikes for optimal sleep quality',
        'Bell peppers and mint provide synergistic Vitamin C and digestive menthol'
      ]
    }
  },
  {
    id: 'rec_d5',
    title: 'Rosemary Herb-Roasted Chicken Breast with Sweet Potato Mash',
    category: 'dinner',
    dietStyle: 'High Protein',
    difficulty: 'Easy',
    estimatedCalories: 510,
    prepTimeMinutes: 25,
    servings: 1,
    portion: '1 plate (440g)',
    proteinG: 46,
    carbsG: 42,
    fatG: 16,
    cuisine: 'Rustic French & Herb',
    tags: ['High Protein', 'Beta-Carotene', 'Clean Recovery'],
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    items: [
      '180g free-range chicken breast roasted with fresh rosemary',
      '1 cup sweet potato mashed with a touch of grass-fed butter and nutmeg',
      '1 cup French green beans (haricots verts) steamed with shallots',
      '1 tsp cold-pressed olive oil & cracked pink peppercorns',
      'Pan jus reduction with fresh thyme'
    ],
    instructions: [
      'Season chicken breast with sea salt, black pepper, and finely chopped fresh rosemary.',
      'Sear in an oven-safe skillet with 1 tsp olive oil for 3 minutes, then transfer to 375°F (190°C) oven for 15 minutes until internal temp reaches 165°F (74°C).',
      'Boil or steam sweet potato cubes until fork-tender; mash with a dab of butter, salt, and freshly grated nutmeg.',
      'Steam green beans for 3 minutes until vibrant and tender-crisp; toss with minced shallots.',
      'Slice chicken across the grain, arrange over golden sweet potato mash with green beans, and drizzle pan jus.'
    ],
    chefTip: 'Finishing the sear in the oven seals in juices and prevents the outer breast meat from drying out before the center cooks.',
    micronutrients: {
      fiberG: 7,
      potassiumMg: 920,
      calciumMg: 72,
      ironMg: 2.6,
      magnesiumMg: 82,
      zincMg: 2.8,
      vitaminAMcg: 980,
      vitaminCMg: 34,
      vitaminDIU: 20,
      vitaminB12Mcg: 1.2,
      omega3Mg: 280,
      keyPolyphenols: ['Rosmarinic Acid', 'Beta-Carotene'],
      healthBenefits: [
        'Optimal post-workout recovery meal with 46g complete protein and slow glycogen replenishment',
        'High potassium aids natural muscle electrolyte re-balance and relaxes tension',
        'Rosemary compounds support cerebral blood flow and neurological vitality'
      ]
    }
  },
  {
    id: 'rec_d6',
    title: 'Creamy Wild Mushroom & Truffle Farro with Pine Nuts',
    category: 'dinner',
    dietStyle: 'Vegetarian',
    difficulty: 'Medium',
    estimatedCalories: 460,
    prepTimeMinutes: 28,
    servings: 1,
    portion: '1 bowl (380g)',
    proteinG: 18,
    carbsG: 62,
    fatG: 16,
    cuisine: 'Rustic Italian & Olive',
    tags: ['Ergothioneine Longevity', 'Ancient Grain', 'Earth Umami'],
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 cup Italian pearled farro cooked in organic vegetable broth',
      '1.5 cups mixed wild mushrooms (cremini, shiitake, oyster) sliced',
      '2 shallots minced & 2 garlic cloves minced in extra virgin olive oil',
      '1 tbsp toasted Mediterranean pine nuts',
      '1 tbsp grated Parmigiano-Reggiano or nutritional yeast',
      'Drop of white truffle oil & fresh Italian flat parsley'
    ],
    instructions: [
      'Heat 1 tbsp olive oil in a wide sauté pan. Add wild mushrooms in a single layer and cook undisturbed for 4 minutes to caramelize.',
      'Add minced shallots, garlic, and fresh thyme; sauté 2 minutes until fragrant.',
      'Fold in cooked warm farro and a splash of warm broth, stirring vigorously for 2 minutes to create a natural creamy emulsion.',
      'Remove from heat, fold in grated cheese and a drop of white truffle oil.',
      'Plate in a warm shallow bowl, garnished with toasted pine nuts and chopped flat parsley.'
    ],
    chefTip: 'Never crowd the pan when sautéing mushrooms, or they will steam instead of caramelizing and developing deep rich umami.',
    micronutrients: {
      fiberG: 9,
      potassiumMg: 710,
      calciumMg: 110,
      ironMg: 3.8,
      magnesiumMg: 95,
      zincMg: 2.7,
      vitaminAMcg: 85,
      vitaminCMg: 14,
      vitaminDIU: 110,
      vitaminB12Mcg: 0.8,
      omega3Mg: 340,
      keyPolyphenols: ['Ergothioneine', 'Beta-Glucans', 'Allicin'],
      healthBenefits: [
        'Wild mushrooms contain ergothioneine, an extraordinary cellular longevity antioxidant',
        'Mushroom beta-glucans prime innate immune surveillance pathways',
        'Slow-burning ancient grain farro maintains sustained nocturnal energy'
      ]
    }
  },

  // ==================== SNACKS & SMOOTHIES ====================
  {
    id: 'rec_s1',
    title: 'Wild Berry Greek Yogurt & Raw Chia Superfood Parfait',
    category: 'snack',
    dietStyle: 'Vegetarian',
    difficulty: 'Easy',
    estimatedCalories: 220,
    prepTimeMinutes: 5,
    servings: 1,
    portion: '1 glass parfait (240g)',
    proteinG: 18,
    carbsG: 24,
    fatG: 6,
    cuisine: 'Mediterranean Vitality',
    tags: ['Gut Probiotics', 'Low GI', 'Brain Food'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 cup authentic thick strained whole Greek yogurt',
      '1/2 cup fresh wild blueberries, blackberries & raspberries',
      '1 tbsp raw organic black chia seeds',
      '1 tsp raw clover honey or pure maple syrup',
      '1 tbsp crushed raw toasted walnuts'
    ],
    instructions: [
      'Spoon half of the Greek yogurt into a chilled glass tumbler.',
      'Layer half of the fresh berry medley and sprinkle half the chia seeds.',
      'Add the remaining yogurt, top with remaining berries, crushed walnuts, and a fine golden drizzle of raw honey.'
    ],
    chefTip: 'Toasted walnuts offer the highest plant-based omega-3 ALA content of any tree nut.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 380,
      calciumMg: 220,
      ironMg: 1.4,
      magnesiumMg: 65,
      zincMg: 1.9,
      vitaminAMcg: 90,
      vitaminCMg: 22,
      vitaminDIU: 40,
      vitaminB12Mcg: 1.3,
      omega3Mg: 1450,
      keyPolyphenols: ['Anthocyanins', 'Ellagic Acid', 'Resveratrol'],
      healthBenefits: [
        '18g protein provides steady mid-afternoon satiety and curbs cravings',
        'Live active yogurt cultures reinforce microbiome flora resilience',
        'Berry polyphenols cross the blood-brain barrier to sharpen afternoon focus'
      ]
    }
  },
  {
    id: 'rec_s2',
    title: 'Honeycrisp Apple with Stone-Ground Almond Butter & Cinnamon',
    category: 'snack',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 210,
    prepTimeMinutes: 4,
    servings: 1,
    portion: '1 plate (200g)',
    proteinG: 6,
    carbsG: 28,
    fatG: 10,
    cuisine: 'Clean Natural',
    tags: ['Pectin Fiber', 'Stable Glycemia', 'Clean Crunch'],
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 organic crisp Honeycrisp or Pink Lady apple sliced',
      '2 tbsp raw stone-ground unrefined almond butter',
      '1/4 tsp organic Ceylon cinnamon',
      '1 tsp raw hemp hearts'
    ],
    instructions: [
      'Core and slice the fresh crisp apple into wedges.',
      'Arrange on a plate around a small dipping dish of stone-ground almond butter.',
      'Dust Ceylon cinnamon and hemp hearts across the apple slices and almond butter.'
    ],
    chefTip: 'Always choose Ceylon cinnamon ("true cinnamon") over Cassia cinnamon to minimize coumarin intake when consuming daily.',
    micronutrients: {
      fiberG: 6,
      potassiumMg: 340,
      calciumMg: 85,
      ironMg: 1.2,
      magnesiumMg: 60,
      zincMg: 0.9,
      vitaminAMcg: 40,
      vitaminCMg: 10,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 380,
      keyPolyphenols: ['Quercetin', 'Cinnamaldehyde', 'Procyanidins'],
      healthBenefits: [
        'Apple soluble pectin fiber slows stomach emptying for gentle glucose curves',
        'Ceylon cinnamon improves insulin receptor sensitivity',
        'Monounsaturated almond fats provide lasting cellular energy'
      ]
    }
  },
  {
    id: 'rec_s3',
    title: 'Wild Blueberry, Spinach & Spirulina Longevity Smoothie',
    category: 'snack',
    dietStyle: 'Vegan',
    difficulty: 'Easy',
    estimatedCalories: 240,
    prepTimeMinutes: 6,
    servings: 1,
    portion: '1 glass (350ml)',
    proteinG: 16,
    carbsG: 34,
    fatG: 5,
    cuisine: 'Superfood Tonic',
    tags: ['Nitric Oxide', 'Chlorophyll Cleanse', 'Antioxidants'],
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    items: [
      '1 cup organic frozen wild blueberries',
      '1 cup tender organic baby spinach leaves',
      '1 tsp organic blue-green spirulina powder',
      '1 scoop unflavored plant protein or collagen alternative',
      '1 cup cold coconut water & 1 tsp chia seeds'
    ],
    instructions: [
      'Place coconut water, spinach, and protein powder into blender first.',
      'Add frozen wild blueberries, spirulina, and chia seeds on top.',
      'Blend on high speed for 60 seconds until deep purple-green, frothy, and completely smooth.',
      'Pour into an iced tumbler and drink fresh to preserve active phytonutrients.'
    ],
    chefTip: 'Drinking smoothies within 15 minutes of blending prevents oxidative degradation of delicate enzymes and Vitamin C.',
    micronutrients: {
      fiberG: 7,
      potassiumMg: 520,
      calciumMg: 140,
      ironMg: 3.6,
      magnesiumMg: 88,
      zincMg: 1.5,
      vitaminAMcg: 380,
      vitaminCMg: 42,
      vitaminDIU: 0,
      vitaminB12Mcg: 1.8,
      omega3Mg: 820,
      keyPolyphenols: ['Phycocyanin', 'Anthocyanins', 'Chlorophyll'],
      healthBenefits: [
        'Phycocyanin from spirulina provides potent kidney and hepatic antioxidant support',
        'Spinach dietary nitrates convert to nitric oxide, promoting micro-circulation',
        'Coconut water naturally rehydrates cellular electrolytes with potassium and sodium'
      ]
    }
  },
  {
    id: 'rec_s4',
    title: 'Raw Macadamia, 85% Dark Chocolate & Rosemary Seed Clusters',
    category: 'snack',
    dietStyle: 'Keto',
    difficulty: 'Easy',
    estimatedCalories: 260,
    prepTimeMinutes: 8,
    servings: 1,
    portion: '1 bowl of clusters (85g)',
    proteinG: 5,
    carbsG: 8,
    fatG: 24,
    cuisine: 'Artisan Keto',
    tags: ['Zero Sugar Crash', 'Heart Flavanols', 'Clean Lipids'],
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    items: [
      '30g raw organic Hawaiian macadamia nuts',
      '20g 85% single-origin dark chocolate chunks',
      '1 tbsp raw pumpkin seeds & 1 tbsp sunflower seeds',
      'Pinch of dried crushed rosemary & flaky sea salt'
    ],
    instructions: [
      'Gently melt half the dark chocolate in a small ceramic bowl in the microwave (30 seconds).',
      'Toss raw macadamias, pumpkin seeds, and sunflower seeds into the melted chocolate.',
      'Spoon into two bite-sized clusters on parchment paper, sprinkle with remaining chocolate chunks, crushed rosemary, and flaky sea salt.',
      'Chill in freezer for 5 minutes until firm, then enjoy the crisp snap!'
    ],
    chefTip: '85% dark chocolate contains abundant prebiotic fiber that gut microbes ferment into beneficial short-chain fatty acids.',
    micronutrients: {
      fiberG: 5,
      potassiumMg: 310,
      calciumMg: 45,
      ironMg: 2.8,
      magnesiumMg: 95,
      zincMg: 1.8,
      vitaminAMcg: 20,
      vitaminCMg: 2,
      vitaminDIU: 0,
      vitaminB12Mcg: 0,
      omega3Mg: 280,
      keyPolyphenols: ['Epicatechin', 'Theobromine', 'Rosmarinic Acid'],
      healthBenefits: [
        'Cocoa epicatechins enhance endothelial nitric oxide generation and arterial elasticity',
        'Macadamia monounsaturated palmitoleic acid supports cellular hydration',
        'High magnesium alleviates muscle cramping and calms the central nervous system'
      ]
    }
  }
];
