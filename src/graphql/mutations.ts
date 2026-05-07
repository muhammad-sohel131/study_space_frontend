import { gql } from 'graphql-request';

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($createBookingInput: CreateBookingInput!) {
    createBooking(createBookingInput: $createBookingInput) {
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

export const INIT_PAYMENT = gql`
  mutation InitPayment($bookingId: String!) {
    initPayment(bookingId: $bookingId) {
      paymentUrl
    }
  }
`;

export const BUY_BOOK = gql`
  mutation BuyBook($createOrderInput: CreateOrderInput!) {
    buyBook(createOrderInput: $createOrderInput) {
      id
      userId
      bookId
      quantity
      type
      status
    }
  }
`;

export const BORROW_BOOK = gql`
  mutation BorrowBook($createOrderInput: CreateOrderInput!) {
    borrowBook(createOrderInput: $createOrderInput) {
      id
      userId
      bookId
      quantity
      type
      status
    }
  }
`;
