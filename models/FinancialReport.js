const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema({
  totalRevenue: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  totalFines: { type: Number, default: 0 },
  pendingFines: { type: Number, default: 0 },
  totalRecords: { type: Number, default: 0 },
  paidRecords: { type: Number, default: 0 },
  pendingRecords: { type: Number, default: 0 },
  overdueRecords: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('FinancialReport', financialReportSchema);















