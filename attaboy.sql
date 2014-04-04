-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 01, 2013 at 04:31 PM
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
  `date` datetime NOT NULL,
  `duration` int(11) NOT NULL,
  `goal_title` varchar(128) NOT NULL,
  `goal_text` text NOT NULL,
  `reward` text NOT NULL,
  `max_participants` int(11) NOT NULL,
  `verification_method` varchar(16) NOT NULL,
  `verification_users` int(11) NOT NULL,
  `visibility` varchar(16) NOT NULL,
  PRIMARY KEY (`goal_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`goal_id`, `user_id`, `parent_id`, `location_id`, `date`, `duration`, `goal_title`, `goal_text`, `reward`, `max_participants`, `verification_method`, `verification_users`, `visibility`) VALUES
(1, 0, 0, 0, '0000-00-00 00:00:00', 2013, 'HELLO WORLD!', 'This isn''t sample data, it''s a prophecy.', '', 5, '3rd Party', 3, 'Public'),
(2, 0, 0, 0, '0000-00-00 00:00:00', 2013, 'Win the Hackathon', 'This isn''t sample data, it''s a prophecy.', '', 5, '3rd Party', 3, 'Public'),
(3, 0, 0, 0, '0000-00-00 00:00:00', 2013, 'Win the Hackathon', 'This isn''t sample data, it''s a prophecy.', '', 5, '3rd Party', 3, 'Public'),
(4, 0, 0, 0, '0000-00-00 00:00:00', 2013, 'Win the Hackathon', 'This isn''t sample data, it''s a prophecy.', '', 5, '3rd Party', 3, 'Public'),
(5, 0, 0, 0, '0000-00-00 00:00:00', 2013, 'Win the Hackathon', 'This isn''t sample data, it''s a prophecy.', '', 5, '3rd Party', 3, 'Public');

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
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `goal_id` int(11) NOT NULL,
  `action` varchar(16) NOT NULL,
  `result` text NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`transaction_id`)
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `location_id`, `user_name`, `user_email`, `join_date`, `login_date`) VALUES
(1, 0, 'rachel', 'abc@gmail.com', '2013-06-01 16:25:53', '0000-00-00 00:00:00'),
(2, 0, 'devnill', 'xyz@gmail.com', '2013-06-01 16:26:49', '0000-00-00 00:00:00'),
(3, 0, 'AtomicFiredoll', 'meh@usebombs.com', '2013-06-01 16:28:47', '0000-00-00 00:00:00'),
(4, 0, 'Alan', '123@gmail.com', '2013-06-01 16:30:23', '0000-00-00 00:00:00'),
(5, 0, 'Jazimus', 'bbs@gmail.com', '2013-06-01 16:30:46', '0000-00-00 00:00:00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
