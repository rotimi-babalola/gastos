import mongoose from 'mongoose';

const { Schema } = mongoose;

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['FOOD',
      'TRANSPORT',
      'ENTERTAINMENT',
      'TRAVEL',
      'HEALTH CARE',
      'UTILITIES',
      'MISCELLANEOUS',
    ],
    required: true,
    default: 'MISCELLANEOUS',
  },
  nameLower: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'No amount duh 🙄 '],
  },
},
  {
    timestamps: true,
  }
);

ExpenseSchema.pre('save', function (next) {
  this.nameLower = this.name.toLowerCase();
  next();
});

ExpenseSchema.statics.findOneOrCreate = function (expense) {
  const self = this;
  return new Promise((resolve, reject) => {
    self.findOne({ nameLower: expense.name.toLowerCase() }, (error, result) => {
      if (error) {
        return reject(error);
      }
      if (result) {
        // update amount
        result.amount += expense.amount;
        result.save();
        return resolve({
          result,
          isOldExpense: true,
        });
      } else {
        self.create(expense, (err, newExpense) => {
          if (err) {
            return reject(err);
          }
          resolve(newExpense);
        });
      }
    });
  });
};

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;
