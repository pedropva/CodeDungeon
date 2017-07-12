ALTER TABLE `user_monsters` CHANGE `pmk_user_monster` `pmk_usermonster` INT(11) NOT NULL AUTO_INCREMENT;
---
ALTER TABLE `user_monsters` CHANGE `user_monster_state` `usermonster_state` TINYINT(1) NOT NULL DEFAULT '0';
---
ALTER TABLE `user_monsters` CHANGE `user_monster_active` `usermonster_active` ENUM('N','Y','YY') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `user_monsters` CHANGE `user_monster_is_active` `usermonster_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';
---
ALTER TABLE `user_monsters` CHANGE `user_monster_current_room` `usermonster_current_room` INT(11) NOT NULL;
---
ALTER TABLE `user_itens` CHANGE `user_item_state` `useritem_state` INT(11) NOT NULL;
---
ALTER TABLE `user_itens` CHANGE `user_item_active` `useritem_active` ENUM('N','Y','YY') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y', CHANGE `user_item_is_active` `useritem_is_active` ENUM('N','Y') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Y';