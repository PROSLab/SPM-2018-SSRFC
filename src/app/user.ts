export class User {

    constructor(
      public name: string,
      public surname: string,
      public date: Date, //da vedere se è date o string
      public email: string,
      public account: Account
    ) {}
  
  }

  export class Account{
      constructor(
          public username:string,
          public password:string
      ){}
  }