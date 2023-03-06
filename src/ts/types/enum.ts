export enum Category {
  keyboards = '키보드',
  keycaps = '키캡',
  switches = '스위치',
  accessories = '액세서리',
}

export enum CartOperation {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
  DELETE = 'delete',
}

export enum CategorySortCondition {
  RESET = 'reset',
  LOW_TO_HIGH = 'LowToHigh',
  High_TO_LOW = 'HighToLow',
}

export enum OrderStatus {
  DONE = '구매 확정',
  CANCELED = '구매 취소',
  COMPLETED = '구매 완료',
}
