ALTER TABLE `itens` DROP `fok_room`;
---
ALTER TABLE `logs` ADD `log_date` TIMESTAMP NOT NULL AFTER `log_description`;
---
ALTER TABLE `monsters` DROP `fok_room`;