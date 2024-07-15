// @ts-nocheck
// remove the line above if you want to use TS
// if you prefer plain JS, leave as is

export const useRefHistory = () => {
  return {
    undo: () => {},
    redo: () => {},
    history: [],
  };
};
