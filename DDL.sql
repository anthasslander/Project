-- Table `hms`.`appointment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`appointment` (
  `id` INT NOT NULL,
  `date` DATE NOT NULL,
  `starttime` TIME NOT NULL,
  `endtime` TIME NOT NULL,
  `status` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `mydb`.`Lab Test`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`LabTest` (
  `Id` INT NOT NULL,
  `name` VARCHAR(30) NULL,
  `Date` DATE NULL,
  `result` TEXT NULL,
  `appointment_id` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Lab Test_appointment1_idx` (`appointment_id` ASC) ,
  CONSTRAINT `fk_Lab Test_appointment1`
    FOREIGN KEY (`appointment_id`)
    REFERENCES `hms`.`appointment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `hms`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`patient` (
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `address` VARCHAR(60) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`email`));


-- -----------------------------------------------------
-- Table `hms`.`Insurance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`Insurance` (
  `Policy_number` VARCHAR(20) NOT NULL,
  `provider` VARCHAR(30) NULL,
  `coverage_amount` DECIMAL NULL,
  `patient_email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Policy_number`),
  INDEX `fk_Insurance_patient1_idx` (`patient_email` ASC) ,
  CONSTRAINT `fk_Insurance_patient1`
    FOREIGN KEY (`patient_email`)
    REFERENCES `hms`.`patient` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `hms`.`Bill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`Bill` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `amount` DECIMAL NULL,
  `date` DATE NULL,
  `status` VARCHAR(20) NULL,
  `patient_email` VARCHAR(50) NOT NULL,
  `appointment_id` INT NOT NULL,
  `Insurance_Policy_number` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Bill_patient1_idx` (`patient_email` ASC),
  INDEX `fk_Bill_appointment1_idx` (`appointment_id` ASC),
  INDEX `fk_Bill_Insurance1_idx` (`Insurance_Policy_number` ASC),
  CONSTRAINT `fk_Bill_patient1`
    FOREIGN KEY (`patient_email`)
    REFERENCES `hms`.`patient` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_appointment1`
    FOREIGN KEY (`appointment_id`)
    REFERENCES `hms`.`appointment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) AUTO_INCREMENT=205;  -- Set the starting point for auto-increment



-- -----------------------------------------------------
-- Table `hms`.`doctor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`doctor` (
  `email` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `feeperappointment` INT NOT NULL,
  PRIMARY KEY (`email`));


-- -----------------------------------------------------
-- Table `hms`.`diagnose`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`diagnose` (
  `appt` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  `diagnosis` VARCHAR(40) NOT NULL,
  `prescription` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`appt`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `diagnose_ibfk_1`
    FOREIGN KEY (`appt`)
    REFERENCES `hms`.`appointment` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `diagnose_ibfk_2`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);



-- -----------------------------------------------------
-- Table `hms`.`schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`schedule` (
  `id` INT NOT NULL,
  `starttime` TIME NOT NULL,
  `endtime` TIME NOT NULL,
  `breaktime` TIME NOT NULL,
  `day` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`, `starttime`, `endtime`, `breaktime`, `day`));


-- -----------------------------------------------------
-- Table `hms`.`docshaveschedules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`docshaveschedules` (
  `sched` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`sched`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `docshaveschedules_ibfk_1`
    FOREIGN KEY (`sched`)
    REFERENCES `hms`.`schedule` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `docshaveschedules_ibfk_2`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);



-- -----------------------------------------------------
-- Table `hms`.`medicalhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`medicalhistory` (
  `id` INT NOT NULL,
  `date` DATE NOT NULL,
  `conditions` VARCHAR(100) NOT NULL,
  `surgeries` VARCHAR(100) NOT NULL,
  `medication` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `hms`.`doctorviewshistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`doctorviewshistory` (
  `history` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`history`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `doctorviewshistory_ibfk_1`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `doctorviewshistory_ibfk_2`
    FOREIGN KEY (`history`)
    REFERENCES `hms`.`medicalhistory` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `hms`.`patientsattendappointments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`patientsattendappointments` (
  `patient` VARCHAR(50) NOT NULL,
  `appt` INT NOT NULL,
  `concerns` VARCHAR(40) NOT NULL,
  `symptoms` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`patient`, `appt`),
  
  CONSTRAINT `patientsattendappointments_ibfk_1`
    FOREIGN KEY (`patient`)
    REFERENCES `hms`.`patient` (`email`)
    ON DELETE CASCADE,
  CONSTRAINT `patientsattendappointments_ibfk_2`
    FOREIGN KEY (`appt`)
    REFERENCES `hms`.`appointment` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `hms`.`patientsfillhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms`.`patientsfillhistory` (
  `patient` VARCHAR(50) NOT NULL,
  `history` INT NOT NULL,
  PRIMARY KEY (`history`),
  INDEX `patient` (`patient` ASC) ,
  CONSTRAINT `patientsfillhistory_ibfk_1`
    FOREIGN KEY (`patient`)
    REFERENCES `hms`.`patient` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `patientsfillhistory_ibfk_2`
    FOREIGN KEY (`history`)
    REFERENCES `hms`.`medicalhistory` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);