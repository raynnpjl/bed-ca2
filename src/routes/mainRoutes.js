const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const characterRoutes = require('./characterRoutes');
const petRoutes = require('./petRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const factionRoutes = require('./factionRoutes');
const marketRoutes = require('./marketRoutes');
const bossRoutes = require('./bossRoutes');
const classRoutes = require('./classRoutes');
const reviewRoutes = require('./reviewRoutes');
const bcryptRoutes = require('./bcryptRoutes');
const jwtRoutes = require('./jwtRoutes');

router.use("/users", userRoutes);
router.use("/challenges", challengeRoutes);
router.use("/characters", characterRoutes);
router.use("/pets", petRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/factions", factionRoutes);
router.use("/market", marketRoutes);
router.use("/bosses", bossRoutes);
router.use("/classes", classRoutes);
router.use("/reviews", reviewRoutes);
router.use("/bcrypt", bcryptRoutes);
router.use("/jwt", jwtRoutes);

module.exports = router;