CREATE TABLE card_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE card_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  preview_image VARCHAR(255),
  partial_file VARCHAR(255) NOT NULL,
  editable_fields JSON,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES card_categories(id)
);

CREATE TABLE generated_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT NOT NULL,
  user_data JSON,
  output_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES card_templates(id)
);
