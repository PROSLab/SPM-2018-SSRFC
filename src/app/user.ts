export class User {

    constructor(
      public name: string,
      public surname: string,
      public date: Date, //da vedere se è date o string
      public account: Account
    ) {}
  }

  export class Account {
      constructor(
          public email: string,
          public username:string,
          public password:string
      ){}
  }