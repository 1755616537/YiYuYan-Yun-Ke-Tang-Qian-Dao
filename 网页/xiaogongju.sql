-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2020-02-12 22:57:42
-- 服务器版本： 5.5.62-log
-- PHP Version: 5.4.45

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xiaogongju`
--

-- --------------------------------------------------------

--
-- 表的结构 `userOperationRecord`
--

CREATE TABLE IF NOT EXISTS `userOperationRecord` (
  `lx` text NOT NULL COMMENT '类型',
  `xh` text NOT NULL COMMENT '学号',
  `ip` text NOT NULL COMMENT 'IP',
  `gj` text NOT NULL COMMENT '国家',
  `sf` text NOT NULL COMMENT '省份',
  `cs` text NOT NULL COMMENT '城市',
  `yys` text NOT NULL COMMENT '运营商',
  `yzbm` text NOT NULL COMMENT '邮政编码',
  `dqqh` text NOT NULL COMMENT '地区区号',
  `zcs` int(255) NOT NULL COMMENT '总次数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
