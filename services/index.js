const db = require('../db/models/index');
const { Op } = require("sequelize");


const getBirthday = async () => {
    try {
        const result = await db.sso_employees.findAll({
            where: {
                // get those employee whose birthday is today
                [Op.and]: [
                    db.sequelize.where(db.sequelize.fn("DAY", db.sequelize.col("dateOfBirth")), "=", new Date().getDate()),
                    db.sequelize.where(db.sequelize.fn("MONTH", db.sequelize.col("dateOfBirth")), "=", new Date().getMonth() + 1),
                ],
            },
        });
        if (result.length > 0) {
            return result.map((item) => {
                return {
                    birthdayName: item.firstName + " " + item.lastName,
                    birthdayImage: item.employeeImage,
                };
            }
            );

        }
        return [];
    } catch (error) {
        return false;
    }
}

module.exports = {
    getBirthday
}