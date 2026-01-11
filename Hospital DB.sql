

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('admin','reception','doctor') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
);


CREATE TABLE `specializations` (
  `specialization_id` int NOT NULL AUTO_INCREMENT,
  `specialization_name` varchar(100) NOT NULL,
  PRIMARY KEY (`specialization_id`),
  UNIQUE KEY `specialization_name` (`specialization_name`)
);



CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_contact` varchar(15) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
);


CREATE TABLE `doctor` (
  `doctor_id` int NOT NULL AUTO_INCREMENT,
  `doctor_name` varchar(100) DEFAULT NULL,
  `doctor_contact` varchar(15) DEFAULT NULL,
  `doctor_experience` int DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `doctor_email` varchar(100) NOT NULL,
  `doctor_image` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `doctor_specialization` int DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  KEY `fk_doctor_specialization` (`doctor_specialization`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `doctor_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `fk_doctor_specialization` FOREIGN KEY (`doctor_specialization`) REFERENCES `specializations` (`specialization_id`)
);






CREATE TABLE `medicines` (
  `medicine_id` int NOT NULL AUTO_INCREMENT,
  `medicine_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`medicine_id`)
);


CREATE TABLE `nurses` (
  `nurse_id` int NOT NULL AUTO_INCREMENT,
  `nurse_name` varchar(100) DEFAULT NULL,
  `nurse_contact` varchar(15) DEFAULT NULL,
  `nurse_shift` enum('Morning','Evening','Night') DEFAULT NULL,
  PRIMARY KEY (`nurse_id`)
);


CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) NOT NULL,
  `patient_age` int DEFAULT NULL,
  `patient_gender` enum('Male','Female','Other') DEFAULT NULL,
  `patient_contact` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`patient_id`)
);



CREATE TABLE `rooms` (
  `room_no` int NOT NULL,
  `room_type` enum('General','Semi-Private','Private','ICU') DEFAULT NULL,
  `room_status` enum('Available','Occupied') DEFAULT NULL,
  `charges_per_day` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`room_no`)
);







CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` datetime NOT NULL,
  `status` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  `patient_issue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT
);




CREATE TABLE `admissions` (
  `admission_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `nurse_id` int DEFAULT NULL,
  `room_no` int DEFAULT NULL,
  `admitted_date` datetime NOT NULL,
  `discharge_date` datetime DEFAULT NULL,
  `status` enum('Admitted','Discharged') DEFAULT 'Admitted',
  `icu_required` tinyint(1) DEFAULT '0',
  `appointment_id` int NOT NULL,
  PRIMARY KEY (`admission_id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `nurse_id` (`nurse_id`),
  KEY `room_no` (`room_no`),
  KEY `fk_admissions_appointment` (`appointment_id`),
  CONSTRAINT `admissions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `admissions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`) ON DELETE RESTRICT,
  CONSTRAINT `admissions_ibfk_3` FOREIGN KEY (`nurse_id`) REFERENCES `nurses` (`nurse_id`) ON DELETE SET NULL,
  CONSTRAINT `admissions_ibfk_4` FOREIGN KEY (`room_no`) REFERENCES `rooms` (`room_no`) ON DELETE SET NULL,
  CONSTRAINT `fk_admissions_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`)
);

CREATE TABLE `bill` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `room_charges` decimal(10,2) DEFAULT NULL,
  `treatment_charges` decimal(10,2) DEFAULT NULL,
  `nurse_charges` decimal(10,2) DEFAULT NULL,
  `medicine_charges` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `billing_date` date DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `bill_ibfk_1` (`patient_id`),
  CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`)
);


CREATE TABLE `prescriptions` (
  `prescription_id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int NOT NULL,
  `medicine_id` int NOT NULL,
  `quantity` int NOT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `patient_id` int NOT NULL,
  PRIMARY KEY (`prescription_id`),
  KEY `appointment_id` (`appointment_id`),
  KEY `medicine_id` (`medicine_id`),
  KEY `fk_prescriptions_patient` (`patient_id`),
  CONSTRAINT `fk_prescriptions_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE,
  CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`medicine_id`) ON DELETE RESTRICT
);


CREATE TABLE `reception` (
  `reception_id` int NOT NULL AUTO_INCREMENT,
  `reception_name` varchar(100) DEFAULT NULL,
  `reception_contact` varchar(15) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `reception_image` varchar(255) DEFAULT NULL,
  `reception_email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`reception_id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `reception_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reception_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`)
);




INSERT INTO `users` VALUES (1,'admin','$2b$10$vkl3vWCNvrdTUXIfCBqlIOjVk9BKGV57Zn8tOIZvpg/u6jqLLBGEW','admin');


INSERT INTO `medsys`.`admin`
(`admin_id`,
`admin_contact`,
`user_id`)
VALUES
(1,1111111111,1);


INSERT INTO `specializations` VALUES (1,'Cardiology'),
(2,'Neurology'),
(3,'Pediatrics'),
(4,'Orthopedics'),
(5,'Dermatology'),
(6,'Oncology'),
(7,'Psychiatry'),
(8,'Ophthalmology'),
(9,'Gastroenterology'),
(10,'Endocrinology');