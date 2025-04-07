/**
 * Database initialization script
 * Sets up the database schema and seeds initial data
 */

const fs = require('fs');
const path = require('path');
const { pool, query } = require('../utils/db');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Initialize database schema
 * @returns {Promise<void>}
 */
const initializeSchema = async () => {
  try {
    logger.info('Initializing database schema...');
    
    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    await query(schemaSql);
    
    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Error initializing database schema:', error);
    throw error;
  }
};

/**
 * Seed educational content
 * @returns {Promise<void>}
 */
const seedEducationalContent = async () => {
  try {
    logger.info('Seeding educational content...');
    
    // Check if educational content already exists
    const existingContent = await query('SELECT COUNT(*) FROM educational_content');
    
    if (parseInt(existingContent.rows[0].count) > 0) {
      logger.info('Educational content already exists, skipping seed');
      return;
    }
    
    // Sample educational content
    const educationalContent = [
      {
        title: 'Understanding Your Fertility Window',
        content: `
          <h2>What is the Fertility Window?</h2>
          <p>The fertility window is the time during your menstrual cycle when you're most likely to conceive. It typically spans about 6 days: the 5 days before ovulation and the day of ovulation itself.</p>
          
          <h2>Why is it Important?</h2>
          <p>Understanding your fertility window is crucial for couples trying to conceive. Timing intercourse during this window significantly increases your chances of pregnancy.</p>
          
          <h2>How to Identify Your Fertility Window</h2>
          <p>Several methods can help you identify your fertility window:</p>
          <ul>
            <li>Tracking basal body temperature</li>
            <li>Monitoring cervical mucus changes</li>
            <li>Using ovulation prediction kits</li>
            <li>Tracking menstrual cycles</li>
          </ul>
          
          <h2>Basal Body Temperature (BBT)</h2>
          <p>Your BBT rises slightly (about 0.2°C/0.4°F) after ovulation due to increased progesterone. By tracking your temperature daily, you can identify patterns and predict ovulation.</p>
          
          <h2>Cervical Mucus Changes</h2>
          <p>As you approach ovulation, cervical mucus becomes clearer, stretchier, and more slippery, resembling egg whites. This type of mucus helps sperm travel to the egg.</p>
          
          <h2>Maximizing Your Chances</h2>
          <p>To maximize conception chances, aim for intercourse every 1-2 days during your fertility window, with special focus on the 2-3 days leading up to and including ovulation day.</p>
        `,
        category: 'Fertility',
        tags: ['fertility', 'ovulation', 'conception'],
        author: 'Dr. Jane Smith',
      },
      {
        title: 'Nutrition Tips for Conception',
        content: `
          <h2>The Role of Nutrition in Fertility</h2>
          <p>Proper nutrition plays a vital role in reproductive health for both men and women. A balanced diet can improve hormone function, egg and sperm quality, and create an optimal environment for conception.</p>
          
          <h2>Essential Nutrients for Fertility</h2>
          
          <h3>Folic Acid</h3>
          <p>Folic acid is crucial for preventing neural tube defects. Women trying to conceive should consume 400-800 mcg daily through supplements and folate-rich foods like leafy greens, citrus fruits, and fortified grains.</p>
          
          <h3>Omega-3 Fatty Acids</h3>
          <p>These healthy fats improve egg quality and reduce inflammation. Sources include fatty fish (salmon, sardines), walnuts, and flaxseeds.</p>
          
          <h3>Antioxidants</h3>
          <p>Vitamins C and E, selenium, and zinc protect eggs and sperm from oxidative damage. Find them in colorful fruits and vegetables, nuts, seeds, and whole grains.</p>
          
          <h3>Iron</h3>
          <p>Iron helps prevent anemia and supports ovulation. Good sources include lean red meat, spinach, beans, and fortified cereals.</p>
          
          <h2>Foods to Limit</h2>
          <ul>
            <li>Processed foods high in trans fats</li>
            <li>Excessive caffeine (limit to 200mg daily)</li>
            <li>Alcohol</li>
            <li>High-mercury fish</li>
            <li>Unpasteurized dairy products</li>
          </ul>
          
          <h2>Hydration</h2>
          <p>Proper hydration is essential for cervical mucus production and overall reproductive health. Aim for 8-10 glasses of water daily.</p>
          
          <h2>Male Nutrition for Fertility</h2>
          <p>Men should focus on zinc-rich foods (oysters, pumpkin seeds), antioxidants, and healthy fats to improve sperm quality, count, and motility.</p>
        `,
        category: 'Nutrition',
        tags: ['nutrition', 'fertility', 'conception', 'diet'],
        author: 'Dr. Michael Johnson',
      },
      {
        title: 'Understanding Sperm Health',
        content: `
          <h2>Key Factors in Sperm Health</h2>
          <p>Healthy sperm is essential for conception. The main factors affecting sperm health include:</p>
          
          <h3>Sperm Count</h3>
          <p>A normal sperm count is 15 million to 200 million sperm per milliliter of semen. Lower counts may reduce fertility but don't necessarily prevent conception.</p>
          
          <h3>Motility</h3>
          <p>Motility refers to the sperm's ability to move efficiently. At least 40% of sperm should be motile, with 32% showing progressive movement toward an egg.</p>
          
          <h3>Morphology</h3>
          <p>This refers to the size and shape of sperm. At least 4% of sperm should have a normal shape for optimal fertility.</p>
          
          <h3>Volume</h3>
          <p>A normal ejaculate volume ranges from 1.5 to 5 milliliters. Lower volumes may contain fewer total sperm.</p>
          
          <h2>Factors Affecting Sperm Health</h2>
          
          <h3>Age</h3>
          <p>While men produce sperm throughout life, quality and quantity decline with age, particularly after 40.</p>
          
          <h3>Lifestyle Factors</h3>
          <ul>
            <li><strong>Heat exposure:</strong> Frequent hot baths, saunas, or tight underwear can raise testicular temperature and reduce sperm production.</li>
            <li><strong>Smoking:</strong> Tobacco use damages sperm DNA and reduces motility.</li>
            <li><strong>Alcohol:</strong> Excessive drinking can lower testosterone and sperm production.</li>
            <li><strong>Diet:</strong> Poor nutrition affects sperm quality and hormone balance.</li>
            <li><strong>Exercise:</strong> Moderate exercise improves sperm health, but excessive exercise may temporarily reduce sperm count.</li>
            <li><strong>Stress:</strong> Chronic stress can lower testosterone and sperm production.</li>
          </ul>
          
          <h2>Improving Sperm Health</h2>
          <p>Most men can improve sperm health within 2-3 months (the time it takes to produce new sperm) by:</p>
          <ul>
            <li>Maintaining a healthy weight</li>
            <li>Eating a balanced diet rich in antioxidants</li>
            <li>Exercising moderately</li>
            <li>Managing stress</li>
            <li>Limiting alcohol and avoiding tobacco</li>
            <li>Avoiding excessive heat around the testicles</li>
            <li>Getting adequate sleep</li>
          </ul>
          
          <h2>When to Seek Help</h2>
          <p>Consider consulting a fertility specialist if you've been trying to conceive for 12 months without success (or 6 months if the female partner is over 35).</p>
        `,
        category: 'Male Health',
        tags: ['male fertility', 'sperm health', 'conception'],
        author: 'Dr. Robert Chen',
      },
    ];
    
    // Insert educational content
    for (const content of educationalContent) {
      await query(
        `INSERT INTO educational_content (title, content, category, tags, author)
         VALUES ($1, $2, $3, $4, $5)`,
        [content.title, content.content, content.category, content.tags, content.author]
      );
    }
    
    logger.info('Educational content seeded successfully');
  } catch (error) {
    logger.error('Error seeding educational content:', error);
    throw error;
  }
};

/**
 * Initialize database
 * @returns {Promise<void>}
 */
const initializeDatabase = async () => {
  try {
    // Initialize schema
    await initializeSchema();
    
    // Seed data
    await seedEducationalContent();
    
    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      logger.info('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = {
  initializeSchema,
  seedEducationalContent,
  initializeDatabase,
};
