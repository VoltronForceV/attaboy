-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 01, 2013 at 10:18 AM
-- Server version: 5.5.31
-- PHP Version: 5.4.15-1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `attaboy`
--

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
CREATE TABLE IF NOT EXISTS `goals` (
  `goal_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `goal_title` varchar(128) NOT NULL,
  `goal_text` text NOT NULL,
  `rewards` text NOT NULL,
  `max_participants` int(11) NOT NULL,
  `verification_method` varchar(16) NOT NULL,
  `verification_users` int(11) NOT NULL,
  `privacy_type` varchar(16) NOT NULL,
  PRIMARY KEY (`goal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
CREATE TABLE IF NOT EXISTS `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_type` varchar(16) NOT NULL,
  `address` varchar(128) NOT NULL,
  `address2` varchar(128) NOT NULL,
  `city` varchar(64) NOT NULL,
  `state` varchar(32) NOT NULL,
  `zip` varchar(16) NOT NULL,
  `latitude` decimal(18,12) NOT NULL,
  `longitude` decimal(18,12) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE IF NOT EXISTS `participants` (
  `participant_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `goal_id` int(11) NOT NULL,
  `notes` text NOT NULL,
  PRIMARY KEY (`participant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
CREATE TABLE IF NOT EXISTS `rewards` (
  `reward_id` int(11) NOT NULL AUTO_INCREMENT,
  `goal_id` int(11) NOT NULL,
  `reward_text` varchar(256) NOT NULL,
  PRIMARY KEY (`reward_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `goal_id` int(11) NOT NULL,
  `tag_name` int(11) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `user_email` varchar(128) NOT NULL,
  `join_date` datetime NOT NULL,
  `login_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
CREATE TABLE IF NOT EXISTS `verification` (
  `verification_id` int(11) NOT NULL AUTO_INCREMENT,
  `goal_id` int(11) NOT NULL,
  `image_url` varchar(256) NOT NULL,
  `video_url` varchar(256) NOT NULL,
  `verified_by` text NOT NULL,
  `status` varchar(16) NOT NULL,
  PRIMARY KEY (`verification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
