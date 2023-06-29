const User = require('./user');
const Vehicle = require('./vehicle');
const Tour = require('./tour');
const Reservation = require('./reservation');
const Token = require('./token');
const Profile = require('./profile');
const TourItinerary = require('./tourItinerary');
const TourHighlight = require('./tourHighlight');
const VehicleImage = require('./vehicleImage');
const TourImage = require('./tourImage');
const Banner = require('./banner');
const TourDate = require('./tourDate');

User.hasOne(Profile, { onDelete: 'CASCADE' });
Profile.belongsTo(User, { onDelete: 'RESTRICT' });
User.hasOne(Token, { onDelete: 'CASCADE' });
Token.belongsTo(User);
User.hasMany(Reservation, { onDelete: 'NO ACTION' });
Reservation.belongsTo(User);
Vehicle.hasMany(Reservation, { onDelete: 'NO ACTION' });
Reservation.belongsTo(Vehicle);
Tour.hasMany(Reservation, { onDelete: 'NO ACTION' });
Reservation.belongsTo(Tour);
Vehicle.hasMany(VehicleImage, { onDelete: 'CASCADE' });
VehicleImage.belongsTo(Vehicle);
Tour.hasMany(TourDate, { onDelete: 'CASCADE' });
TourDate.belongsTo(Tour);
Tour.hasMany(TourItinerary, { onDelete: 'CASCADE' });
TourItinerary.belongsTo(Tour);
Tour.hasMany(TourHighlight, { onDelete: 'CASCADE' });
TourHighlight.belongsTo(Tour);
Tour.hasMany(TourImage, { onDelete: 'CASCADE' });
TourImage.belongsTo(Tour);

module.exports = {
  User,
  Vehicle,
  Tour,
  Reservation,
  Token,
  Profile,
  VehicleImage,
  TourDate,
  TourItinerary,
  TourHighlight,
  TourImage,
  Banner,
};
