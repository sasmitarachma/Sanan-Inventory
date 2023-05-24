-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2023 at 08:53 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sanan_dbnew`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang`
--

CREATE TABLE `tb_barang` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(50) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `barang_img` varchar(255) DEFAULT NULL,
  `harga` float NOT NULL,
  `qrcode_img` varchar(255) DEFAULT NULL,
  `expired_month` int(3) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang`
--

INSERT INTO `tb_barang` (`id`, `nama_barang`, `kategori`, `barang_img`, `harga`, `qrcode_img`, `expired_month`) VALUES
(1, 'Keripik Tempe Original', 'Produksi Sendiri', 'barang-img/1.jpg', 7500, 'qrcode-img/1.png', 3),
(2, 'keripik tempe rasa keju', 'produksi sendiri', 'barang-img/2.jpg', 7500, 'qrcode-img/02.png', 3),
(3, 'keripik tempe rasa pizza', 'produksi sendiri', 'barang-img/3.jpg', 7500, 'qrcode-img/3.png', 3),
(4, 'keripik tempe rasa barbeque', 'produksi sendiri', 'barang-img/4.jpg', 7500, 'qrcode-img/4.png', 3),
(5, 'keripik tempe rasa balado', 'produksi sendiri', 'barang-img/5.jpg', 7500, 'qrcode-img/5.png', 3),
(6, 'keripik tempe sagu', 'produksi sendiri', 'barang-img/6.jpg', 15000, 'qrcode-img/6.png', 3),
(7, 'keripik emping jagung', 'sales', 'barang-img/7.jpg', 10000, 'barang-img/7.png', 3),
(8, 'keripik buah nangka selecta (100 g)', 'sales', 'barang-img/8.jpg', 20000, 'qrcode-img/8.png', 3),
(9, 'keripik buah apel selecta (100 g)', 'sales', 'barang-img/9.jpg', 20000, 'qrcode-img/9.png', 3),
(10, 'minuman sari apel brosem', 'sales', 'barang-img/10.jpg', 35000, 'qrcode-img/10.png', 3),
(11, 'Keripik Ayam Goreng', 'Sales', 'barang-img/11.png', 10000, 'qrcode-img/11.png', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_barang`
--
ALTER TABLE `tb_barang`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_barang`
--
ALTER TABLE `tb_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
