import { gql } from 'graphql-request';

export const GET_CENTERS = gql`
  query GetCenters($page: Int, $limit: Int) {
    centers(page: $page, limit: $limit) {
      data {
        id
        name
        location
        openingTime
        closingTime
        coverImage
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_CENTER = gql`
  query GetCenter($id: String!) {
    center(id: $id) {
      id
      name
      location
      openingTime
      closingTime
      coverImage
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
      x
      y
      bookings {
        startTime
        endTime
      }
    }
  }
`;

export const GET_SEATS_BY_CENTER = gql`
  query GetSeatsByCenter($centerId: String!) {
    seats(centerId: $centerId) {
      id
      centerId
      seatNumber
      type
      pricePerHour
      pricePerMonth
      isActive
      x
      y
      bookings {
        id
        startTime
        endTime
        status
        paymentStatus
        createdAt
        user {
          name
          email
        }
      }
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings($page: Int, $limit: Int) {
    myBookings(page: $page, limit: $limit) {
      data {
        id
        centerId
        seatId
        startTime
        endTime
        bookingType
        totalPrice
        paymentStatus
        status
        createdAt
        center {
          id
          name
          location
          openingTime
          closingTime
        }
        seat {
          seatNumber
          type
          pricePerHour
          pricePerMonth
        }
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings($page: Int, $limit: Int) {
    allBookings(page: $page, limit: $limit) {
      data {
        id
        centerId
        seatId
        startTime
        endTime
        bookingType
        totalPrice
        paymentStatus
        status
        seat {
          seatNumber
          type
        }
        center {
          name
          location
        }
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_ALL_PAYMENTS = gql`
  query GetAllPayments {
    allPayments {
      id
      bookingId
      userId
      amount
      transactionId
      status
      createdAt
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks($centerId: String, $page: Int, $limit: Int) {
    books(centerId: $centerId, page: $page, limit: $limit) {
      data {
        id
        centerId
        title
        author
        productType
        price
        stock
        coverImageUrl
        previewPdfUrl
        fullPdfUrl
      }
      totalCount
      totalPages
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      bookId
      quantity
      totalAmount
      paymentStatus
      status
      book {
        title
        author
        productType
        coverImageUrl
        previewPdfUrl
        fullPdfUrl
      }
    }
  }
`;
