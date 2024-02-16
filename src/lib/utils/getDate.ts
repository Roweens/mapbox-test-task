export const getDateDDMMYYYY = () => {
    return new Date(Date.now()).toLocaleString().split(',')[0];
};
