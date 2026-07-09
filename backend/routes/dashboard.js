import express from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// @route  GET /api/dashboard/summary
// Total balance, total income, total expenses, current month spending
router.get("/summary", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [totals, monthlyExpense, monthlyIncome] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "expense",
            date: { $gte: startOfMonth, $lt: startOfNextMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            type: "income",
            date: { $gte: startOfMonth, $lt: startOfNextMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncome = totals.find((t) => t._id === "income")?.total || 0;
    const totalExpenses = totals.find((t) => t._id === "expense")?.total || 0;

    res.json({
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      monthlySpending: monthlyExpense[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/dashboard/monthly-summary?months=6
// Income vs expense totals per month for the last N months
router.get("/monthly-summary", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const months = Math.min(parseInt(req.query.months, 10) || 6, 24);

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const results = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Build a complete month-by-month series, even for months with no data
    const series = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const income =
        results.find((r) => r._id.year === year && r._id.month === month && r._id.type === "income")
          ?.total || 0;
      const expense =
        results.find((r) => r._id.year === year && r._id.month === month && r._id.type === "expense")
          ?.total || 0;
      series.push({
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        year,
        month,
        income,
        expense,
      });
    }

    res.json({ series });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/dashboard/category-summary?type=expense
router.get("/category-summary", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const type = req.query.type === "income" ? "income" : "expense";

    const results = await Transaction.aggregate([
      { $match: { user: userId, type } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      categories: results.map((r) => ({
        category: r._id,
        total: r.total,
        count: r.count,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/dashboard/recent?limit=5
router.get("/recent", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
    const transactions = await Transaction.find({ user: req.user._id })
      .sort("-date -createdAt")
      .limit(limit);
    res.json({ transactions });
  } catch (err) {
    next(err);
  }
});

export default router;
