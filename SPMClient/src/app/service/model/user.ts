export class User {

    constructor(
      public name: string,
      public surname: string,
      public account: Account
    ) {}
  }

  export class Account {
      constructor(
          public email: string, // è l'username
          public password:string
      ){}
  }