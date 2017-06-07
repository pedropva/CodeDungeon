ALTER TABLE bosses RENAME monsters
---
ALTER TABLE `monsters` CHANGE `pmk_boss` `pmk_monster` INT(11) NOT NULL AUTO_INCREMENT;
---
ALTER TABLE `monsters` CHANGE `boss_nome` `monster_name` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `monsters` CHANGE `boss_is_ativo` `monster_is_active` ENUM('Nao','Sim') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Sim';
---
ALTER TABLE `monsters` CHANGE `boss_descricao` `monster_description` VARCHAR(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `user_monsters` ADD `user_monster_is_active` ENUM('N','Y') NOT NULL DEFAULT 'Y' AFTER `user_monster_defeat`;
---
ALTER TABLE `monsters` ADD `monster_current_room` INT NOT NULL AFTER `monster_description`;
---
ALTER TABLE `itens` CHANGE `item_nome` `item_name` VARCHAR(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL;
---
ALTER TABLE `itens` ADD `item_state` INT NOT NULL AFTER `item_name`;
---
ALTER TABLE `itens` ADD `item_current_room` INT NOT NULL AFTER `item_state`;
---
ALTER TABLE `itens` CHANGE `item_is_ativo` `item_is_active` ENUM('Nao','Sim') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Sim';
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
ALTER TABLE `rooms` CHANGE `room_is_ativo` `room_is_active` ENUM('Nao','Sim') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Sim';
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
ALTER TABLE `users` CHANGE `user_is_ativo` `user_is_active` ENUM('Nao','Sim') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Sim';
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
ALTER TABLE `user_itens` ADD `user_itens_is_active` ENUM('N','Y') NOT NULL DEFAULT 'Y' AFTER `useritem_current_room`;
---
ALTER TABLE usuario_rooms RENAME user_rooms
---
ALTER TABLE `user_rooms` CHANGE `fok_usuario` `fok_user` INT(11) NOT NULL;
---
ALTER TABLE `user_rooms` ADD `userroom_status` INT NOT NULL AFTER `userroom_visited`;
---
ALTER TABLE `user_rooms` ADD `userroom_is_active` ENUM('N','Y') NOT NULL DEFAULT 'Y' AFTER `userroom_status`;
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (1,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (2,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (3,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (4,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (5,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (6,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (7,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (8,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (9,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (10,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (11,1);
---
INSERT INTO rooms (`room_number`,`room_state`) VALUES (12,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('chave','Y',12,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('bau','YN',5,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('imprimir','Y',1,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('alerta','N',1,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('ler','Y',3,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('se','Y',5,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('matematica','Y',7,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('repetir','Y',9,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('enquanto','Y',11,1);
---
INSERT INTO itens (`item_name`,`item_is_active`,`item_current_room`,`item_state`) VALUES ('contar','Y',11,1);
---
INSERT INTO monsters (`monster_name`,`monster_is_active`,`monster_current_room`) VALUES ('esqueleto 0','Y',2);
---
INSERT INTO monsters (`monster_name`,`monster_is_active`,`monster_current_room`) VALUES ('esqueleto 1','Y',4);
---
INSERT INTO monsters (`monster_name`,`monster_is_active`,`monster_current_room`) VALUES ('esqueleto 2','Y',6);
---
INSERT INTO monsters (`monster_name`,`monster_is_active`,`monster_current_room`) VALUES ('esqueleto 3','Y',8);
---
INSERT INTO monsters (`monster_name`,`monster_is_active`,`monster_current_room`) VALUES ('esqueleto 1','Y',10);

								
