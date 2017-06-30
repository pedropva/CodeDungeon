ALTER TABLE `monsters` CHANGE `monster_is_active` `monster_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `itens` CHANGE `item_is_active` `item_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `itens` ADD `item_active` ENUM('N','Y','YY') NOT NULL DEFAULT 'Y' AFTER `item_state`;
---
ALTER TABLE `user_monsters` CHANGE `user_monster_defeat` `user_monster_state` TINYINT(1) NOT NULL DEFAULT '0';
---
ALTER TABLE `user_monsters` ADD `user_monster_active` ENUM('N','Y','YY') NOT NULL DEFAULT 'Y' AFTER `user_monster_state`;
---
ALTER TABLE `user_itens` CHANGE `useritem_status` `useritem_state` INT NOT NULL AFTER `useritem_active`;
--
ALTER TABLE `user_itens` CHANGE `user_item_is_active` `user_item_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `user_itens` ADD `user_item_active` ENUM('N','Y','YY') NOT NULL DEFAULT 'Y' AFTER `user_item_state`;
---
ALTER TABLE `user_rooms` CHANGE `userroom_status` `userroom_state` INT NOT NULL AFTER `userroom_visited`;
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
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('chave','Y',12,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('bau','YY',5,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('imprimir','Y',1,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('alerta','N',1,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('ler','Y',3,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('se','Y',5,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('matematica','Y',7,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('repetir','Y',9,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('enquanto','Y',11,1);
---
INSERT INTO itens (`item_name`,`item_active`,`item_current_room`,`item_state`) VALUES ('contar','Y',11,1);
---
INSERT INTO monsters (`monster_name`,`monster_active`,`monster_current_room`,`monster_state`) VALUES ('esqueleto 0','Y',2,1);
---
INSERT INTO monsters (`monster_name`,`monster_active`,`monster_current_room`,`monster_state`) VALUES ('esqueleto 1','Y',4,1);
---
INSERT INTO monsters (`monster_name`,`monster_active`,`monster_current_room`,`monster_state`) VALUES ('esqueleto 2','Y',6,1);
---
INSERT INTO monsters (`monster_name`,`monster_active`,`monster_current_room`,`monster_state`) VALUES ('esqueleto 3','Y',8,1);
---
INSERT INTO monsters (`monster_name`,`monster_active`,`monster_current_room`,`monster_state`) VALUES ('esqueleto 4','Y',10,1);

								
