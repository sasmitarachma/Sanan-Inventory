-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2023 at 06:20 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang_keluar`
--

CREATE TABLE `tb_barang_keluar` (
  `id` int(11) NOT NULL,
  `id_gudang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_keluar` date NOT NULL,
  `id_barang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang_keluar`
--

INSERT INTO `tb_barang_keluar` (`id`, `id_gudang`, `quantity`, `tanggal_keluar`, `id_barang`) VALUES
(19, 27, 10, '2023-04-12', 1),
(20, 28, 12, '2023-04-12', 2),
(21, 29, 9, '2023-04-12', 3),
(22, 30, 4, '2023-04-12', 4),
(23, 31, 7, '2023-04-12', 5),
(24, 32, 10, '2023-04-12', 6),
(25, 33, 3, '2023-04-12', 7),
(26, 34, 3, '2023-04-12', 8),
(27, 35, 4, '2023-04-12', 9),
(28, 36, 18, '2023-04-12', 10);

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang_masuk`
--

CREATE TABLE `tb_barang_masuk` (
  `id` int(11) NOT NULL,
  `id_gudang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `id_barang` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang_masuk`
--

INSERT INTO `tb_barang_masuk` (`id`, `id_gudang`, `quantity`, `tanggal_masuk`, `id_barang`) VALUES
(39, 27, 30, '2023-04-10', 1),
(40, 28, 30, '2023-04-10', 2),
(41, 29, 30, '2023-04-10', 3),
(42, 30, 30, '2023-04-10', 4),
(43, 31, 30, '2023-04-10', 5),
(44, 32, 15, '2023-04-10', 6),
(45, 33, 10, '2023-04-10', 7),
(46, 34, 20, '2023-04-10', 8),
(47, 35, 20, '2023-04-10', 9),
(48, 36, 50, '2023-04-10', 10),
(49, 37, 10, '2023-04-13', 11);

-- --------------------------------------------------------

--
-- Table structure for table `tb_gudang`
--

CREATE TABLE `tb_gudang` (
  `id` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_produksi` date NOT NULL,
  `tanggal_expired` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_gudang`
--

INSERT INTO `tb_gudang` (`id`, `id_barang`, `quantity`, `tanggal_produksi`, `tanggal_expired`) VALUES
(27, 1, 60, '2023-04-01', '2023-07-12'),
(28, 2, 30, '2023-04-01', '2023-07-12'),
(29, 3, 30, '2023-04-01', '2023-07-12'),
(30, 4, 30, '2023-04-01', '2023-07-12'),
(31, 5, 20, '2023-04-01', '2023-07-12'),
(32, 6, 30, '2023-04-02', '2023-06-20'),
(33, 7, 20, '2023-03-31', '2023-07-10'),
(34, 8, 50, '2023-04-03', '2023-09-01'),
(35, 9, 30, '2023-04-02', '2023-09-01'),
(36, 10, 230, '2023-04-02', '2023-08-01'),
(37, 11, 10, '2023-04-13', '2023-07-13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_barang`
--
ALTER TABLE `tb_barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_barang_keluar`
--
ALTER TABLE `tb_barang_keluar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_gudang` (`id_gudang`),
  ADD KEY `idBarang` (`id_barang`);

--
-- Indexes for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_gudang` (`id_gudang`),
  ADD KEY `idBarang` (`id_barang`);

--
-- Indexes for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_barang`
--
ALTER TABLE `tb_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tb_barang_keluar`
--
ALTER TABLE `tb_barang_keluar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_barang_keluar`
--
ALTER TABLE `tb_barang_keluar`
  ADD CONSTRAINT `tb_barang_keluar_ibfk_1` FOREIGN KEY (`id_gudang`) REFERENCES `tb_gudang` (`id`),
  ADD CONSTRAINT `tb_barang_keluar_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`);

--
-- Constraints for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  ADD CONSTRAINT `tb_barang_masuk_ibfk_1` FOREIGN KEY (`id_gudang`) REFERENCES `tb_gudang` (`id`),
  ADD CONSTRAINT `tb_barang_masuk_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`);

--
-- Constraints for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  ADD CONSTRAINT `tb_gudang_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
