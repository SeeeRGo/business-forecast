// import { RegularMoneMove } from "@/types";
// import { createBudgetEntriesFromMoneyMoves } from "./createBudgetEntriesFromMoneyMoves";

// // Unit tests
// describe('CreateBudgetEntriesFromMoneyMoves', () => {
//   it('should create one entry for each month between start and end dates', () => {
//     const move: RegularMoneMove = {
//       amount: 100,
//       account: 'Savings',
//       comment: 'Monthly savings',
//       start: new Date('2022-01-01'),
//       end: new Date('2022-05-01'),
//       regularity: 'monthly',
//     };
//     const entries = createBudgetEntriesFromMoneyMoves(move);
//     expect(entries.length).toBe(5);
//   });

//   it('should set correct values for each entry', () => {
//     const move: RegularMoneMove = {
//       amount: 100,
//       account: 'Savings',
//       comment: 'Monthly savings',
//       start: new Date('2022-01-01'),
//       end: new Date('2022-05-01'),
//       regularity: 'monthly',
//     };
//     const entries = createBudgetEntriesFromMoneyMoves(move);
//     expect(entries[0].income).toBe(0);
//     expect(entries[0].expense).toBe(100);
//     expect(entries[0].comment).toBe('Monthly savings');
//     expect(entries[0].account).toBe('Savings');
//     expect(entries[0].date).toEqual(new Date('2022-01-01'));
//     expect(entries[4].date).toEqual(new Date('2022-05-01'));
//   });

//   it('should generate unique IDs for each entry', () => {
//     const move: RegularMoneMove = {
//       amount: 100,
//       account: 'Savings',
//       comment: 'Monthly savings',
//       start: new Date('2022-01-01'),
//       end: new Date('2022-02-01'),
//       regularity: 'monthly',
//     };
//     const entries = createBudgetEntriesFromMoneyMoves(move);
//     const ids = entries.map((entry) => entry.id);
//     expect(ids.length).toBe(2);
//     expect(new Set(ids).size).toBe(2);
//   });
// });

export {}
