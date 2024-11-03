export const Gender = {
  Male: 0,
  Female: 1,
  Other: 2
};

export const UserRole = {
  Customer: 0,
  Staff: 1,
  Manager: 2,
  Admin: 3
};

export const TourTemplateStatus = {
  Draft: 0,
  Pending: 1,
  Approved: 2,
  Rejected: 3
};

export const AttractionStatus = {
  Draft: 0,
  Pending: 1,
  Approved: 2,
  Rejected: 3
};

export const TourStatus = {
  Pending: 0,
  Rejected: 1,
  Scheduled: 2,
  Closed: 3,
  OnGoing: 4,
  Completed: 5,
  Cancelled: 6
};

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Completed: 2,
  Expired: 3,
  Cancelled: 4,
  PendingRefund: 5,
  Refunded: 6
};

export const PaymentStatus = {
  Pending: 0,
  Paid: 1,
  Failed: 2,
  Refunded: 3
};

export const EntityType = {
  Attraction: 0,
  AttractionType: 1,
  Booking: 2,
  Customer: 3,
  Event: 4,
  Manager: 5,
  Post: 6,
  Province: 7,
  Staff: 8,
  Tour: 9,
  TourBooking: 10,
  TourCategory: 11,
  TourDuration: 12,
  TourTemplate: 13
};

export const EventStatus = {
  Draft: 0,
  Pending: 1,
  Approved: 2,
  Rejected: 3
};

export const PostStatus = {
  Draft: 0,
  Pending: 1,
  Approved: 2,
  Rejected: 3
};

export const EntityModifyAction = {
  Create: 0,
  Update: 1,
  ChangeStatus: 2,
  Delete: 3
};
