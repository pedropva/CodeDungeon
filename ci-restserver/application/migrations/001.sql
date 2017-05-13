CREATE TABLE IF NOT EXISTS `bosses` (
  `pmk_boss` int(11) NOT NULL AUTO_INCREMENT,
  `fok_room` int(11) NOT NULL,
  `boss_nome` varchar(100) NOT NULL,
  `boss_descricao` varchar(255) NOT NULL,
  `boss_is_ativo` enum('Nao','Sim') NOT NULL DEFAULT 'Sim',
  PRIMARY KEY (`pmk_boss`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `itens` (
  `pmk_item` int(11) NOT NULL AUTO_INCREMENT,
  `fok_room` int(11) NOT NULL,
  `item_nome` varchar(100) NOT NULL,
  `item_descricao` varchar(255) NOT NULL,
  `item_is_ativo` enum('Nao','Sim') NOT NULL DEFAULT 'Sim',
  PRIMARY KEY (`pmk_item`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `logs` (
  `pmk_log` int(11) NOT NULL AUTO_INCREMENT,
  `fok_usuario` int(11) NOT NULL,
  `log_tabela` varchar(100) NOT NULL,
  `log_descricao` text NOT NULL,
  PRIMARY KEY (`pmk_log`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `rooms` (
  `pmk_room` int(11) NOT NULL AUTO_INCREMENT,
  `room_numero` int(11) NOT NULL,
  `room_descricao` varchar(255) NOT NULL,
  `room_is_ativo` enum('Nao','Sim') NOT NULL DEFAULT 'Sim',
  PRIMARY KEY (`pmk_room`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `usuarios` (
  `pmk_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `fok_room_atual` int(11) NOT NULL,
  `user_usuario` varchar(100) NOT NULL,
  `user_senha` varchar(255) NOT NULL,
  `user_dtCriacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_is_ativo` enum('Nao','Sim') NOT NULL DEFAULT 'Sim',
  PRIMARY KEY (`pmk_usuario`),
  UNIQUE KEY `user_usuario` (`user_usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `usuario_bosses` (
  `pmk_usuario_boss` int(11) NOT NULL AUTO_INCREMENT,
  `fok_usuario` int(11) NOT NULL,
  `fok_boss` int(11) NOT NULL,
  `userboss_defeat` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_usuario_boss`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `usuario_itens` (
  `pmk_useritem` int(11) NOT NULL AUTO_INCREMENT,
  `fok_usuario` int(11) NOT NULL,
  `fok_item` int(11) NOT NULL,
  `useritem_caught` tinyint(1) NOT NULL DEFAULT '0',
  `useritem_room_drop` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_useritem`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
---
CREATE TABLE IF NOT EXISTS `usuario_rooms` (
  `pmk_userroom` int(11) NOT NULL AUTO_INCREMENT,
  `fok_usuario` int(11) NOT NULL,
  `fok_room` int(11) NOT NULL,
  `userroom_visited` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`pmk_userroom`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;