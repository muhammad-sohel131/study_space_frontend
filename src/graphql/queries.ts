import { gql } from 'graphql-request';

export const GET_CENTERS = gql`
 query GetCenters {
 centers {
 id
 name
 location
 openingTime
 closingTime
 }
 }
`;

export const GET_AVAILABLE_SEATS = gql`
 query GetAvailableSeats($centerId: String!, $startTime: String!, $endTime: String!) {
 availableSeats(centerId: $centerId, startTime: $startTime, endTime: $endTime) {
 id
 centerId
 seatNumber
 type
 pricePerHour
 pricePerMonth
 isActive
 }
 }
`;

export const GET_MY_BOOKINGS = gql`
 query GetMyBookings {
 myBookings {
 id
 centerId
 seatId
 startTime
 endTime
 bookingType
 totalPrice
 paymentStatus
 status
 }
 }
`;

export const GET_BOOKS = gql`
 query GetBooks($centerId: String) {
 books(centerId: $centerId) {
 id
 centerId
 title
 author
 type
 price
 stock
 }
 }
`;
