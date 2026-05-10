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

export const CREATE_CENTER = gql`
  mutation CreateCenter($createCenterInput: CreateCenterInput!) {
    createCenter(createCenterInput: $createCenterInput) {
      id
      name
      location
      openingTime
      closingTime
      coverImage
    }
  }
`;

export const UPDATE_CENTER = gql`
  mutation UpdateCenter($updateCenterInput: UpdateCenterInput!) {
    updateCenter(updateCenterInput: $updateCenterInput) {
      id
      name
      location
      openingTime
      closingTime
      coverImage
    }
  }
`;

export const DELETE_CENTER = gql`
  mutation DeleteCenter($id: String!) {
    deleteCenter(id: $id)
  }
`;

export const CREATE_SEAT = gql`
  mutation CreateSeat($createSeatInput: CreateSeatInput!) {
    createSeat(createSeatInput: $createSeatInput) {
      id
      seatNumber
      type
      pricePerHour
      pricePerMonth
      x
      y
    }
  }
`;

export const UPDATE_SEAT = gql`
  mutation UpdateSeat($updateSeatInput: UpdateSeatInput!) {
    updateSeat(updateSeatInput: $updateSeatInput) {
      id
      seatNumber
      type
      pricePerHour
      pricePerMonth
      x
      y
    }
  }
`;

export const DELETE_SEAT = gql`
  mutation DeleteSeat($id: String!) {
    deleteSeat(id: $id)
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: String!) {
    cancelBooking(bookingId: $bookingId) {
      id
      status
    }
  }
`;
