export class UserData {
  private access_token: string;
  private user: {
    firstName: string,
    lastName: string,
    player: {
      id: number;
    };
  };

  public get token() {
    return this.access_token
  }

  public get id() {
    return this.user.player.id
  }

  public get name() {
    return this.user.firstName + ' ' + this.user.lastName
  }
}
