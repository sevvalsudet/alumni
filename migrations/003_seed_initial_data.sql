-- ========================================================
-- Migration: 003_seed_initial_data.sql
-- Description: Seeds 25 users and 10 announcements into MySQL
-- ========================================================

-- Insert seeded users
INSERT INTO users (id, name, email, role, department, company)
VALUES 
    (1, "Şevval Sude", "sevvalsude@alumni.edu", "Student", "Computer Engineering", NULL),
    (2, "Sude Top", "sude@alumni.edu", "Alumni", "Computer Engineering", "Google"),
    (3, "Şevval Çelik", "sevval@alumni.edu", "Alumni", "Software Engineering", "Microsoft"),
    (4, "Kelvin Jacobson", "kelvin.jacobson@gmail.com", "Admin", "Electrical & Electronics Engineering", "Spotify"),
    (5, "Ena Stracke", "ena_stracke94@gmail.com", "Alumni", "Software Engineering", "Amazon"),
    (6, "Kaci Armstrong", "kaci.armstrong27@yahoo.com", "Student", "Industrial Engineering", NULL),
    (7, "Rahul McDermott", "rahul_mcdermott46@gmail.com", "Admin", "Computer Engineering", "Amazon"),
    (8, "Cedric Muller", "cedric.muller51@hotmail.com", "Student", "Software Engineering", NULL),
    (9, "Danny Weimann", "danny_weimann28@yahoo.com", "Alumni", "Mechanical Engineering", "Netflix"),
    (10, "Larry Bauch", "larry.bauch24@gmail.com", "Student", "Electrical & Electronics Engineering", NULL),
    (11, "Virgil McGlynn", "virgil.mcglynn@gmail.com", "Admin", "Mechanical Engineering", "Amazon"),
    (12, "Marquis Kohler", "marquis.kohler68@gmail.com", "Admin", "Industrial Engineering", "Netflix"),
    (13, "Dewayne Spencer", "dewayne.spencer@gmail.com", "Admin", "Management Information Systems", "Netflix"),
    (14, "Reynold Cronin", "reynold_cronin@gmail.com", "Student", "Electrical & Electronics Engineering", NULL),
    (15, "Keyon Beatty", "keyon.beatty@yahoo.com", "Student", "Computer Engineering", NULL),
    (16, "Alicia Will", "alicia.will93@gmail.com", "Student", "Management Information Systems", NULL),
    (17, "Jordan Rogahn", "jordan.rogahn21@yahoo.com", "Admin", "Computer Engineering", "Meta"),
    (18, "Alva Crona", "alva_crona@hotmail.com", "Alumni", "Mechanical Engineering", "Trendyol"),
    (19, "Flossie Shields", "flossie_shields@hotmail.com", "Alumni", "Computer Engineering", "Google"),
    (20, "Obie Conn", "obie_conn@yahoo.com", "Alumni", "Mechanical Engineering", "Microsoft"),
    (21, "Leone Carter", "leone_carter58@gmail.com", "Admin", "Management Information Systems", "Netflix"),
    (22, "Leopoldo Skiles", "leopoldo.skiles@hotmail.com", "Admin", "Mechanical Engineering", "Apple"),
    (23, "Dulce Berge", "dulce.berge@yahoo.com", "Student", "Software Engineering", NULL),
    (24, "Irene Jakubowski", "irene.jakubowski59@gmail.com", "Admin", "Management Information Systems", "Getir"),
    (25, "Griffin Stroman", "griffin_stroman@gmail.com", "Student", "Computer Engineering", NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company);

-- Insert seeded announcements
INSERT INTO announcements (id, author_id, title, content, category, date, priority)
VALUES 
    (1, 1, "New AI & Cloud Computing Lab Opening - April", "We are thrilled to unveil our cutting-edge AI and distributed computing research facility. Degero cubicularis cubitum. Usus deripio degusto aureus.", "Academic", "2026-10-04", "High"),
    (2, 1, "Tech Mentorship Program Applications Open - January", "Experienced graduates are inviting active students to apply for 1-on-1 career mentorship. Desidero cras dignissimos tener cruciamentum cresco territo voluntarius vilitas. Asporto bestia totus quos unde suasoria.", "Career", "2026-09-19", "Urgent"),
    (3, 1, "Annual Alumni Networking Summit - February", "Join us for an evening of networking, panel discussions, and reuniting with former classmates. Derelinquo calamitas deludo varius averto amor vomica apto. Comitatus titulus ars.", "Event", "2026-09-23", "Urgent"),
    (4, 1, "New AI & Cloud Computing Lab Opening - November", "We are thrilled to unveil our cutting-edge AI and distributed computing research facility. Voluptatum adversus casus cunae coniecto aperiam cetera conventus. Aegrus asperiores cruentus denique administratio sortitus quidem suasoria.", "Academic", "2026-10-01", "High"),
    (5, 1, "Campus Career Fair & On-site Interviews - October", "Top global tech organizations will conduct preliminary interviews with graduating seniors. Desipio voluptatum admoneo. Summopere ratione velut spoliatio adfero cito ater aestas.", "Career", "2026-10-05", "Normal"),
    (6, 1, "Campus Career Fair & On-site Interviews - October", "Top global tech organizations will conduct preliminary interviews with graduating seniors. Attollo vigilo cognatus admoneo tres victus suffoco. Aequus vomica victoria considero solus usus candidus angelus compello bos.", "Career", "2026-09-23", "Low"),
    (7, 1, "Annual Alumni Networking Summit - January", "Join us for an evening of networking, panel discussions, and reuniting with former classmates. Depromo trepide talis tres conservo ustilo. Dolorem aduro volutabrum vitiosus.", "Event", "2026-09-15", "High"),
    (8, 1, "Tech Mentorship Program Applications Open - June", "Experienced graduates are inviting active students to apply for 1-on-1 career mentorship. Annus vulgivagus iusto. Assentator ulterius spero celo.", "Career", "2026-10-02", "Low"),
    (9, 1, "Tech Mentorship Program Applications Open - February", "Experienced graduates are inviting active students to apply for 1-on-1 career mentorship. Culpa antiquus sperno tamquam adflicto convoco apostolus. Demens vapulus amplus alo contigo laboriosam bellum avarus angelus adduco.", "Career", "2026-10-02", "Normal"),
    (10, 1, "Graduate Fellowship Fund Announced - October", "Applications are now open for the 2026 Academic Excellence Fellowship Program. Adeptio suggero cariosus tabgo vulgus tamen creator viscus desolo capitulus. Suscipit advenio tempora sufficio solutio baiulus.", "Scholarship", "2026-09-19", "Urgent")
ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content);
