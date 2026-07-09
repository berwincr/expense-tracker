import express from "express";
import { body, validationResult } from "express-validator";
import Transaction, { CATEGORIES } from "../models/Transaction.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const transactionRules = [
  body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
  body("category").isIn(CATEGORIES).withMessage("Invalid category"),
  body("description").optional().trim().isLength({ max: 200 }),
  body("date").optional().isISO8601().withMessage("Date must be a valid date"),
];

// @route  GET /api/transactions
// Supports: search, category, type, startDate, endDate, page, limit, sort
router.get("/", async (req, res, next) => {
  try {
    const {
      search,
      category,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sort = "-date",
    } = req.query;

    const query = { user: req.user._id };

    if (category && category !== "All") query.category = category;
    if (type && type !== "All") query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Transaction.countDocuments(query),
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/transactions/:id
router.get("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/transactions
router.post("/", transactionRules, validate, async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    });
    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
});

// @route  PUT /api/transactions/:id
router.put("/:id", transactionRules, validate, async (req, res, next) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { type, amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ transaction });
  } catch (err) {
    next(err);
  }
});

// @route  DELETE /api/transactions/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
