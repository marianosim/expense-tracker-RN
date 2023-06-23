import { FIREBASE_REALTIME_DB_URL } from '../../constants';
import {
  deleteExpenseFromDB,
  insertExpense,
  selectExpensesFromDB,
  selectSingleExpenseFromDB,
  updateExpense,
} from '../../db';
import { URL_GEOCODING } from '../../utils/maps';
import { expensesTypes } from '../types';

const {
  SELECT_EXPENSE,
  FILTER_EXPENSES,
  TOTAL_EXPENSES,
  ADD_EXPENSE,
  GET_EXPENSES,
  ADD_IMAGE_LOCATION,
  DELETE_EXPENSE,
} = expensesTypes;

export const getExpensesFromDataBase = () => {
  return async (dispatch) => {
    try {
      const dbResult = await selectExpensesFromDB();
      const expenses = dbResult?.rows?._array;
      dispatch({
        type: GET_EXPENSES,
        expenses,
      });
      const totalAmount = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
      dispatch({
        type: TOTAL_EXPENSES,
        totalAmount,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const selectExpense = (id) => ({
  type: SELECT_EXPENSE,
  expenseId: id,
});

export const filterExpenses = (id) => ({
  type: FILTER_EXPENSES,
  categoryId: id,
});

export const addExpense = ({
  title,
  amount,
  category,
  type = 'expense',
  image = '',
  address = '',
  coords = '',
  date = Date.now(),
}) => {
  return async (dispatch) => {
    try {
      const dbResult = await insertExpense(
        title,
        amount,
        category,
        type,
        image,
        address,
        coords,
        date
      );
      const dbResponse = await selectSingleExpenseFromDB();
      const [newExpense] = dbResponse?.rows?._array;
      console.log('New expense: ', newExpense);

      dispatch({
        type: ADD_EXPENSE,
        expense: newExpense,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const addExpenseImageLocation = ({
  id,
  title,
  amount,
  category,
  type,
  date,
  image,
  address,
  coords,
}) => {
  return async (dispatch) => {
    try {
      const geocodingResponse = await fetch(URL_GEOCODING(coords.lat, coords.lng));
      if (!geocodingResponse.ok) {
        throw new Error('Problem with coords!');
      }
      const geocodingData = await geocodingResponse.json();
      if (!geocodingData.results) {
        throw new Error("Address couldn't be found!");
      }
      const newAddress = geocodingData.results[0].formatted_address;

      const dbResult = await updateExpense(id, image, (address = newAddress), coords);

      // const response = await fetch(`${FIREBASE_REALTIME_DB_URL}/expenses/${id}.json`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title,
      //     amount,
      //     category,
      //     type,
      //     date,
      //     image,
      //     address: newAddress,
      //     coords,
      //   }),
      // });
      // if (!response.ok) {
      //   throw new Error('Something went wrong!');
      // }
      // const result = await response.json();

      dispatch({
        type: ADD_IMAGE_LOCATION,
        updatedExpense: dbResult,
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const totalExpenses = (expenses) => {
  const totalAmount = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
  return {
    type: TOTAL_EXPENSES,
    totalAmount,
  };
};

export const deleteExpense = (id) => {
  return async (dispatch) => {
    try {
      const dbResult = await deleteExpenseFromDB(id);
      dispatch({
        type: DELETE_EXPENSE,
        id,
      });
    } catch (error) {
      console.error(error);
    }
  };
};
