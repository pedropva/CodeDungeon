ALTER TABLE bosses RENAME monsters
---
ALTER TABLE `monsters` CHANGE `pmk_boss` `pmk_monster` INT(11) NOT NULL AUTO_INCREMENT;
---
ALTER TABLE `monsters` CHANGE `boss_nome` `monster_name` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `monsters` CHANGE `boss_is_ativo` `monster_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `monsters` CHANGE `boss_descricao` `monster_description` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `monsters` ADD `monster_current_room` INT NOT NULL AFTER `monster_description`;
---
ALTER TABLE `itens` CHANGE `item_nome` `item_name` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `itens` ADD `item_state` INT NOT NULL AFTER `item_name`;
---
ALTER TABLE `itens` ADD `item_current_room` INT NOT NULL AFTER `item_state`;
---
ALTER TABLE `itens` CHANGE `item_is_ativo` `item_is_active` ENUM('N','Y','YY') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `logs` CHANGE `fok_usuario` `fok_user` INT(11) NOT NULL;
---
ALTER TABLE `logs` CHANGE `log_tabela` `log_table` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `logs` CHANGE `log_descricao` `log_description` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `rooms` CHANGE `room_numero` `room_number` INT(11) NOT NULL;
---
ALTER TABLE `rooms` CHANGE `room_descricao` `room_description` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `rooms` ADD `room_state` INT NOT NULL AFTER `room_description`;
---
ALTER TABLE `rooms` CHANGE `room_is_ativo` `room_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE usuarios RENAME users
---
ALTER TABLE `users` CHANGE `pmk_usuario` `pmk_user` INT(11) NOT NULL AUTO_INCREMENT;
---
ALTER TABLE `users` CHANGE `fok_room_atual` `fok_current_room` INT(11) NOT NULL;
---
ALTER TABLE `users` CHANGE `user_usuario` `user_name` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `users` CHANGE `user_senha` `user_pass` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `users` CHANGE `user_dtCriacao` `user_dtCreated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
---
ALTER TABLE `users` CHANGE `user_is_ativo` `user_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE usuario_bosses RENAME user_monsters
---
ALTER TABLE `user_monsters` CHANGE `pmk_usuario_boss` `pmk_user_monster` INT(11) NOT NULL AUTO_INCREMENT;
---
ALTER TABLE `user_monsters` CHANGE `fok_usuario` `fok_user` INT(11) NOT NULL;
---
ALTER TABLE `user_monsters` CHANGE `fok_boss` `fok_monster` INT(11) NOT NULL;
---
ALTER TABLE `user_monsters` CHANGE `userboss_defeat` `user_monster_defeat` TINYINT(1) NOT NULL DEFAULT '0';
---
ALTER TABLE `user_monsters` ADD `user_monster_is_active` ENUM('N','Y') NOT NULL DEFAULT 'Y' AFTER `user_monster_defeat`;
---
ALTER TABLE usuario_itens RENAME user_itens
---
ALTER TABLE `user_itens` CHANGE `fok_usuario` `fok_user` INT(11) NOT NULL;
---
ALTER TABLE `user_itens` CHANGE `useritem_caught` `useritem_active` TINYINT(1) NOT NULL DEFAULT '0';
---
ALTER TABLE `user_itens` ADD `useritem_status` INT NOT NULL AFTER `useritem_active`;
---
ALTER TABLE `user_itens` CHANGE `useritem_room_drop` `useritem_current_room` INT(11) NOT NULL DEFAULT '0';
---
ALTER TABLE `user_itens` ADD `user_itens_is_active` ENUM('N','Y','YY') NOT NULL DEFAULT 'Y' AFTER `useritem_current_room`;
---
ALTER TABLE usuario_rooms RENAME user_rooms
---
ALTER TABLE `user_rooms` CHANGE `fok_usuario` `fok_user` INT(11) NOT NULL;
---
ALTER TABLE `user_rooms` ADD `userroom_status` INT NOT NULL AFTER `userroom_visited`;
---
ALTER TABLE `user_rooms` ADD `userroom_is_active` ENUM('N','Y') NOT NULL DEFAULT 'Y' AFTER `userroom_status`;

