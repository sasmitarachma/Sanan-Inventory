-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2023 at 09:49 AM
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
(10, 'minuman sari apel brosem', 'sales', 'barang-img/10.jpg', 35000, 'qrcode-img/10.png', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang_keluar`
--

CREATE TABLE `tb_barang_keluar` (
  `id` int(11) NOT NULL,
  `id_gudang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_keluar` date NOT NULL,
  `id_barang` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang_keluar`
--

INSERT INTO `tb_barang_keluar` (`id`, `id_gudang`, `quantity`, `tanggal_keluar`, `id_barang`, `id_user`) VALUES
(2, 8, 2, '2023-05-29', 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang_masuk`
--

CREATE TABLE `tb_barang_masuk` (
  `id` int(11) NOT NULL,
  `id_gudang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_masuk` date NOT NULL,
  `id_barang` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang_masuk`
--

INSERT INTO `tb_barang_masuk` (`id`, `id_gudang`, `quantity`, `tanggal_masuk`, `id_barang`, `id_user`) VALUES
(81, 1, 12, '2023-05-18', 11, 0),
(82, 2, 30, '2023-04-21', 8, 0),
(83, 3, 11, '2023-05-21', 7, 0),
(84, 4, 90, '2023-03-21', 6, 0),
(85, 5, 2, '2023-05-22', 9, 0),
(86, 6, 32, '2023-05-23', 11, 0),
(88, 8, 12, '2023-05-29', 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `tb_gudang`
--

CREATE TABLE `tb_gudang` (
  `id` int(11) NOT NULL,
  `id_barang` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal_produksi` date NOT NULL,
  `tanggal_expired` date DEFAULT NULL,
  `gudang_qrcode` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_gudang`
--

INSERT INTO `tb_gudang` (`id`, `id_barang`, `quantity`, `tanggal_produksi`, `tanggal_expired`, `gudang_qrcode`) VALUES
(1, 11, 12, '2023-05-18', '2023-08-18', 'gudang-qr-img/1.png'),
(2, 8, 30, '2023-04-21', '2023-07-21', 'gudang-qr-img/2.png'),
(3, 7, 11, '2023-05-21', '2023-08-21', 'gudang-qr-img/3.png'),
(4, 6, 90, '2023-03-21', '2023-06-21', 'gudang-qr-img/4.png'),
(5, 9, 2, '2023-05-22', '2023-08-22', 'gudang-qr-img/5.png'),
(6, 11, 32, '2023-05-23', '2023-08-23', 'gudang-qr-img/6.png'),
(8, 10, 0, '2023-05-29', '2023-08-29', 'gudang-qr-img/8.png');

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `user_id` int(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(10) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'karyawan'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`user_id`, `username`, `password`, `role`) VALUES
(1, 'admin', 'admin123', 'admin'),
(2, 'Ridho', 'ridho123', 'karyawan');

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
  ADD KEY `idBarang` (`id_barang`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_gudang` (`id_gudang`),
  ADD KEY `idBarang` (`id_barang`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`user_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `user_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_barang_keluar`
--
ALTER TABLE `tb_barang_keluar`
  ADD CONSTRAINT `tb_barang_keluar_ibfk_1` FOREIGN KEY (`id_gudang`) REFERENCES `tb_gudang` (`id`),
  ADD CONSTRAINT `tb_barang_keluar_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`),
  ADD CONSTRAINT `tb_barang_keluar_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `tb_users` (`user_id`);

--
-- Constraints for table `tb_barang_masuk`
--
ALTER TABLE `tb_barang_masuk`
  ADD CONSTRAINT `tb_barang_masuk_ibfk_1` FOREIGN KEY (`id_gudang`) REFERENCES `tb_gudang` (`id`),
  ADD CONSTRAINT `tb_barang_masuk_ibfk_2` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`),
  ADD CONSTRAINT `tb_barang_masuk_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `tb_users` (`user_id`);

--
-- Constraints for table `tb_gudang`
--
ALTER TABLE `tb_gudang`
  ADD CONSTRAINT `tb_gudang_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
