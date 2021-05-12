DROP TABLE IF EXISTS users;
CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(500) NOT NULL, age INT NOT NULL, CONSTRAINT PK_USER PRIMARY KEY (id));
INSERT INTO users (name, age) values ('hoge', 25), ('huga', 28), ('piyo', 27);
