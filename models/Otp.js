module.exports = (sequelize, DataTypes) => {
    const OTPs = sequelize.define("Otp", {
      emailId: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      OTP: {
        type: DataTypes.INTEGER,
        allowNull: false            
      }
  
    });
    return OTPs;
  }
  
  