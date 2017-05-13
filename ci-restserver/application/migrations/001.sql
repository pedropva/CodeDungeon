CREATE TABLE IF NOT EXISTS `monsters` (
  `pmk_monster` int(11) NOT NULL AUTO_INCREMENT,
  `fok_room` int(11) NOT NULL,
  `monster_name` varchar(100) NOT NULL,
  `monster_is_active` enum('N','Y') NOT NULL DEFAULT 'Y',
  `monster_current_room` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_monster`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `itens` (
  `pmk_item` int(11) NOT NULL AUTO_INCREMENT,
  `fok_room` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_state` int(11) NOT NULL,
  `item_current_room` int(11) NOT NULL DEFAULT '0',
  `item_is_active` enum('N','Y') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`pmk_item`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `logs` (
  `pmk_log` int(11) NOT NULL AUTO_INCREMENT,
  `fok_user` int(11) NOT NULL,
  `log_table` varchar(100) NOT NULL,
  `log_description` text NOT NULL,
  PRIMARY KEY (`pmk_log`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `rooms` (
  `pmk_room` int(11) NOT NULL AUTO_INCREMENT,
  `room_number` int(11) NOT NULL,
  `room_state` int(11) NOT NULL,
  `room_is_active` enum('N','Y') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`pmk_room`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `users` (
  `pmk_user` int(11) NOT NULL AUTO_INCREMENT,
  `fok_current_room` int(11) NOT NULL DEFAULT '0',
  `user_name` varchar(100) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `user_dtCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_is_active` enum('N','Y') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`pmk_user`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `user_monsters` (
  `pmk_user_monster` int(11) NOT NULL AUTO_INCREMENT,
  `fok_user` int(11) NOT NULL,
  `fok_monster` int(11) NOT NULL,
  `user_monster_defeat` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_user_monster`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `user_itens` (
  `pmk_useritem` int(11) NOT NULL AUTO_INCREMENT,
  `fok_user` int(11) NOT NULL,
  `fok_item` int(11) NOT NULL,
  `useritem_active` tinyint(1) NOT NULL DEFAULT '0',
  `useritem_status` int(11) NOT NULL,
  `useritem_current_room_` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_useritem`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `user_rooms` (
  `pmk_userroom` int(11) NOT NULL AUTO_INCREMENT,
  `fok_user` int(11) NOT NULL,
  `fok_room` int(11) NOT NULL,
  `userroom_visited` tinyint(1) NOT NULL DEFAULT '0',
  `userroom_status` int(11) NOT NULL,
  PRIMARY KEY (`pmk_userroom`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
INSERT INTO 'rooms' ('room_number','room_state') VALUES (1,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (2,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (3,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (4,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (5,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (6,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (7,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (8,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (9,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (10,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (11,1);
INSERT INTO 'rooms' ('room_number','room_state') VALUES (12,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('chave','Y',12,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('bau','YN',5,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('imprimir','Y',1,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('alerta','Y',1,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('ler','Y',3,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('se','Y',5,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('matematica','Y',7,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('repetir','Y',9,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('enquanto','Y',11,1);
INSERT INTO 'itens' ('item_name','item_is_active','item_current_room','item_state') VALUES ('contar','Y',11,1);
INSERT INTO 'monsters' ('monster_name','monster_is_active','monster_current_room') VALUES ('esqueleto 0','Y',2);
INSERT INTO 'monsters' ('monster_name','monster_is_active','monster_current_room') VALUES ('esqueleto 1','Y',4);
INSERT INTO 'monsters' ('monster_name','monster_is_active','monster_current_room') VALUES ('esqueleto 2','Y',6);
INSERT INTO 'monsters' ('monster_name','monster_is_active','monster_current_room') VALUES ('esqueleto 3','Y',8);
INSERT INTO 'monsters' ('monster_name','monster_is_active','monster_current_room') VALUES ('esqueleto 1','Y',10);

								
