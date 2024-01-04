export enum StatusCode {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum MessageCode {
  Success = 1,
  Failure = 0,
}

export type Nullable<T> = T | null;

export class ResponseMessage {
  constructor(
    public code: MessageCode,
    public message: Nullable<string>,
    public id: Nullable<string> = null,
  ) {}
}

export type ListResponse<T> = {
  items: T[];
  totalCount: number;
};

export interface ICriteria<T = string> {
  field: string;
  value: T;
  operator: '$regex' | '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$in' | '$nin' | '$ne' | '$exists' | '$all';
}

export interface IQueryCriteria<T> {
  operator: '$or' | '$and';
  criterias: ICriteria<T>[];
}

export interface IParams<T = string> {
  page?: string;
  count?: string;
  sort?: T;
}

export enum Intensity {
  None = 0,
  VeryLow = 1,
  Low = 2,
  Mild = 3,
  Moderate = 4,
  Medium = 5,
  High = 6,
  VeryHigh = 7,
  Intense = 8,
  Extreme = 9,
  Maximum = 10,
}